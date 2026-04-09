import express from "express";
import { checkFriendship } from "../middlerwares/friendMiddlerwares.js";
import {
  createConversation,
  getConversation,
  getMessage,
  markAsSeen,
} from "../controller/conversationController.js";

const router = express.Router();

router.post("/",checkFriendship, createConversation);
router.get("/", getConversation);
router.get("/:conversationId/messages", getMessage);
router.patch("/:conversationId/seen",markAsSeen)

export default router;
