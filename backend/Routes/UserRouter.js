import express from "express";
import { Forgotpassword, Getuser, Loginuser, RegisterUser, Resetpassword, UpdateUser, VerifyUser } from "../Controllers/UserController.js";
import { uploadImage } from "../utils/Uploadimage.js";
import { Authverifyuser } from "../Middleware/Authverify.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../Middleware/validate.js";

const UserRouter = express.Router();

UserRouter.post("/register", uploadImage("image"), validateRegister, RegisterUser);

UserRouter.post("/verify", VerifyUser);

UserRouter.post("/login", validateLogin, Loginuser);

UserRouter.post("/forgotpassword", validateForgotPassword, Forgotpassword);

UserRouter.post("/resetpassword", validateResetPassword, Resetpassword);

UserRouter.get("/getuser", Authverifyuser, Getuser);

UserRouter.put(
  "/updateuser", Authverifyuser, uploadImage("image"), UpdateUser
);
export default UserRouter;