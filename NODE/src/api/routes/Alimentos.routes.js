const { createAlimento } = require("../controllers/Alimentos.controllers");

const AlimentoRoutes = require("express").Router();
AlimentoRoutes.post("/", createAlimento);
module.exports = AlimentoRoutes;
