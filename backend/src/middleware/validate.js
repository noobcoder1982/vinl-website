import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    // Format express-validator errors so our global handler can read them easily
    err.errors = errors.array().reduce((acc, curr) => {
      acc[curr.path] = { message: curr.msg };
      return acc;
    }, {});
    return next(err);
  }
  next();
};
