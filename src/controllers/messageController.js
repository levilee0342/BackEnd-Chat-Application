import ChatMember from "~/models/chatMemberModel";
import ChatRoom from "~/models/chatRoomModel";
import Message from "~/models/messageModel";
import User from "~/models/userModel";

const sendMessage = async (req, res, next) => {
  const { chatRoomId } = req.params;
  const { content } = req.body;
  try {
    const chatMember = await ChatMember.findOne({
      where: {
        chatRoomId,
        userId: req.user.userId,
      },
    });
    if (!chatMember) {
      throw new Error("You are not a member of this chat room");
      return;
    }
    const message = new Message({
      from: req.user.userId,
      to: chatRoomId,
      content,
    });
    const newMessage = await message.save();
    const [updated] = await ChatRoom.update(
      { latestMessage: newMessage._id.toString() },
      {
        where: {
          chatRoomId: chatRoomId,
        },
      }
    );
    let chatRoom;
    if (updated) {
      chatRoom = await ChatRoom.findOne({
        where: { chatRoomId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    }
    res.status(201).json({
      from: {
        ...req.user.dataValues,
      },
      to: {
        ...chatRoom.dataValues,
      },
      content,
    });
  } catch (error) {
    next(error);
  }
};
const fetchAllMessages = async (req, res, next) => {
  const { chatRoomId } = req.params;
  try {
    const isOwner = await ChatMember.findOne({
      where: { chatRoomId, userId: req.user.userId },
    });
    if (!isOwner) {
      throw new Error("User can not fetch messages from this chat room");
    }
    const messages = await Message.find({ to: chatRoomId });
    const result = await Promise.all(
      messages.map(async (message) => {
        const user =
          message.from === req.user.userId
            ? req.user
            : await User.findOne({
                where: { userId: message.from },
                attributes: { exclude: ["password", "createdAt", "updatedAt"] },
              });
        const chatRoom = await ChatRoom.findOne({
          where: { chatRoomId: message.to },
          include: [
            {
              model: User,
              through: {
                model: ChatMember,
                attributes: [],
              },
              attributes: { exclude: ["password", "createdAt", "updatedAt"] },
            },
          ],
        });
        return { ...message.toJSON(), from: user, to: chatRoom };
      })
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export { sendMessage, fetchAllMessages };
