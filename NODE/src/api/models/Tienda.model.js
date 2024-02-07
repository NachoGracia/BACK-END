const mongoose = require("mongoose");

const tiendaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
    alimentos: [{ type: mongoose.Schema.ObjectId, ref: "Alimento" }],
    fav: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Tienda = mongoose.model("Tienda", tiendaSchema);

module.exports = Tienda;
