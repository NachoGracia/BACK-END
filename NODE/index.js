//! crear servidor express
//! crear en mongodb a través de mongoose y express en node.

const express = require("express");
const dotenv = require("dotenv");

const { connect } = require("./src/utils/db");
const { configCloudinary } = require("./src/middleware/files.middleware"); //! 7

//! creamos el servidor web
const app = express();

//! vamos a configurar dotenv para poder utilizar las variables d entorno del .env
dotenv.config();

//! conectamos con la base de datos
connect();

//!----------------------- 7. traer el cloudinary, ya aparece arriba automaticamente. paso 8 en models/User.model

configCloudinary();

//! 28incluir el puerto del .env en MAYUSCULAS pq PORT no cambia

const PORT = process.env.PORT;

//! 29 instalar CORS

//! 30 configuración general de CORS:

const cors = require("cors");
app.use(cors());

//! 31 config de limites, extended en false:

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));

//! -----------------> RUTAS
const UserRoutes = require("./src/api/routes/User.routes");
app.use("/api/v1/users/", UserRoutes); //! RUTA GENERAL

const TiendaRoutes = require("./src/api/routes/Tienda.routes");
app.use("/api/v1/tiendas/", TiendaRoutes);

//! -------------------> generamos un error de cuando no see encuentre la ruta
app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  return next(error);
});

//! ------------------> cuando el servidor crachea metemos un 500 ----------
app.use((error, req, res) => {
  return res
    .status(error.status || 500)
    .json(error.message || "unexpected error");
});

//! ------------------ ESCUCHAMOS EN EL PUERTO EL SERVIDOR WEB-----

// esto de aqui  nos revela con que tecnologia esta hecho nuestro back
app.disable("x-powered-by");
app.listen(PORT, () =>
  console.log(`Server listening on port 👌🔍 http://localhost:${PORT}`)
);

//!   instalar nodemailer
