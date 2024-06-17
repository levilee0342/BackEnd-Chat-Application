import express from "express";
import { fetchAllMessages, sendMessage } from "~/controllers/messageController";
import { authGuard } from "~/middlewares/authMiddleware";
const Router = express.Router();
Router.route("/:chatRoomId")
  .post(authGuard, sendMessage)
  .get(authGuard, fetchAllMessages);

export const messageRoute = Router;
