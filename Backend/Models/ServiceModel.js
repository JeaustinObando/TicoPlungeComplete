const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Modelo de servicio.
 */
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    encargados: [
      {
        type: mongoose.Schema.Types.ObjectId, // Cambia de String a ObjectId
        ref: "User", // Referencia a la colección de usuarios
        required: false,
      },
    ],
  },
  { strict: "throw" }
);

/**
 * Función de validación de datos de servicio.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validateService = (data) => {
  const schema = Joi.object({ // Esquema de validación
    name: Joi.string().required().label("Name"),
    encargados: Joi.array().items(Joi.string()).optional().label("Encargados"),
  });
  return schema.validate(data);
};

// Definición del modelo de servicio
const Service = mongoose.model("Service", serviceSchema);

// Exportación del modelo y la función de validación
module.exports = { Service, validateService };
