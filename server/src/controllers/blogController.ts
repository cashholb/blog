import express, { Request, Response } from 'express';
import Post from '../models/post';

import asyncHandler from 'express-async-handler';

const blogList = asyncHandler(async (req: Request, res: Response, ) => {
  res.send('This is the blog list') 
});

const article = asyncHandler(async (req: Request, res: Response, ) => {
  res.send(`Blog post ${req.params.postId}`);
});

export default {blogList, article}