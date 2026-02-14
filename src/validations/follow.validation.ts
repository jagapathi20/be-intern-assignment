import Joi from 'joi';

export const followSchema = Joi.object({
    id: Joi.number().integer().positive().required(),         
    toFollowId: Joi.number().integer().positive().required()  
});


export const getFollowersSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});