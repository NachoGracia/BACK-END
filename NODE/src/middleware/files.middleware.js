//!--Como el servidor no almacena imágenes, solo texto necesitamos un middleware que envie las imagenes cloudinary.
/**
 * 0 instalar multer, cloudinary y multer-storage-cloudinary. traer con require
 *1 traer cloudinary
 *2 multer
 *3 función borrado
 *4 config cloudinary
 *5 traer y configurar el dotenv (ya que hemos traido cosas del .env)
 *6 exportar todo y llevarlo al index para poderlo ejecutar en su momento.

 */

const multer = require("multer"); // paso 0
const cloudinary = require("cloudinary").v2; // paso 0
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // paso 0
const dotenv = require("dotenv"); // paso 0
dotenv.config(); // paso 0

//! 1 aqui es donde se guardarán las fotos, creamos el storage.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ejercicioSeis",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
  },
});

//! 2 esto es el multer, librería que gestiona archivos. Gestiona el storage de arriba.
const upload = multer({ storage });

//! 3 Función de borrado de imagenes en cloudinary

const deleteImgCloudinary = (imgUrl) => {
  const imgSplited = imgUrl.split("/");
  const nameSplited = imgSplited[imgSplited.length - 1].split(".");
  const folderSplited = imgSplited[imgSplited.length - 2];
  const public_id = `${folderSplited}/${nameSplited[0]}`;

  cloudinary.uploader.destroy(public_id, () => {
    console.log("Image delete in cloudinary");
  });
};

//! 4 configuración del cloudinary, hay que buscarlo en cloudinary. como viene del .env arriba configuramos el dotenv.

const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
};

//! 6 exportar para poder llevar a index
module.exports = { upload, deleteImgCloudinary, configCloudinary };
