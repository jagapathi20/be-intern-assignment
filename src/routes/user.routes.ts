import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';
import { feedValidation } from '../validations/feed.validation';
import { UserController } from '../controllers/user.controller';
import { ActivityController } from '../controllers/feed.controller';

export const userRouter = Router();
const userController = new UserController();
const activityController = new ActivityController()

// Get all users
userRouter.get('/', userController.getAllUsers.bind(userController));

// Get user by id
userRouter.get('/:id', userController.getUserById.bind(userController));

// Create new user
userRouter.post('/', validate(createUserSchema), userController.createUser.bind(userController));

// Update user
userRouter.put('/:id', validate(updateUserSchema), userController.updateUser.bind(userController));

// Delete user
userRouter.delete('/:id', userController.deleteUser.bind(userController));

userRouter.get(
    "/activity/:id/", 
    validate(feedValidation.getUserActivity.params),
    activityController.getUserActivity.bind(activityController))

userRouter.get(
    "/feed/:id/", 
    validate(feedValidation.getUserFeed.params),
    activityController.getUserFeed.bind(activityController))