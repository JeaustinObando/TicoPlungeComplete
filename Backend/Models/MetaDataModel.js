const mongoose = require("mongoose");

/**
 * Modelo de metadatos.
 */
const metadataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  weight: {
    type: Number,
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
});

// Definición del modelo de metadatos
const Metadata = mongoose.model("Metadata", metadataSchema);

// Exportación del modelo y la función de validación
module.exports = { Metadata };
