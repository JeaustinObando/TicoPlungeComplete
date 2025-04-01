const mongoose = require("mongoose");
const Joi = require("joi");
/**
 * Modelo de feedback privado.
 */
const privateFeedbackSchema = new mongoose.Schema(
  {
    comentario: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Cambia de String a ObjectId
      ref: "User", // Referencia a la colección de usuarios
      required: false,
    },
    creationDate: { type: Date, default: Date.now }, // Añadido el campo creationDate
  },
  { strict: "throw" }
);
/**
 * Función de validación de datos de feedback privado.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validatePrivateFeedback = (data) => {
  const schema = Joi.object({ // Esquema de validación
    comentario: Joi.string().required().label("Comentario"),
    user: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .label("User"),
  });
  return schema.validate(data);
};

const PrivateFeedback = mongoose.model(
  "PrivateFeedback",
  privateFeedbackSchema
); // Corrección del nombre del esquema

// Exportación del modelo y la función de validación
module.exports = { PrivateFeedback, validatePrivateFeedback };
