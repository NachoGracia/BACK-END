const { upload } = require("../../middleware/files.middleware");
const {
  createAlimento,
  toggleTiendas,
  getById,
  getAll,
  getByName,
} = require("../controllers/Alimentos.controllers");

const AlimentoRoutes = require("express").Router();
AlimentoRoutes.post("/", upload.single("image"), createAlimento);
AlimentoRoutes.patch("/add/:id", toggleTiendas);
AlimentoRoutes.get("/:id", getById);
AlimentoRoutes.get("/", getAll);
AlimentoRoutes.get("/byName/:name", getByName);
module.exports = AlimentoRoutes;
