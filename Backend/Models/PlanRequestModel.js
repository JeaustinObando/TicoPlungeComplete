const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Modelo de solicitud de plan.
 */
const planRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Función de validación de datos de solicitud de plan.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validatePlanRequest = (data) => {
  const schema = Joi.object({ // Esquema de validación
    user: Joi.string().required().label("User ID"),
    plan: Joi.string().required().label("Plan ID"),
  });
  return schema.validate(data);
};

// Definición del modelo de solicitud de plan
const PlanRequest = mongoose.model("PlanRequest", planRequestSchema);

// Exportación del modelo y la función de validación
module.exports = { PlanRequest, validatePlanRequest };
