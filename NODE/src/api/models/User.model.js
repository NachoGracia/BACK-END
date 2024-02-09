/** el modelo de datos lo crea mongoose:
 * 8 instalar bcrypt y validator
 * 9 importar mongoose , bcrypt y validator
 * 10 hacer el esquema de datos con mongoose
 * 11 hacer un pre-save, para encriptar la contraseña
 * 12 crear modelo
 * 13 exportar modelo
 */

//! 9
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

//! 10

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Email not valid"], // en caso de no ser un email valido
      // lanza el error ----> 'Email not valid'
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isStrongPassword], //minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    },
    gender: {
      type: String,
      enum: ["hombre", "mujer", "otros"],
      required: true,
    },
    rol: {
      type: String,
      enum: ["admin", "user", "superadmin"],
      default: "user",
    },
    confirmationCode: {
      type: Number,
      required: true,
    },
    check: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },

    favTiendas: [{ type: mongoose.Schema.ObjectId, ref: "Tienda" }],
    /// cuando relacionamos un modelo de con otro lo hacemos con populate y el ref a otro modelo
  },
  {
    timestamps: true,
  }
);

//! 11 el pre-save para encriptar la contraseña tipo hashing:

UserSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
    // el next puede lanzar al log o puede decir que continuemos
  } catch (error) {
    next("Error hashing password", error);
  }
});

//! 12 creamos el modelo una vez encriptado con mongoose, en MAYUSCULAS la 1ª:

const User = mongoose.model("User", UserSchema);

//! 13 y ahora exportamos. como lo consume el controlador, paso 14 en controllers.

module.exports = User;
