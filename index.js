import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

// Подключает приложение к базе данных MongoDB, используя Mongoose
mongoose
  .connect(
    "mongodb+srv://maliukvitalii:7557558181@cluster0.v1eecw8.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok");
  })
  .catch((err) => console.log("DB error", err));
// Создает новый экземпляр приложения Express
const app = express();
// Это middleware функция, которая разбирает входящие запросы с JSON-телом и добавляет объект body в объект request. Это делает возможным работу с данными, отправленными клиентом через JSON.
app.use(express.json());

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

// код запускает сервер на порту 4444 и выводит сообщение "Server OK" в консоль, если сервер был успешно запущен
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
