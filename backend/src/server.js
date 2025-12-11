import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectionDB } from "./libs/db.js";
import authRoute from "./routers/authRoute.js";
import userRouter from "./routers/userRouter.js";
import messageRoute from "./routers/messageRoute.js";
import friendRoute from "./routers/friendRoute.js";
import conversationRoute from "./routers/conversationRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlerwares/authMiddlerWares.js";
import SwaggerUI from "swagger-ui-express";
import fs from "fs";
 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.SWAGGER_URL],
    credentials: true,
  })
);

//swagger
const swaggerDocument = JSON.parse(
  fs.readFileSync("./src/swagger.json", "utf-8")
);
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

//public routes
app.use("/api/auth", authRoute);

//private routes
app.use(protectedRoute);
app.use("/api/users", userRouter);
app.use("/api/friends", friendRoute);
app.use("/api/message", messageRoute);
app.use("/api/conversations", conversationRoute);

connectionDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Sever dang chay tren cong ${PORT}`);
  });
});
