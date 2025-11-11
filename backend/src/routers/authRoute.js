import express from "express";
import { signUp } from "../controller/authController.js";
import { signIn } from "../controller/authController.js";
import { signOut } from "../controller/authController.js";
const router = express.Router();
router.post("/signup",signUp)
router.post("/signIn",signIn)
router.post("/signOut",signOut)




export default router;
