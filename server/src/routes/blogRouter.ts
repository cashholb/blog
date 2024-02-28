import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();

import { getAllPosts, getPost, createPost, deletePost, updatePost } from '../controllers/postController';
import { createComment, getAllCommentsOfPost, getComment, updateComment, deleteComment } from '../controllers/commentController'
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from '../controllers/userController'

// Posts
router.post('/posts/:userId', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:postId', getPost);
router.put('/posts/:postId', updatePost);
router.delete('/posts/:postId', deletePost);

// Comments
router.post('/posts/:postId/comments/:userId', createComment);
router.get('/posts/:postId/comments', getAllCommentsOfPost);
router.get('/posts/:postId/comments/:commentId', getComment);
router.get('comments/:commentId', getComment);
router.put('/posts/:postId/comments/:commentId', updateComment);
router.put('comments/:commentId', updateComment);
router.delete('/posts/:postId/comments/:commentId', deleteComment);

// Users
router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:userId', getUser);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

export default router