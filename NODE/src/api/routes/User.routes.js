//! 23 traer el modelo de controller:

const {
  registerLargo,
  registerWithRedirect,
  sendCode,
  register,
  login,
  autoLogin,
  resendCode,
  checkNewUser,
  changePassword,
  sendPassword,
  modifyPassword,
  update,
  deleteUser,
} = require("../controllers/User.controller");

//! 24 importar express

const express = require("express");

//! 25 importar la subida del mw (el upload que hace el multer)

const { upload } = require("../../middleware/files.middleware");
const { isAuth, isAuthAdmin } = require("../../middleware/auth.middleware");
const User = require("../models/User.model");

//! 26 configurar la ruta del endpoint:

const UserRoutes = express.Router();

UserRoutes.post("/registerLargo", upload.single("image"), registerLargo); //!ENDOPOINT

//! -----------LOS OTROS CONTROLADORES CON SUS ENDPOINTS, sin AUTH:

UserRoutes.post("/registerUtil", upload.single("image"), register);
UserRoutes.get("/register", upload.single("image"), registerWithRedirect);
UserRoutes.post("/login", login);
UserRoutes.post("/login/autoLogin", autoLogin);
UserRoutes.post("/resend", resendCode);
UserRoutes.post("/check", checkNewUser);
UserRoutes.patch("/forgotpassword", changePassword);
UserRoutes.delete("/", [isAuth], deleteUser);

//!-----------------con AUTH:
UserRoutes.patch("/changepassword", [isAuth], modifyPassword);
UserRoutes.patch("/update/update", [isAuth], upload.single("image"), update);

//! ------------------ rutas que pueden ser redirect
UserRoutes.get("/register/sendMail/:id", sendCode); // :id ---> es el nombre del param
module.exports = UserRoutes;
UserRoutes.patch("/sendPassword/:id", sendPassword);

//! 27 exportar, y consume el index, asi que 28 en index

module.exports = UserRoutes;
