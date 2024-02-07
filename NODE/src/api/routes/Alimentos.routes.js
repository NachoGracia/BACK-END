const { upload } = require("../../middleware/files.middleware");
const {
  createAlimento,
  toggleTiendas,
} = require("../controllers/Alimentos.controllers");

const AlimentoRoutes = require("express").Router();
AlimentoRoutes.post("/", upload.single("image"), createAlimento);
AlimentoRoutes.patch("/add/:id", toggleTiendas);
module.exports = AlimentoRoutes;
