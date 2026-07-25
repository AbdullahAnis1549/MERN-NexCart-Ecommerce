import express from "express";
import { GetAllCategory, GetCategory } from "../Controllers/CategoryControllers.js";

const CategoryRouter = express.Router();

// Public reads only (CRUD under `/admin/categories`)
CategoryRouter.get("/get", GetAllCategory);
CategoryRouter.get("/get/:id", GetCategory);

export default CategoryRouter;


