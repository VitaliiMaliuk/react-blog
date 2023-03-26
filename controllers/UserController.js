import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    // Первым делом middleware registerValidation проверяет валидность данных запроса и формирует массив ошибок
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    // Пароль пользователя хэшируется с помощью библиотеки bcrypt
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Создается экземпляр модели User, заполненный данными из запроса, включая хеш пароля
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    // Документ сохраняется в базе данных MongoDB с помощью метода save().
    const user = await doc.save();
    // После успешного сохранения пользовательские данные, за исключением хеша пароля, извлекаются из документа и добавляются в объект ответа, вместе с JWT-токеном.
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    // Поиск пользователя по почте
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Если пользователь найдет, проверяется правильность пароля
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }
    // Если пароль правильный, код создает JSON Web Token (JWT)
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    // Из объекта пользователя удаляется его хэш пароля, чтобы его не отправлять вместе с остальными данными
    const { passwordHash, ...userData } = user._doc;
    // Код отправляет ответ с данными пользователя и JWT в формате JSON
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to authorize",
    });
  }
}

export const getMe = async (req, res) => {
  try {
    // Если проверка успешна и пользователь авторизован, то происходит поиск пользователя по id в базе данных с помощью метода findById() модели UserModel
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // из полученного объекта удаляется хэш пароля с помощью деструктуризации объекта.
    const { passwordHash, ...userData } = user._doc;
    // на клиент отправляется JSON-объект с данными пользователя, кроме его хэша пароля
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Authorization failed",
    });
  }
}