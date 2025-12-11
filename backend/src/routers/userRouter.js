import express from "express";
import { authMe,getAllUsers,test } from "../controller/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/test",test)
router.get("/getAllUsers",getAllUsers)

export default router;
