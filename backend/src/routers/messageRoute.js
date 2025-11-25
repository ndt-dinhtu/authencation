import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controller/messageController.js";
import { checkFriendship } from "../middlerwares/friendMiddlerWares.js";

const router = express.Router();

router.post("/direct",checkFriendship, sendDirectMessage);
router.post("/froup", sendGroupMessage);

export default router;
