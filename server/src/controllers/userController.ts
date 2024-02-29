import { NextFunction, Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Comment from '../models/comment';
import Post  from '../models/post';
import User from '../models/user'
import { Types } from 'mongoose';
import comment from '../models/comment';

// -- Create --
export const createUser = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username cannot contain trailing/leading whitespace and must be withing 3 to 20 characters")
    .escape(),
  body('email')
    .isEmail(),
  body("password")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Password cannot contain trailing/leading whitespace and must be withing 3 to 100 characters")
    .escape(),

  asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password } = req.body;
    
    // Check if user with username already exists
    const user = await User.find({username: username});
    if(user.length > 0) {
      res.status(403).json({ message: `Forbidden: username \'${username}\' already exists`})
      return;
    }
    
    const newUser = new User({
      username: username,
      email: email,
      password: password
    });

    await newUser.save();

    res.json(newUser);
  }),
];

// -- Read --
export const getAllUsers = asyncHandler( async (req: Request, res: Response) => {
  const users = await User.find();
  if(!users) {
    res.status(404).json({ message: 'No users found' });
    return;
  }
  res.json(users);
});

export const getUser = asyncHandler( async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if(!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
});

// -- Update --
export const updateUser = [
  body("username")
    .optional({nullable: true})
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username cannot contain trailing/leading whitespace and must be withing 3 to 20 characters")
    .escape(),
  body('email')
    .optional({nullable: true})
    .isEmail(),
  body("password")
    .optional({nullable: true})
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Password cannot contain trailing/leading whitespace and must be withing 3 to 100 characters")
    .escape(),

  asyncHandler( async (req: Request, res: Response) => {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userToUpdate = await User.findById(req.params.userId);
    if(!userToUpdate) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // update fields if specified
    const { username, email, password } = req.body;
    if(username) userToUpdate.username = username;
    if(email) userToUpdate.email = email;
    if(password) userToUpdate.password = password;

    await userToUpdate.save();

    res.json(userToUpdate);
  }),
];

// -- Delete --
export const deleteUser = asyncHandler( async (req: Request, res: Response) => {
  
  // check if user has any posts and/or comments and deny the deletion if so
  const [ postsByUser, commentsByUser ] = await Promise.all([
    Post.find({author: req.params.userId}),
    Comment.find({user: req.params.userId})
  ]);
  if ((commentsByUser.length > 0) || (postsByUser.length > 0)) {
    console.log(typeof commentsByUser);
    console.log(postsByUser);
    res.status(403).json({ message: `Forbidden: must first delete all ${commentsByUser && postsByUser ? 'comments and posts' : (commentsByUser ? 'comments' : 'posts')} by user` })
    return;
  }

  const deletedUser = await User.findByIdAndDelete(req.params.userId)
  if(!deletedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(deletedUser);
});
