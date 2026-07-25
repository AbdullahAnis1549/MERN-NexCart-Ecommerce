import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.Cloudinaryname,
  api_key: process.env.Cloudinarykey,
  api_secret: process.env.Cloudinarysecret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

export const uploadImage = (fieldName) => upload.single(fieldName);

export default cloudinary;