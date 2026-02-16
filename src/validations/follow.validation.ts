import Joi from 'joi';

export const followValidation = {
  getFollow: {
    params: Joi.object({
      id: Joi.number().integer().required()
    })
  },
  createFollow: {
    params: Joi.object({
      id: Joi.number().integer().required(),
      followingId: Joi.number().integer().required()
    })
  },
  deleteFollow: {
    params: Joi.object({
      id: Joi.number().integer().required(),
      followId: Joi.number().integer().required()
    })
  },
  toggleFollow: {
    params: Joi.object({
      id: Joi.number().integer().required(),
      toFollowId: Joi.number().integer().required()
    })
  }
};