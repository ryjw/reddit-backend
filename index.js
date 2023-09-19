import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { postRouter } from "./routes/postRouter.js";
import { subredditRouter } from "./routes/subredditRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { voteRouter } from "./routes/voteRouter.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
export const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next();
    }
    const token = req.headers.authorization.split(" ")[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return next();
    }
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

app.use("/posts", postRouter);
app.use("/subreddits", subredditRouter);
app.use("/users", userRouter);
app.use("/votes", voteRouter);

app.use((req, res) => {
  res.send({ success: false, error: "No route found." });
});

app.use((error, req, res, next) => {
  res.send({ success: false, error: error.message });
});

app.listen(3000, () => console.log("Server is up!"));
