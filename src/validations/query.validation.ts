import Joi from 'joi';

// Validates pagination query parameters for Feed, Followers, and Hashtag searches
export const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100',
  }),
  offset: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Offset must be a number',
    'number.min': 'Offset cannot be negative',
  }),
});

// Validates the :tag parameter in /api/posts/hashtag/:tag
export const hashtagParamSchema = Joi.object({
  tag: Joi.string().required().min(1).max(50).alphanum().messages({
    'string.empty': 'Hashtag name is required',
    'string.alphanum': 'Hashtag must only contain alphanumeric characters',
    'string.max': 'Hashtag name cannot exceed 50 characters',
  }),
});

// Validates the ID parameter in URL paths (e.g., /api/users/:id/followers)
export const idParamSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': 'ID must be a valid number',
    'any.required': 'ID is required',
  }),
});