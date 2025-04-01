const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Modelo de plan.
 */
const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        credits: { type: Number, required: true },
      },
    ],
    price: { type: Number, required: true },
  },
  { strict: "throw" }
);

/**
 * Función de validación de datos de plan.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validatePlan = (data) => {
  const schema = Joi.object({ // Esquema de validación
    name: Joi.string().required().label("Name"),
    services: Joi.array()
      .items(
        Joi.object({
          service: Joi.string().required().label("Service"),
          credits: Joi.number().min(0).required().label("Credits"),
        })
      )
      .required()
      .label("Contracted Services"),
    price: Joi.number().min(0).required().label("Price"),
  });
  return schema.validate(data);
};

// Definición del modelo de plan
const Plan = mongoose.model("Plan", planSchema);

// Exportación del modelo y la función de validación
module.exports = { Plan, validatePlan };
