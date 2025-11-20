import express from "express";
import { refreshToken, signUp,signIn,signOut } from "../controller/authController.js";
const router = express.Router();
router.post("/signup",signUp)
router.post("/signIn",signIn)
router.post("/signOut",signOut)
router.post("/refresh",refreshToken)



export default router;
