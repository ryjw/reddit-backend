import express from "express";
import { prisma } from "../index.js";

export const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { username: true, id: true } },
        subreddit: true,
        upvotes: true,
        downvotes: true,
        children: true,
      },
    });
    res.send({ success: true, posts });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

postRouter.post("/", async (req, res) => {
  // need to include text, title, subredditid, userid, parentid?
  try {
    const { text, title, subredditId, parentId } = req.body;
    // error handling
    if (!text || !subredditId) {
      return res.send({
        success: false,
        error:
          "Please include both text and the subreddit when creating a post",
      });
    }
    if (!req.user) {
      return res.send({
        success: false,
        error: "Please log in to create a post",
      });
    }
    // create the post
    const post = await prisma.post.create({
      data: {
        text,
        title,
        subredditId,
        parentId,
        userId: req.user.id,
      },
    });
    res.send({ success: true, post });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// put req

postRouter.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, title } = req.body;
    // error handling
    const postCheck = await prisma.post.findUnique({ where: { id: postId } });
    if (!postCheck) {
      return res.send({
        success: false,
        error: "The post you are trying to edit does not exist",
      });
    }
    if (!text && !title) {
      return res.send({
        success: false,
        error: "You should modify either the text or title",
      });
    }
    if (postCheck.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "The post you are trying to modify is not yours",
      });
    }
    // finally we update the post
    const post = await prisma.post.update({
      where: { id: postId },
      data: { text, title },
    });
    res.send({ success: true, post });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// delete request

postRouter.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    // error handling
    const postCheck = await prisma.post.findUnique({ where: { id: postId } });
    if (!postCheck) {
      return res.send({
        success: false,
        error: "The post you are trying to edit does not exist",
      });
    }
    if (postCheck.userId !== req.user.id) {
      return res.send({
        success: false,
        error: "The post you are trying to modify is not yours",
      });
    }
    // finally we update the post
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.send({ success: true, post });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
