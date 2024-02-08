const { upload } = require("../../middleware/files.middleware");
const {
  toggleAlimentos,
  getById,
  getAll,
  getByName,
  update,
  deleteTienda,
} = require("../controllers/Tienda.controllers");
const { createTienda } = require("../controllers/Tienda.controllers");
const TiendaRoutes = require("express").Router();
TiendaRoutes.post("/", upload.single("image"), createTienda);
TiendaRoutes.patch("/add/:id", toggleAlimentos);
TiendaRoutes.get("/:id", getById);
TiendaRoutes.get("/", getAll);
TiendaRoutes.get("/byName/:name", getByName);
TiendaRoutes.patch("/:id", upload.single("image"), update);
TiendaRoutes.delete("/:id", deleteTienda);

module.exports = TiendaRoutes;
