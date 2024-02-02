//! 23 traer el modelo de controller:

const {
  registerLargo,
  register,
  registerWithRedirect,
  sendCode,
} = require("../controllers/User.controller");

//! 24 importar express

const express = require("express");

//! 25 importar la subida del mw (el upload que hace el multer)

const { upload } = require("../../middleware/files.middleware");

//! 26 configurar la ruta del endpoint:

const UserRoutes = express.Router();

UserRoutes.post("/registerLargo", upload.single("image"), registerLargo); //!ENDOPOINT

//! -----------LOS OTROS TIPOS DE REGISTER: ESTADO GLOBAL Y REDIRECT:

UserRoutes.post("/registerUtil", upload.single("image"), register);
UserRoutes.get("/register", upload.single("image"), registerWithRedirect);

/// ------------------> rutas que pueden ser redirect
UserRoutes.get("/register/sendMail/:id", sendCode); // :id ---> es el nombre del param
module.exports = UserRoutes;

//! 27 exportar, y consume el index, asi que 28 en index

module.exports = UserRoutes;