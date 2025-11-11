import express from "express";
import dotenv from "dotenv";
import { connectionDB } from "./libs/db.js";
import authRoute from "./routers/authRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());

//public routes
app.use("/api/auth", authRoute);

//private routes

connectionDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Sever dang chay tren cong ${PORT}`);
  });
});
