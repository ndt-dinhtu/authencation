import express from "express";
import {
  authMe,
  getAllUsers,
  searchUserByUsername,
  test,
  uploadAvatar,
} from "../controller/userController.js";
import { upload } from "../middlerwares/uploadMiddlerwares.js";
const router = express.Router();

router.get("/me", authMe);
router.get("/test", test);
router.get("/getAllUsers", getAllUsers);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
export default router;
