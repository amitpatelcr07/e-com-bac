import express from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { verifyAdmin } from "../middleware/role.middleware.js";
import router from "./auth.routes.js";
import upload from "../middleware/multer.js";

const fouter = express.Router();

// Route for uploading images, protected by verifyAdmin middleware
router.use(verifyAdmin);
router.post("/uploadImg", upload.single("image"), uploadImage);

export default router;