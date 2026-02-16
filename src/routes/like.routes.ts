import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { likeValidation } from "../validations/like.validation";
import { LikeController } from "../controllers/like.controller";

export const likeRouter = Router()
const likeController = new LikeController()
likeRouter.get(
    "/:likeId",
    validate(likeValidation.getLike.params) ,
    likeController.getLikebyId.bind(likeController))

likeRouter.post(
    "/:id/:postId", 
    validate(likeValidation.createLike.params),
    likeController.createLike.bind(likeController))

likeRouter.delete(
    "/:id/:likeId", 
    validate(likeValidation.deleteLike.params),
    likeController.deleteLike.bind(likeController))

likeRouter.post(
    "/toggle/:id/:postId", 
    validate(likeValidation.toggleLike.params),
    likeController.togglePostLike.bind(likeController))

likeRouter.get(
    "/post/:postId", 
    validate(likeValidation.postLikes.params),
    likeController.getPostLikes.bind(likeController))