import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();

import { getAllPosts, getPostWithComments } from '../controllers/blogController';

router.get('/', getAllPosts);
router.get('/:postId', getPostWithComments);

export default router