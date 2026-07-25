import express from 'express'
import { GetAllBanners } from '../Controllers/BannerControllers.js'

const BannerRouter = express.Router()

// Public reads only (CRUD under `/admin/banners`)
BannerRouter.get("/get", GetAllBanners)
export default BannerRouter;

