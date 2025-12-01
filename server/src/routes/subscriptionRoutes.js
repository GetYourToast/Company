import express from "express";
import {
  createSubscription,
  verifySubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();


router.post("/create", createSubscription);


router.post("/verify", verifySubscription);

export default router;
