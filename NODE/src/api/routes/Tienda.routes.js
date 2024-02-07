const { upload } = require("../../middleware/files.middleware");
const { toggleAlimentos } = require("../controllers/Tienda.controllers");
const { createTienda } = require("../controllers/Tienda.controllers");
const TiendaRoutes = require("express").Router();
TiendaRoutes.post("/", upload.single("image"), createTienda);
TiendaRoutes.patch("/add/:id", toggleAlimentos);
module.exports = TiendaRoutes;
