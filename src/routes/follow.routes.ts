import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { FollowController } from "../controllers/follow.controller";
import { followValidation } from "../validations/follow.validation";

export const followRouter = Router();
const followController = new FollowController();

// CRUD: Get specific follow record
followRouter.get("/:id", validate(followValidation.getFollow.params), followController.getFollowById.bind(followController));

// CRUD: Create Follow
followRouter.post("/:id/:followingId", validate(followValidation.createFollow.params), followController.createFollow.bind(followController));

// CRUD: Delete Follow
followRouter.delete("/:id/:followId", validate(followValidation.deleteFollow.params), followController.deleteFollowById.bind(followController));

// Special: Toggle Follow
followRouter.post("/:id/:toFollowId/toggle", validate(followValidation.toggleFollow.params), followController.toggleFollowUser.bind(followController));

// Get Followers of a User
followRouter.get("/user/:id/followers", validate(followValidation.getFollow.params), followController.getFollowers.bind(followController));