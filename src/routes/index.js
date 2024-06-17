import express from "express";
import { userRoute } from "./userRoute";
import { authenticationRoute } from "./authRoute";
import { messageRoute } from "./messageRoute";
import { chatRoute } from "./chatRoute";

const Router = express.Router();
Router.use("/", authenticationRoute);
Router.use("/users", userRoute);
Router.use("/chats", chatRoute);
Router.use("/messages", messageRoute);


export const router = Router;
