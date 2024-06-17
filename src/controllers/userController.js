import { where, Op } from "sequelize";
import User from "../models/userModel";
import { hash, genSalt, compare } from "bcrypt";

const searchByName = async (req, res, next) => {
  try {
    const nameSearch = req.query.search;
    const userSearch = await User.findAll({
      attributes: ["userId", "name", "birth", "avatar"],
      where: {
        name: {
          [Op.like]: `%${nameSearch}%`,
        },
      },
    });
    res.status(200).json({
      message: "Search successfully",
      data: userSearch,
    });
  } catch (error) {
    next(error);
  }
};
const searchById = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(`id: ${id}`);
    const userSearch = await User.findOne({
      attributes: ["userId", "name", "birth", "avatar"],
      where: {
        userId: {
          [Op.eq]: id,
        },
      },
    });
    if (!userSearch) {
      res.status(400).json({
        message: "User doesn't exist",
      });
    } else {
      res.status(200).json({
        message: "Search successfully",
        data: userSearch,
      });
    }
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const userId = req.user.userId; 
    const user = await User.findOne({ where: { userId } });

    // Kiểm tra xem mật khẩu cũ có khớp không
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau không
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Kiểm tra mật khẩu mới và mật khẩu cũ có bị trùng không
    if (newPassword === password) {
      return res.status(400).json({ message: "New password and old password do not permit match" });
    }

    // Tạo salt mới và hash mật khẩu mới
    const salt = await genSalt(10);
    const hashedPassword = await hash(newPassword, salt);

    // Cập nhật mật khẩu mới cho user
    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: "Change password successfully" });
  } catch (error) {
    next(error);
  }
}; 


export { searchByName, searchById, changePassword };
