import express from "express";

import {
  accessChat,
  createGroupChat,
  removeFromGroup,
  addGroup,
  fetchChat,
  renameGroupChat,
} from "~/controllers/chatController";
import { GetInformationUser } from "~/controllers/userController";
import { searchById } from "~/controllers/userController";
import { authGuard } from "~/middlewares/authMiddleware";

const Router = express.Router();
Router.route("/").post(authGuard, accessChat).get(authGuard, fetchChat);
Router.route("/create-group-chat").post(authGuard, createGroupChat);
Router.route("/rename-group-chat").post(authGuard, renameGroupChat);
Router.route("/remove-from-group").put(authGuard, removeFromGroup);
Router.route("/add-to-group").post(authGuard, addGroup);
export const chatRoute = Router;
