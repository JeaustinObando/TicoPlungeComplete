const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Modelo de clase.
 */
const classSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    capacity: { type: Number, required: true },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Lista de referencias a usuarios
  },
  { strict: "throw" }
);

/**
 * Función de validación de datos de clase.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validateClass = (data) => {
  const schema = Joi.object({ // Esquema de validación
    date: Joi.date().required().label("Date"),
    user: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow("")
      .label("User"),
    service: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Service"),
    capacity: Joi.number().integer().min(1).required().label("Capacity"),
    students: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .label("Students"),
  });
  return schema.validate(data);
};


// Definición del modelo de clase
const Class = mongoose.model("Class", classSchema);

// Exportación de la clase y la función de validación
module.exports = { Class, validateClass };
