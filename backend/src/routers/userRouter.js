import express from "express";
import { authMe,getAllUsers,searchUserByUsername,test } from "../controller/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/test",test)
router.get("/getAllUsers",getAllUsers)
router.get("/search",searchUserByUsername)
export default router;
