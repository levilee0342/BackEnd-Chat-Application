import ChatMember from "~/models/chatMemberModel";
import ChatRoom from "~/models/chatRoomModel";
import User from "~/models/userModel";
import { Op, Sequelize, where } from "sequelize";
import { sequelize } from "~/config/mysql";
import { Types } from "mongoose";
import Message from "~/models/messageModel";
const accessChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const chatRoom = await ChatRoom.findAll({
      where: { isGroup: false },
      attributes: ["chatRoomId"],
      include: [
        {
          model: User,
          through: {
            model: ChatMember,
            attributes: [],
          },
          where: {
            userId: {
              [Op.in]: [userId, req.user.userId],
            },
          },
          attributes: [],
        },
      ],
      group: ["chat_room.chatRoomId"],
      having: Sequelize.literal("COUNT(DISTINCT `users`.`userId`) = 2"),
    });
    if (chatRoom.length > 0) {
      return res.json({
        exists: true,
      });
    }
    let newChatRoom = await ChatRoom.create({
      name: "sender",
      isGroup: false,
      lastMessage: "",
    });
    await newChatRoom.addUser([userId, req.user.userId]);
    const result = await ChatRoom.findOne({
      where: {
        chatRoomId: newChatRoom.chatRoomId,
      },
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "createAt", "updatedAt"] },
          through: {
            model: ChatMember,
            attributes: [],
          },
        },
      ],
    });
    res.json({
      exists: false,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const fetchChat = async (req, res) => {
  try {
    const { userId } = req.user;
    const getGroupChat = await ChatMember.findAll({
      where: { userId: userId },
      attributes: ["chatRoomId"],
    }).then((groupsId) => {
      return groupsId.map((groupId) => groupId.chatRoomId);
    });
    const allChatRoom = await ChatRoom.findAll({
      where: {
        chatRoomId: {
          [Op.in]: getGroupChat,
        },
      },
      attributes: ["chatRoomId", "name", "photo", "isGroup", "latestMessage"],
      include: [
        {
          model: User,
          attributes: ["userId", "name"],
        },
      ],
    });
    const result = await Promise.all(
      allChatRoom.map(async (room) => {
        if (room.dataValues.latestMessage === null) return room.dataValues;
        const latestMessage = await Message.findById(
          room.dataValues.latestMessage
        );
        return { ...room.dataValues, latestMessage: latestMessage.content };
      })
    );
    res.status(200).json({
      message: "fetch successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const createGroupChat = async (req, res) => {
  let transaction;
  try {
    const { users } = req.body;
    users.unshift(req.user.userId);
    console.log(req.user);
    // Bắt đầu giao tác
    transaction = await sequelize.transaction();

    // Tạo nhóm chat
    const chatRoom = await ChatRoom.create(
      {
        name: "New group",
        isGroup: true,
        photo: null,
        latestMessage: null,
      },
      { transaction }
    );

    const chatRoomId = chatRoom.chatRoomId;

    // Kiểm tra người đầu tiên
    let isFirstUser = true;

    const chatMembers = [];
    for (const userId of users) {
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback(); // rollback nếu không tìm thấy người dùng
        return res.status(400).json({ error: `User with id ${userId} not found` });
      }

      const isAdmin = isFirstUser; // Xác định người đầu tiên làm admin
      isFirstUser = false;

      const chatMember = await ChatMember.create(
        {
          userId: user.userId,
          chatRoomId,
          isAdmin,
        },
        { transaction }
      );
      await chatRoom.addUser(user, { through: chatMember, transaction });

      // Thêm thông tin thành viên vào danh sách response
      chatMembers.push({
        id: user.userId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        chatMember: [{ isAdmin }],
      });
    }

    // Commit giao tác nếu mọi thứ đều thành công
    await transaction.commit();

    // Trả về response
    return res.status(201).json({
      chatId: chatRoomId, // Sử dụng chatRoomId đã lấy
      name: chatRoom.name,
      isGroup: chatRoom.isGroup,
      photo: chatRoom.photo,
      users: chatMembers,
      latestMessage: chatRoom.latestMessage,
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    if (transaction) await transaction.rollback(); // Hoàn tác giao tác nếu có lỗi
    return res.status(500).json({ error: "Internal server error" });
  }
};

const renameGroupChat = async (req, res) => {
  const { userId } = req.user;
  const { groupId, newNameGroup } = req.body;
  try {
    const member = await ChatRoom.findOne({
      where: { chatRoomId: groupId, isGroup: 1 },
      include: [
        {
          model: User,
          through: {
            model: ChatMember,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          attributes: ["name", "avatar", "userId"],
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (member !== null && member.users.map((idUser) => idUser.userId).includes(userId)) {
      await ChatRoom.update(
        {
          name: newNameGroup,
        },
        { where: { chatRoomId: groupId } }
      );
      res.status(200).json({
        Message: "rename group name successfully",
        data: member,
      });
    } else {
      res.status(405).json({
        Message: "This user don't have permission or in this group to change properties of group",
      });
    }
  } catch (error) {
    res.status(400).json({
      Message: "Fail to rename this group",
      data: error.message,
    });
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { userId, chatRoomId } = req.body;
    const adminId = req.user.userId;

    // Kiểm tra xem người dùng hiện tại có phải là quản trị viên của nhóm không
    const adminGroup = await ChatMember.findOne({
      where: { userId: adminId, chatRoomId },
    });
    if (!adminGroup || !adminGroup.isAdmin) {
      return res.status(403).json({
        error: "You are not authorized to remove members from this group",
      });
    }

    // Kiểm tra xem người dùng muốn xóa có tồn tại trong nhóm không
    const memberToRemove = await ChatMember.findOne({
      where: { userId, chatRoomId },
    });
    if (!memberToRemove) {
      return res.status(404).json({
        error: `User with id ${userId} is not a member of this group`,
      });
    }

    // Xóa người dùng khỏi nhóm chat
    await memberToRemove.destroy();

    // Trả về response
    return res.status(200).json({ message: "Remove member from group successfully" });
  } catch (error) {
    console.error("Error removing member from group:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addGroup = async (req, res, next) => {
  try {
    const { userId, chatRoomId } = req.body;
    const chatGroup = await ChatRoom.findOne({
      where: { chatRoomId: chatRoomId },
    });
    const getArrayUser = userId.map(Number);
    await getArrayUser.forEach((ID) => {
      const userExist = User.findOne({ where: { userId: ID } });
      if (chatGroup && userExist) {
        ChatMember.create({
          isAdmin: false,
          chatRoomId: chatRoomId,
          userId: ID,
        });
      }
    });
    res.status(200).json({ message: "Add to group successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

export { accessChat, addGroup, createGroupChat, renameGroupChat, removeFromGroup, fetchChat };
