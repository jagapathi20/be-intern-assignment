import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { likePostSchema} from "../validations/social.validation";
import { LikeController } from "../controllers/like.controller";

export const likeRouter = Router()
const likeController = new LikeController()

likeRouter.post("/:id/:postId", validate(likePostSchema), likeController.togglePostLike.bind(likeController))

likeRouter.get("/:postId", likeController.getPostLikes.bind(likeController))