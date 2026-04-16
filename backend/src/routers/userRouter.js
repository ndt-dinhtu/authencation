import express from "express";
import {
  authMe,
  getAllUsers,
  searchUserByUsername,
  uploadAvatar,
} from "../controller/userController.js";
import { upload } from "../middlewares/uploadMiddlerwares.js";
const router = express.Router();

router.get("/me", authMe);
router.get("/getAllUsers", getAllUsers);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
router.put("/me", authMe);
export default router;
