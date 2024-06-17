import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";



const Router = express.Router();

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/forgot-password").post(forgotPassword);
Router.route("/reset-password/:id/:token").post(resetPassword);
export const authenticationRoute = Router;
