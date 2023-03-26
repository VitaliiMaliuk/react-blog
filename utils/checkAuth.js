import jwt from "jsonwebtoken";

// экспортирует middleware-функцию, которая будет использоваться для проверки аутентификации пользователя.
export default (req, res, next) => {
  // извлекает токен из заголовков запроса, заменяя префикс "Bearer" на пустую строку
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      // она пытается декодировать токен, используя секретный ключ "secret123" и библиотеку jsonwebtoken
      const decoded = jwt.verify(token, "secret123");
      // Если декодирование прошло успешно, то она добавляет идентификатор пользователя (извлеченный из токена) к объекту запроса и вызывает следующую функцию (next), чтобы продолжить обработку запроса.
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
  } else {
    // Если токен отсутствует в запросе
    return res.status(403).json({
      message: "Access denied",
    });
  }
};
