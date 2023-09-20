import express from "express";
import { prisma } from "../index.js";

export const voteRouter = express.Router();

// create upvote
voteRouter.post("/upvotes/:postId", async (req, res) => {
  try {
    if (!req.user) {
      return res.send({ success: false, error: "Please log in to vote" });
    }
    // pull the user Id
    const userId = req.user.id;
    // destructure the post id then see if the post exists
    const { postId } = req.params;
    const isValidPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!isValidPost) {
      return res.send({ success: false, error: "No such post exists" });
    }
    // // see if the upvote already exists
    const isUpvoted = await prisma.upvote.findUnique({
      where: {
        upvoteId: {
          userId,
          postId,
        },
      },
    });
    if (isUpvoted) {
      return res.send({ success: false, error: "Already upvoted" });
    }
    // finally we create the upvote
    const upvote = await prisma.upvote.create({
      data: {
        userId,
        postId,
      },
    });
    res.send({ success: true, upvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// create downvote
voteRouter.post("/downvotes/:postId", async (req, res) => {
  try {
    if (!req.user) {
      return res.send({ success: false, error: "Please log in to vote" });
    }
    // pull the user Id
    const userId = req.user.id;
    // destructure the post id then see if the post exists
    const { postId } = req.params;
    const isValidPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!isValidPost) {
      return res.send({ success: false, error: "No such post exists" });
    }
    // // see if the downvote already exists
    const isDownvoted = await prisma.downvote.findUnique({
      where: {
        downvoteId: {
          userId,
          postId,
        },
      },
    });
    if (isDownvoted) {
      return res.send({ success: false, error: "Already downvoted" });
    }
    // finally we create the upvote
    const downvote = await prisma.downvote.create({
      data: {
        userId,
        postId,
      },
    });
    res.send({ success: true, downvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// delete upvote
voteRouter.delete("/upvotes/:postId", async (req, res) => {
  try {
    if (!req.user) {
      return res.send({
        success: false,
        error: "Please log in to delete your vote",
      });
    }
    // pull the user Id
    const userId = req.user.id;
    // destructure the post id then see if the post exists
    const { postId } = req.params;
    const isValidPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!isValidPost) {
      return res.send({ success: false, error: "No such post exists" });
    }
    // // see if the upvote does or doesn't exist
    const isUpvoted = await prisma.upvote.findUnique({
      where: {
        upvoteId: {
          userId,
          postId,
        },
      },
    });
    if (!isUpvoted) {
      return res.send({ success: false, error: "Upvote doesn't exist" });
    }
    // finally we delete the upvote, using the id just returned to us
    const upvote = await prisma.upvote.delete({
      where: {
        id: isUpvoted.id,
      },
    });
    res.send({ success: true, upvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// delete downvote
voteRouter.delete("/downvotes/:postId", async (req, res) => {
  try {
    if (!req.user) {
      return res.send({
        success: false,
        error: "Please log in to delete your vote",
      });
    }
    // pull the user Id
    const userId = req.user.id;
    // destructure the post id then see if the post exists
    const { postId } = req.params;
    const isValidPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!isValidPost) {
      return res.send({ success: false, error: "No such post exists" });
    }
    // // see if the downvote does or doesn't exist
    const isDownvoted = await prisma.downvote.findUnique({
      where: {
        downvoteId: {
          userId,
          postId,
        },
      },
    });
    if (!isDownvoted) {
      return res.send({ success: false, error: "Downvote doesn't exist" });
    }
    // finally we delete the downvote, using the id just returned to us
    const downvote = await prisma.downvote.delete({
      where: {
        id: isDownvoted.id,
      },
    });
    res.send({ success: true, downvote });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});
