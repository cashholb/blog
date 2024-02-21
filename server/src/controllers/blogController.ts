import express, { Request, Response } from 'express';
import asyncHandler from "express-async-handler"
import Comment from '../models/comment';
import Post  from '../models/post';

export const getAllPosts = asyncHandler( async (req: Request, res: Response) => {
    const posts = await Post.find();
    res.json(posts);
});

export const getPostWithComments = asyncHandler( async (req: Request, res: Response) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate('comments').exec();
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
  }

  // the line below fixes the bug 'MissingSchemaError: Schema hasn't been registered for model "Comment"'
  post.comments instanceof Comment ? post.comments : '';

  res.json(post);
});
