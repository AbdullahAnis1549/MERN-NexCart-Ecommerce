import express from "express";
import { contact } from "../Controllers/ContactController.js";

const contactRouter = express.Router();

contactRouter.post("/contact", contact);

export default contactRouter;
