const { upload } = require("../../middleware/files.middleware");
const { createAlimento } = require("../controllers/Alimentos.controllers");

const AlimentoRoutes = require("express").Router();
AlimentoRoutes.post("/", upload.single("image"), createAlimento);

module.exports = AlimentoRoutes;
