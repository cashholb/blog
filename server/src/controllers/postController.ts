import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Comment from '../models/comment';
import Post  from '../models/post';

// -- Create --
export const createPost = asyncHandler( async (req: Request, res: Response ) => {
  
  const newPost = new Post({
    author: req.params.userId,
    title: req.body.title,
    content: req.body.content,
  });
  await newPost.save();
  res.json(newPost);
});

// -- Read --
export const getAllPosts = asyncHandler( async (req: Request, res: Response) => {
    const posts = await Post.find();
    res.json(posts);
});

export const getPost = asyncHandler( async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId).populate('comments').exec();
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
  }

  // the line below fixes the bug 'MissingSchemaError: Schema hasn't been registered for model "Comment"'
  post.comments instanceof Comment ? post.comments : '';

  res.json(post);
});

// -- Update --
export const updatePost = [
  // Validate and sanitize fields
  body("title")
    .optional({ nullable: true }) 
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 1 and 50 characters")
    .escape(),
  body("content")
    .optional({ nullable: true }) 
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must be specified")
    .escape(),
  body("author")
    .optional({ nullable: true }) 
    .trim()
    .isLength({ min: 1 })
    .withMessage("Author must be specified")
    .escape(),
  body("timeStamp")
    .optional({ nullable: true }) 
    .toDate(),
  body("published")
    .optional({ nullable: true }) 
    .isBoolean(),
  body("likeCount")
    .optional({ nullable: true }) 
    .isInt({min: 0})
    .withMessage("Like count must be zero or greater"),
  body("likes.*")
    .optional({ nullable: true }) 
    .isMongoId(),
  body("comments.*")
    .optional({ nullable: true }) 
    .isMongoId(),

  asyncHandler( async (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body
    const { title, content, author, timeStamp, published, likeCount, likes, comments } = req.body;
    // Find the post by ID
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }

    // Update post properties
    if(title) post.title = title;
    if(content) post.content = content;
    if(author) post.author = author;
    if(timeStamp) post.timeStamp = timeStamp;
    if(published) post.published = published;
    if(likeCount) post.likeCount = likeCount;
    if(likes) post.likes = likes;
    if(comments) post.comments = comments;

    // Save the updated post
    await post.save();

    // Respond with the updated post
    res.json(post);
  }),
];

// -- Delete --
export const deletePost = asyncHandler( async (req: Request, res: Response ) => {
  const postToDelete = await Post.findByIdAndDelete(req.params.postId);
  res.json(postToDelete);
});