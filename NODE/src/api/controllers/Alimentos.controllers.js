const Alimento = require("../models/Alimientos.model");

const createAlimento = async (req, res, next) => {
  try {
    await Alimento.syncIndexes();

    const customBody = {
      name: req.body?.name,
      type: req.body?.type,
    };

    const newAlimento = new Alimento(customBody);
    const savedAlimento = await newAlimento.save();

    return res
      .status(savedAlimento ? 200 : 404)
      .json(savedAlimento ? savedAlimento : "error al crear el alimento");
  } catch (error) {
    return res.status(404).json({
      error: "error catch create alimento",
      message: error.message,
    });
  }
};

module.exports = { createAlimento };
