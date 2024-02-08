const { upload } = require("../../middleware/files.middleware");
const {
  toggleAlimentos,
  getById,
  getAll,
} = require("../controllers/Tienda.controllers");
const { createTienda } = require("../controllers/Tienda.controllers");
const TiendaRoutes = require("express").Router();
TiendaRoutes.post("/", upload.single("image"), createTienda);
TiendaRoutes.patch("/add/:id", toggleAlimentos);
TiendaRoutes.get("/:id", getById);
TiendaRoutes.get("/", getAll);
module.exports = TiendaRoutes;
