import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Comment from '../models/comment';
import Post  from '../models/post';
import mongoose, { Types } from 'mongoose';

// -- Create --
export const createComment = [
  // Validate and sanitize fields
  body("content")
    .optional({ nullable: true }) 
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must be specified")
    .escape(),
  
  asyncHandler( async (req: Request, res: Response ) => {
    // check if post exists
    const post = await Post.findById(req.params.postId);

    const newComment: any = new Comment({
      user: req.params.userId,
      content: req.body.content,
    });
    await newComment.save();

    // add comment to specific post's comments
    post.comments.push(newComment);
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, post, {});

    res.status(201);
    res.json([newComment, updatedPost]);
  })
];

// -- Read --
export const getAllCommentsOfPost = asyncHandler( async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId).populate('comments').exec();
  if (!post) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }
  res.json(post.comments);
});

export const getComment = asyncHandler( async (req: Request, res: Response) => {
  const comment = await Comment.findById(req.params.commentId);
  res.json(comment);
});

// -- Update --
export const updateComment = [
  // Validate and sanitize fields
  body("user")
    .optional({ nullable: true }) 
    .isMongoId(),
  body("content")
    .optional({ nullable: true }) 
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content must be specified")
    .escape(),
  body("timeStamp")
    .optional({ nullable: true }) 
    .toDate(),
  body("likeCount")
    .optional({ nullable: true }) 
    .isInt({min: 0})
    .withMessage("Like count must be zero or greater"),
  body("likes.*")
    .optional({ nullable: true }) 
    .isMongoId()
    .withMessage("Likes must contain only user id's"),

  asyncHandler( async (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Extract data from request body
    const { user, content, timeStamp, likeCount, likes } = req.body;

    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);

    // Check if the comment exists
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Update comment properties
    if(user) comment.user = user;
    if(content) comment.content = content;
    if(timeStamp) comment.timeStamp = timeStamp;
    if(likeCount) comment.likeCount = likeCount;
    if(likes) comment.likes = likes;

    // Save the updated post
    await comment.save();

    // Respond with the updated post
    res.json(comment);
  }),
];

// -- Delete --
export const deleteComment = asyncHandler( async (req: Request, res: Response ) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  
  const [ post, commentToDelete ] = await Promise.all([ 
    Post.findById(postId).exec(),
    Comment.findByIdAndDelete(commentId).exec(),
  ]); 
  
  // convert commentId to mongoose ObjectId
  const commentObjectId = new Types.ObjectId(commentId);

  // remove comment from post
  post.comments = post.comments.filter(comment => !comment.equals(commentObjectId));
  await post.save();

  res.json(commentToDelete);
});