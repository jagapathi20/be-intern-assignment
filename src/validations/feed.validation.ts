import Joi from 'joi';

export const feedValidation = {
  // GET /api/feed/:id?page=1&limit=10
  getUserFeed: {
    params: Joi.object({
      id: Joi.number().integer().required()
    }),
    query: Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional()
    })
  },

  // GET /api/activity/:id?postPage=1&likePage=1
  getUserActivity: {
    params: Joi.object({
      id: Joi.number().integer().required()
    }),
    query: Joi.object({
      postPage: Joi.number().integer().min(1).optional(),
      postLimit: Joi.number().integer().min(1).optional(),
      likePage: Joi.number().integer().min(1).optional(),
      likeLimit: Joi.number().integer().min(1).optional()
    })
  }
};