import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();

import { getAllPosts, getPost, createPost, deletePost, updatePost } from '../controllers/postController';

// Posts
router.post('/post/:userId/create', createPost);
router.get('/posts', getAllPosts);
router.get('/post/:postId', getPost);
router.post('/post/:postId/update', updatePost);
router.delete('/post/:userId', deletePost);

// Comments

// Users

export default router