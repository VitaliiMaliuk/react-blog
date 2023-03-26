import { body } from "express-validator";

// код экспортирует массив из функций валидации запроса
export const loginValidation = [
  body("email", "invalid email format").isEmail(),
  body("password", "the password must be at least 5 characters long").isLength({min: 5}),
];

export const registerValidation = [
  body("email", "invalid email format").isEmail(),
  body("password", "the password must be at least 5 characters long").isLength({min: 5}),
  body("fullName", "enter your name").isLength({min: 3}),
  body("avatarUrl", "invalid avatar link").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Enter article title").isLength({min: 3}).isString(),
  body("text", "Enter article text").isLength({min: 3}).isString(),
  body("tags", "Invalid format of tags").optional().isString(),
  body("imageUrl", "invalid image link").optional().isString(),
];