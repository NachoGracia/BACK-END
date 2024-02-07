const Alimento = require("../models/Alimientos.model");

const createAlimento = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    await Alimento.syncIndexes();

    const customBody = {
      name: req.body?.name,
      type: req.body?.type,
    };

    const newAlimento = new Alimento(customBody);
    //! una vez creado el nuevo alimento, verificar la foto
    if (req.file) {
      newAlimento.image = catchImg;
    } else {
      newAlimento.image =
        "https://idro.es/wp-content/uploads/2022/07/piramide-alimentos.jpg";
    }
    const savedAlimento = await newAlimento.save();

    return res
      .status(savedAlimento ? 200 : 404)
      .json(savedAlimento ? savedAlimento : "error al crear el alimento");
  } catch (error) {
    req.file?.path && deleteImgCloudinary(catchImg);
    return res.status(404).json({
      error: "error catch create alimento",
      message: error.message,
    });
  }
};

//! crear el toogle, para meter en los alimentos las tiendas:

const toggleTiendas = async (req, res, next) => {
  try {
    const { id } = req.params; // es el id de los alimentos,
    const { tiendas } = req.body; // del body de tiendas, sacaremos los id para meterlos en alimentos
    // buscar si el alimento que quiero meter existe
    const alimentoById = await Alimento.findById(id);
  } catch (error) {}
};

module.exports = { createAlimento };
