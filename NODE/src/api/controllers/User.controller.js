/**
 * 14 llevar al .env el mail, passwort y port
 * 15 traer el modelo de datos de models.
 * 16 traer de la mw la parte de borrado de imagen (deleteimagecloudinary)
 * //! 17 en utils hay que crear un archivo randomCode
 * 18 traer randomCode de utils
 * 19 meter librerías validator, nodemailer y bcrypt
 * 20 registro de código largo
 * 21 capturar imagen de mw con optional chaining
 *....
 22 exportar a ruta
 */

//! 15

const User = require("../models/User.model");
//! 16

const { deleteImgCloudinary } = require("../../middleware/files.middleware");

//! 18
const randomCode = require("../../utils/randomCode");

randomCode; // lo trae

//! 19

const validator = require("validator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

//! 20

//------------------->CRUD es el acrónimo de "Crear, Leer, Actualizar y Borrar"
const registerLargo = async (req, res, next) => {
  //! 21  lo primero que vamos hacer captura la imagen que previamente hemos subido en el middleaware
  let catchImg = req.file?.path; //! el optional chaining es para que no rompa en caso de no haber path
  // el path es la url de cloudinary

  try {
    /** hay que meter un try catch por cada asincronia de actualizacion que tengamos de actualizacion para poder
     * seleccionar los errores de forma separada e individualizada
     *
     * la asincronias de lectura no hace falta que tengan un try catch por cada una de ellas
     */

    /** sincronizamos los index de los elementos unique */
    await User.syncIndexes();
    let confirmationCode = randomCode();
    const { email, name } = req.body; // lo que enviamos por la parte del body de la request

    // vamos a buscsar al usuario
    const userExist = await User.findOne(
      { email: req.body.email },
      { name: req.body.name }
    );

    if (!userExist) {
      //! -------------LO REGISTRAMOS PORQUE NO HAY COINCIDENCIAS CON UN USER INTERNO
      const newUser = new User({ ...req.body, confirmationCode });

      // EL USER HA METIDO IMAGEN ???
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        newUser.image = "https://pic.onlinewebfonts.com/svg/img_181369.png";
      }

      ///! SI HAY UNA NUEVA ASINCRONIA DE CREAR O ACTUALIZAR HAY QUE METER OTRO TRY CATCH
      try {
        const userSave = await newUser.save();
        return res.status(200).json({ data: userSave });
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      ///! -------> cuando ya existe un usuario con ese email y ese name
      if (req.file) deleteImgCloudinary(catchImg);
      // como ha habido un error la imagen previamente subida se borra de cloudinary
      return res.status(409).json("this user already exist");
    }
  } catch (error) {
    // SIEMPRE QUE HAY UN ERROR GENERAL TENEMOS QUE BORRAR LA IMAGEN QUE HA SUBIDO EL MIDDLEWARE
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//! 22 como lo consume la ruta, 23 a ruta:

module.exports = { registerLargo };
