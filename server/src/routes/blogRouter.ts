import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();

import blogController from '../controllers/blogController';

router.get('/', blogController.blogList);

router.get('/:postId', blogController.article);

export default router