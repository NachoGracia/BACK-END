const { createTienda } = require("../controllers/Tienda.controllers");
const TiendaRoutes = require("express").Router();
TiendaRoutes.post("/", createTienda);
module.exports = TiendaRoutes;
