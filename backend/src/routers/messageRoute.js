import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controller/messageController.js";

const router = express.Router();

router.post("/direct", sendDirectMessage);
router.post("/froup", sendGroupMessage);

export default router;
