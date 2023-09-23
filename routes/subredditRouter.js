import express from "express";
import { prisma } from "../index.js";

export const subredditRouter = express.Router();

subredditRouter.get("/", async (req, res) => {
  try {
    const subreddits = await prisma.subreddit.findMany();
    res.send({ success: true, subreddits });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

subredditRouter.post("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.send({
        success: false,
        error: "Please log in to create a subreddit",
      });
    }
    const userId = req.user.id;
    const { name } = req.body;
    if (!name) {
      return res.send({
        success: false,
        error: "Please include a name for the subreddit",
      });
    }
    // check if subreddit exists already
    const isExisting = await prisma.subreddit.findUnique({ where: { name } });
    if (isExisting) {
      return res.send({ success: false, error: "Subreddit already exists" });
    }
    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        userId,
      },
    });
    res.send({ success: true, subreddit });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

subredditRouter.delete("/:subredditId", async (req, res) => {
  try {
    if (!req.user) {
      return res.send({
        success: false,
        error: "Please log in to delete your subreddit",
      });
    }
    const userId = req.user.id;
    const { subredditId } = req.params;
    // check subreddit exists and return an error if not
    const isExisting = await prisma.subreddit.findUnique({
      where: { id: subredditId },
    });
    if (!isExisting) {
      return res.send({ success: false, error: "Subreddit doesn't exist" });
    }
    // check subreddit belongs to the user and throw an error if not
    if (userId !== isExisting.userId) {
      return res.send({
        success: false,
        error: "You don't own the subreddit you're trying to delete",
      });
    }
    // now we are ready to delete the subreddit
    const subreddit = await prisma.subreddit.delete({
      where: {
        id: subredditId,
      },
    });
    res.send({ success: true, subreddit });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
