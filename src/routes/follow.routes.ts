import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';
import { validate } from '../middleware/validation.middleware';
import { followSchema, getFollowersSchema } from '../validations/follow.validation';

export const followRouter = Router();
const followController = new FollowController();


followRouter.post(
    '/:id/:toFollowId', 
    validate(followSchema, 'params'), 
    followController.toggleFollowUser.bind(followController)
);


followRouter.get(
    '/:id/followers', 
    validate(getFollowersSchema, 'params'), 
    followController.getFollowers.bind(followController)
);