import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { connectionDB } from "./libs/db.js";
import authRoute from "./routers/authRoute.js";
import userRouter from "./routers/userRouter.js";
import friendRoute from "./routers/friendRoute.js"
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlerwares/authMiddlerWares.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
//public routes
app.use("/api/auth", authRoute);

//private routes
app.use(protectedRoute)
app.use("/api/users",userRouter)
app.use("/api/friends",friendRoute)

connectionDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Sever dang chay tren cong ${PORT}`);
  });
});
