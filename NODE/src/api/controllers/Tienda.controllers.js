const Tienda = require("../models/Tienda.model");

const createTienda = async (req, res, next) => {
  try {
    await Tienda.syncIndexes();

    const customBody = {
      name: req.body?.name,
      type: req.body?.type,
      location: req.body?.location,
    };

    const newTienda = new Tienda(customBody);
    const savedTienda = await newTienda.save();

    return res
      .status(savedTienda ? 200 : 404)
      .json(savedTienda ? savedTienda : "error al crear la tienda");
  } catch (error) {
    return res.status(404).json({
      error: "error catch create tienda",
      message: error.message,
    });
  }
};

module.exports = { createTienda };
