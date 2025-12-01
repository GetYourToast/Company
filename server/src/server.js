import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import "./cron/dailyMessageCron.js"; 
connectDB();


const PORT = process.env.PORT || 6500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
