//! 23 traer el modelo de controller:

const { registerLargo } = require("../controllers/User.controller");

//! 24 importar express

const express = require("express");

//! 25 importar la subida del mw (el upload que hace el multer)

const { upload } = require("../../middleware/files.middleware");

//! 26 configurar la ruta del endpoint:

const UserRoutes = express.Router();

UserRoutes.post("/registerLargo", upload.single("image"), registerLargo); //!ENDOPOINT

//! 27 exportar, y consume el index, asi que 28 en index

module.exports = UserRoutes;
