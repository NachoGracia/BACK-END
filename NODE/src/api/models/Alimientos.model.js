const { mongoose } = require("mongoose");

const alimentoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    cad: { type: String },
    image: { type: String },
    tiendas: [{ type: mongoose.Schema.ObjectId, ref: "Tienda" }],
    favByUser: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Alimento = mongoose.model("Alimento", alimentoSchema);

module.exports = Alimento;
