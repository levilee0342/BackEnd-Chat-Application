import express from "express";
import { searchById, searchByName, changePassword } from "~/controllers/userController";
import { authGuard } from "~/middlewares/authMiddleware";
const Router = express.Router();
Router.route("/").get(authGuard, searchByName);
Router.route("/:id").get(authGuard, searchById);
Router.route("/change-password").post(authGuard, changePassword);
export const userRoute = Router;
