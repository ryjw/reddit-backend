import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

export const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // error check for username and password both present
    if (!username || !password) {
      return res.send({
        success: false,
        error: "Please enter both a username and password to register",
      });
    }
    // check to see if the user already exists
    const userCheck = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userCheck) {
      return res.send({
        success: false,
        error: "username already exists, please login",
      });
    }
    // hash the password and create the user in the db
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    // create the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.send({
      success: true,
      token,
    });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // error check for username and password both present
    if (!username || !password) {
      return res.send({
        success: false,
        error: "Please enter both a username and password to login",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    // error handling for no user
    if (!user) {
      return res.send({ success: false, error: "Wrong username or password" });
    }
    // check for valid password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({ success: false, error: "Wrong username or password" });
    }
    // now that we have a valid pw, create a token and send it
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.send({ success: true, token });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

userRouter.get("/token", (req, res) => {
  try {
    if (!req.user) {
      return res.send({ success: false, error: "You must first be logged in" });
    }
    res.send({ success: true, user: req.user });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
