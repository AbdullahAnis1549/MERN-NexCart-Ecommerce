import express from "express";
import {CreateProduct,DeleteProduct,GetAllProduct,GetProduct,UpdateProduct,} from "../Controllers/ProductControllers.js";
import { AdminAuthverifyuser } from "../Middleware/AdminProtected.js";
import { uploadImage } from "../utils/Uploadimage.js";

const ProductRouter = express.Router();

// Public reads only (CRUD under `/admin/products`)
ProductRouter.get("/get", GetAllProduct);
ProductRouter.get("/get/:id", GetProduct);


export default ProductRouter;
