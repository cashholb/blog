import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Comment from '../models/comment';
import Post  from '../models/post';

// -- Create --
export const createPost = [
  // Validate and sanitize fields
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 1 and 50 characters")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must be specified")
    .escape(),

  asyncHandler( async (req: Request, res: Response ) => {
    const newPost = new Post({
      author: req.params.userId,
      title: req.body.title,
      content: req.body.content,
    });
    await newPost.save();
    res.status(201);
    res.json(newPost);
  })
];

// -- Read --
export const getAllPosts = asyncHandler( async (req: Request, res: Response) => {
    const posts = await Post.find();
    res.json(posts);
});

export const getPost = asyncHandler( async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId).populate('comments').exec();
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

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
      return;
    }

    // Extract data from request body
    const { title, content, author, timeStamp, published, likeCount, likes, comments } = req.body;
    // Find the post by ID
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
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
  const postToDelete = await Post.findById(req.params.postId);
  if(!postToDelete) {
    res.status(404).json({ message: 'post not found' });
    return;
  }

  let deletedComments = [];
  postToDelete.comments.forEach(async comment => {
    const deletedComment = await Comment.findByIdAndDelete(comment);
    if(!deletedComment) {
      res.status(500).json({ message: 'Comment not found' });
      return;
    }
    deletedComments.push(deletedComment);
  });

  const deletedPost = Post.findByIdAndDelete(req.params.postId);
  if(!deletedPost) {
    res.status(404).json({ message: 'post not found' });
    return;
  }

  res.json([postToDelete, deletedComments]);
});