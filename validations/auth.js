import { body } from "express-validator";

export const registerValidation = [
  body("email", "invalid email format").isEmail(),
  body("password", "the password must be at least 5 characters long").isLength({min: 5}),
  body("fullName", "enter your name").isLength({min: 3}),
  body("avatarUrl", "invalid avatar link").optional().isURL(),
];