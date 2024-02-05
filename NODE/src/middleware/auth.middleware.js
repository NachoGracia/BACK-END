//! crear el mw de autenticación.

const User = require("../api/models/User.model");

//! crear un util para el token y traerlo:

const dotenv = require("dotenv");
const { verifyToken } = require("../utils/token");
dotenv.config();

const isAuth = async (req, res, next) => {
  // como es un token de tipo bearer le quitamos el prefijo para poder utlizarlo
  const token = req.headers.authorization?.replace("Bearer ", "");
  // si no hay token  le lanzamos un error
  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    // vamos a decodificar el token para sacar el id
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    // Solo crea el req.user cuando endpoint autenticado. tiene como mw el auth
    req.user = await User.findById(decoded.id);

    // si todo esta bien continuamos
    next();
  } catch (error) {
    return next(error);
  }
};

const isAuthAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);

    //! -----> La unica diferencia es que comprobamos si es administrador
    if (req.user?.rol !== "admin") {
      return next(new Error("Unauthorized, not admin"));
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isAuth,
  isAuthAdmin,
};
