const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Modelo de feedback.
 */
const feedbackSchema = new mongoose.Schema(
  {
    comentario: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    creationDate: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Cambia de String a ObjectId
      ref: "User", // Referencia a la colección de usuarios
      required: false,
    },
  },
  { strict: "throw" }
);

/**
 * Función de validación de datos de feedback.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validateFeedback = (data) => {
  const schema = Joi.object({ // Esquema de validación
    comentario: Joi.string().required().label("Comentario"),
    rating: Joi.number().integer().min(1).max(5).required().label("Rating"),
    user: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .label("User"),
  });
  return schema.validate(data);
};

// Definición del modelo de feedback
const Feedback = mongoose.model("Feedback", feedbackSchema);

// Exportación del modelo y la función de validación
module.exports = { Feedback, validateFeedback };
