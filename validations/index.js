import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 5 }),
  body('username').isString(),
  body('avatarUrl').isString().optional(),
];

export const loginValidation = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 5 }),
];

