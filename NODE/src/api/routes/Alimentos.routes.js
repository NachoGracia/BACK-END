const { upload } = require("../../middleware/files.middleware");
const {
  createAlimento,
  toggleTiendas,
  getById,
  getAll,
} = require("../controllers/Alimentos.controllers");

const AlimentoRoutes = require("express").Router();
AlimentoRoutes.post("/", upload.single("image"), createAlimento);
AlimentoRoutes.patch("/add/:id", toggleTiendas);
AlimentoRoutes.get("/:id", getById);
AlimentoRoutes.get("/", getAll);
module.exports = AlimentoRoutes;
