
import User from "~/models/userModel";

const { verify } = require("jsonwebtoken");


const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw new Error("Not authorized, no token found");
      }

      const { id } = verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        where: { userId: id },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      if (!user) {
        throw new Error("Invalid token");
      }
      req.user = user; 

      next();
    } catch (error) {
      let err = new Error(error.message);
      err.statusCode = 401;
      next(err);
    }
  } else {
    let err = new Error("Not authorized, no token");
    err.statusCode = 401;
    next(err);
  }
};
export { authGuard };
