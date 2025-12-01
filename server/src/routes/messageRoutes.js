import express from "express";
import {
  sendTestMessage,
  getAllMessages,
} from "../controllers/messageController.js";

const router = express.Router();


router.post("/send-test", sendTestMessage);


router.get("/logs", getAllMessages);

export default router;
