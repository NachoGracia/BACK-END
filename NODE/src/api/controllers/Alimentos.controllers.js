const Alimento = require("../models/Alimientos.model");
const Tienda = require("../models/Tienda.model");

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
    const { id } = req.params;
    const { tiendas } = req.body;

    const alimentoById = await Alimento.findById(id);

    if (alimentoById) {
      const arrayIdtiendas = tiendas.split(",");

      await Promise.all(
        arrayIdtiendas.map(async (tienda) => {
          if (alimentoById.tiendas.includes(tienda)) {
            try {
              await Alimento.findByIdAndUpdate(id, {
                $pull: { tiendas: tienda },
              });

              try {
                await Tienda.findByIdAndUpdate(tienda, {
                  $pull: { alimentos: id },
                });
              } catch (error) {
                res.status(404).json({
                  error: "error update tienda",
                  message: error.message,
                }) && next(error);
              }
            } catch (error) {
              res.status(404).json({
                error: "error update alimento",
                message: error.message,
              }) && next(error);
            }
          } else {
            try {
              await Alimento.findByIdAndUpdate(id, {
                $push: { tiendas: tienda },
              });
              try {
                await Tienda.findByIdAndUpdate(tienda, {
                  $push: { alimentos: id },
                });
              } catch (error) {
                res.status(404).json({
                  error: "error update tienda",
                  message: error.message,
                }) && next(error);
              }
            } catch (error) {
              res.status(404).json({
                error: "error update alimento",
                message: error.message,
              }) && next(error);
            }
          }
        })
      )
        .catch((error) => res.status(404).json({ error: error.message }))
        .then(async () => {
          return res.status(200).json({
            dataUpdate: await Alimento.findById(id).populate("tiendas"),
          });
        });
    } else {
      return res.status(404).json("este alimento no existe");
    }
  } catch (error) {
    return (
      res.status(404).json({
        error: "error catch",
        message: error.message,
      }) && next(error)
    );
  }
};

//! get by id:

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alimentoById = await Alimento.findById(id);

    if (alimentoById) {
      return res.status(200).json(alimentoById);
    } else {
      return res.status(404).json("No se ha encontrado el alimento");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------get All:

const getAll = async (req, res, next) => {
  try {
    const allAlimentos = await Alimento.find().populate("tiendas");
    if (allAlimentos.length > 0) {
      return res.status(200).json(allAlimentos);
    } else {
      return res.status(404).json("no se han encontrado alimentos");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar alimentos",
      message: error.message,
    });
  }
};

//! get by name:

const getByName = async (req, res, next) => {
  try {
    const { name } = req.params;

    const alimentoByName = await Alimento.find({ name });
    if (alimentoByName.length > 0) {
      return res.status(200).json(alimentoByName);
    } else {
      return res
        .status(404)
        .json("No se ha encontrado ningun alimento con ese nombre");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error en la busqueda por nombre de alimento",
      message: error.message,
    });
  }
};

module.exports = { createAlimento, toggleTiendas, getById, getAll, getByName };
