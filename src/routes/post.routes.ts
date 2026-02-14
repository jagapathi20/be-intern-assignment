import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { validate } from '../middleware/validation.middleware'; 
import { createPostSchema, updatePostSchema } from '../validations/post.validation';

export const postRouter = Router();
const postController = new PostController();

// GET /posts/:id -> Get a single post by its database ID
postRouter.get('/:id', postController.getPostById.bind(postController));

// POST /posts/:id -> Create a post for user :id
postRouter.post(
    '/:id', 
    validate(createPostSchema), 
    postController.createPost.bind(postController)
);

// PUT /posts/:id/:postId -> Update :postId if it belongs to user :id
postRouter.put(
    '/:id/:postId', 
    validate(updatePostSchema), 
    postController.updatePost.bind(postController)
);

// DELETE /posts/:id/:postId -> Delete :postId if it belongs to user :id
postRouter.delete('/:id/:postId', postController.deletePost.bind(postController));

// GET /posts/hashtag/:hashtag -> Get all posts with a specific hashtag
postRouter.get('/hashtag/:hashtag', postController.hashtagPosts.bind(postController));