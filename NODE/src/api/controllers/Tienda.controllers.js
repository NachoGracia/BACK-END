const Alimento = require("../models/Alimientos.model");
const Tienda = require("../models/Tienda.model");
const User = require("../models/User.model");

const createTienda = async (req, res, next) => {
  /// vamos a capturar la url dde la imagen que se sube a cloudinary
  /* lo hacemos porque si hay en error como la imagen see sube antes de meternos al controlador
    si hay un error en el controlador, una vez dentro, el elemento no se crea y por ende
    tenmos que borrar la imagen en cloudinary */

  /** El optional chaining se pone porque la imagen no es obligatoria por lo cual
   * puede ser que no tengamos req.file.path
   */
  let catchImg = req.file?.path;
  try {
    //! -----> ACTUALIZAR INDEXES
    /** los indexes se forman cuando una clave del objeto es unique, se puede ver en la
     * parte de mongo que esta al lado de find
     *
     * Esto es importante porque puede que haya modificado el modelo posteriormente a la
     * creacion del controlador
     */

    await Tienda.syncIndexes();
    //! ------> INSTANCIAR NUEVA TIENDA

    /** vamos a instanciar un nuevo character y le metemos como info incial lo que recibimos
     * por la req.body
     */
    const newTienda = new Tienda(req.body);

    //! -------> VALORAR SI HEMOS RECIBIDO UNA IMAGEN O NO
    /** Si recibimos la imagen tenemos que meter la url en el objeto creado arriba con la
     * nueva instancia del Character
     */

    if (req.file) {
      newTienda.image = catchImg;
    } else {
      newTienda.image =
        "https://www.horus-proyectos.com/wp-content/uploads/2021/05/Supermercado.jpg";
    }

    try {
      //! ------------> VAMOS A GUARDAR LA INSTANCIA DEL NUEVO CHARACTER
      const saveTienda = await newTienda.save();
      if (saveTienda) {
        /** Si existe vamos a enviar un 200 como que todo esta ok y le enviamos con un json
         * el objeto creado
         */

        return res.status(200).json(saveTienda);
      } else {
        return res
          .status(404)
          .json("No se ha podido guardar el elemento en la DB ❌");
      }
    } catch (error) {
      return res.status(404).json("error general saved tienda");
    }
  } catch (error) {
    //! -----> solo entramos aqui en el catch cuando ha habido un error
    /** SI HA HABIDO UN ERROR -----
     * Tenemos que borrar la imagen en cloudinary porque se sube antes de que nos metamos en
     * el controlador---> porque es un middleware que esta entre la peticion del cliente y el controlador
     */

    req.file?.path && deleteImgCloudinary(catchImg);

    return (
      res.status(404).json({
        messege: "error en el creado del elemento",
        error: error,
      }) && next(error)
    );
  }
};

//! CREAR TOGGLE PARA CONECTAR MODELOS, PARA TRAER LOS ALIMENTOS QUE QUIERE A LA TIENDA
/// aqui metemos los personajes en el array del modelo de movie
const toggleAlimentos = async (req, res, next) => {
  try {
    /** estee id es el id de la moviee que queremos actualizar */
    const { id } = req.params;
    const { alimentos } = req.body; // -----> idDeLosCharacter enviaremos esto por el req.body "12412242253,12535222232,12523266346"
    /** Buscamos la pelicula por id para saber si existe */
    const tiendaById = await Tienda.findById(id);

    /** vamos a hacer un condicional para si existee hacer la update sino mandamos un 404 */
    if (tiendaById) {
      /** cageemos el string que traemos del body y lo convertimos en un array
       * separando las posiciones donde en el string habia una coma
       * se hace mediante el metodo del split
       */
      const arrayIdalimentos = alimentos.split(",");

      /** recorremos este array que hemos creado y vemos si tenemos quee:
       * 1) ----> sacar eel character si ya lo tenemos en el back
       * 2) ----> meterlo en caso de que no lo tengamos metido en el back
       */
      Promise.all(
        arrayIdalimentos.map(async (alimento, index) => {
          if (tiendaById.alimentos.includes(alimento)) {
            //*************************************************************************** */

            //________ BORRAR DEL ARRAY DE PERSONAJES EL PEERSONAJE DENTRO DE LA MOVIE___

            //*************************************************************************** */

            try {
              await Tienda.findByIdAndUpdate(id, {
                // dentro de la clavee characters me vas a sacar el id del elemento que estoy recorriendo
                $pull: { alimentos: alimento },
              });

              try {
                await Alimento.findByIdAndUpdate(alimento, {
                  $pull: { tiendas: id },
                });
              } catch (error) {
                res.status(404).json({
                  error: "error update alimento",
                  message: error.message,
                }) && next(error);
              }
            } catch (error) {
              res.status(404).json({
                error: "error update tienda",
                message: error.message,
              }) && next(error);
            }
          } else {
            //*************************************************************************** */
            //________ METER EL alimento EN EL ARRAY DE alimentos de las tiendas_____________
            //*************************************************************************** */
            /** si no lo incluye lo tenemos que meter -------> $push */

            try {
              await Tienda.findByIdAndUpdate(id, {
                $push: { alimentos: alimento },
              });
              try {
                await Alimento.findByIdAndUpdate(alimento, {
                  $push: { tiendas: id },
                });
              } catch (error) {
                res.status(404).json({
                  error: "error update alimento",
                  message: error.message,
                }) && next(error);
              }
            } catch (error) {
              res.status(404).json({
                error: "error update tienda",
                message: error.message,
              }) && next(error);
            }
          }
        })
      )
        .catch((error) => res.status(404).json(error.message))
        .then(async () => {
          return res.status(200).json({
            dataUpdate: await Tienda.findById(id).populate("alimentos"),
          });
        });
    } else {
      return res.status(404).json("esta tienda no existe");
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

//! -----------------get by id:

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tiendaById = await Tienda.findById(id);

    if (tiendaById) {
      return res.status(200).json(tiendaById);
    } else {
      return res.status(404).json("La tienda no se ha encontrado");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//!---------------------get all:

const getAll = async (req, res, next) => {
  try {
    const allTiendas = await Tienda.find().populate("alimentos");
    /** el find nos devuelve un array */
    if (allTiendas.length > 0) {
      return res.status(200).json(allTiendas);
    } else {
      return res.status(404).json("no se han encontrado tiendas");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar tiendas",
      message: error.message,
    });
  }
};

//! -----------------get by name:

const getByName = async (req, res, next) => {
  try {
    const { name } = req.params;

    const tiendaByName = await Tienda.find({ name });
    if (tiendaByName.length > 0) {
      return res.status(200).json(tiendaByName);
    } else {
      return res
        .status(404)
        .json("no se ha encontrado ninguna tienda con ese nombre");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar por nombre de tienda",
      message: error.message,
    });
  }
};

module.exports = { createTienda, toggleAlimentos, getById, getAll, getByName };
