import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Extended to support body, params, or query validation
export const validate = (schema: Joi.Schema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ message: errorMessage });
    }

    // Reassign the validated (and stripped) values back to the request
    req[source] = value;
    next();
  };
};