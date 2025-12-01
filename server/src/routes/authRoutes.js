import express from "express";
import { register, getUser } from "../controllers/authController.js";

const router = express.Router();


router.post("/register", register);


router.get("/me", getUser);

export default router;
