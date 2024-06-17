import { generateToken } from "~/services/jwt";
import User from "~/models/userModel";
import { hash, genSalt, compare } from "bcrypt";
import sendMail from "~/utils/sendMail";
const { verify } = require("jsonwebtoken");
const register = async (req, res, next) => {
  try {
    const { name, phoneNumber, account, birth, avatar, email, password } = req.body;
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await genSalt(10);
    const hashPassword = await hash(password.trim(), salt);
    const newUser = await User.create({
      name,
      phoneNumber,
      account,
      birth,
      avatar,
      email,
      password: hashPassword,
    });
    res.status(200).json({
      message: "Register successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phoneNumber,
        birth: newUser.birth,
        account: newUser.account,
        email: newUser.email,
        avatar: newUser.avatar,
        token: generateToken({ id: newUser.userId }),
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const wrongAccountText = "The email address or password is incorrect. Please try again";
    let { email, password } = req.body;
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      compare(password, userExist.password, function (err, data) {
        if (data) {
          const Token = generateToken({ id: userExist.userId });
          res.status(200).json({
            message: "Login successfully",
            data: {
              userId: userExist.userId,
              email: userExist.email,
              name: userExist.name,
              avatar: userExist.avatar,
              token: Token,
            },
          });
        } else {
          res.status(404).json({
            message: wrongAccountText,
          });
        }
      });
    } else {
      res.status(404).json({
        message: wrongAccountText,
      });
    }
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }
    const token = generateToken({ email }, user.password, "5m");
    const link = `${process.env.CLIENT_URL}/reset-password/${user.userId}/${token}`;
    console.log(user.userId, token);
    await sendMail(email, link);
    res.status(200).json({ message: "Sent mail successfully" });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;
    const user = await User.findOne({ where: { userId: id } });
    const { email } = verify(token, process.env.JWT_SECRET + user.password);
    if (!email || user.email !== email) {
      throw new Error("Invalid token");
    }
    if (password === user.password) {
      throw new Error("New password must be different from old password");
    }
    if (password !== confirmPassword) {
      throw new Error("Password not match with confirm password");
    }
    const salt = await genSalt(10);
    const hashPassword = await hash(password.trim(), salt);
    await user.update({ password: hashPassword });
    res.status(200).json({ message: "Reset password successfully" });
  } catch (error) {
    next(error);
  }
};

export { register, login, forgotPassword, resetPassword };
