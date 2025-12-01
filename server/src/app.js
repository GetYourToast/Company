import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

import webhookRoutes from "./routes/webhookRoutes.js";

app.use(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" })
);

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://company-xsas.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));
app.use(express.json());


app.use(bodyParser.json());




import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/webhooks", webhookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Toast backend is running 🚀" });
});

export default app;
