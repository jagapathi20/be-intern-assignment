import Joi from 'joi';

export const likeValidation = {
  // GET /:likeId
  getLike: {
    params: Joi.object({
      likeId: Joi.number().integer().required()
    })
  },

  // POST /:id/:postId
  createLike: {
    params: Joi.object({
      id: Joi.number().integer().required(),
      postId: Joi.number().integer().required()
    })
  },

  // DELETE /:id/:likeId
  deleteLike: {
    params: Joi.object({
      id: Joi.number().integer().required(),
      likeId: Joi.number().integer().required()
    })
  },

  // POST /:id/:postId/toggle
  toggleLike: {
    params: Joi.object({
      id: Joi.number().integer().required(),
      postId: Joi.number().integer().required()
    })
  },

  // GET /post/:postId
  postLikes: {
    params: Joi.object({
      postId: Joi.number().integer().required()
    })
  }
};