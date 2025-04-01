const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

/**
 * Modelo de usuario.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["Administrator", "Staff", "Client"],
    },
    plans: [
      {
        plan: {
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
        },
        expiration: { type: Date },
      },
    ],
  },
  { strict: "throw" }
);

/**
 * Función de validación de datos de usuario.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
      email: this.email,
      firstName: this.firstName,
      plans: this.plans,
    },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "2d",
    }
  );
  return token;
};

// Definir una opción de población personalizada
userSchema.statics.populateOptions = {
  select: "-password", // Excluir el campo 'password'
};

/**
 * Función de validación de datos de usuario.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validate = (data) => {
  const schema = Joi.object({ // Esquema de validación
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string()
      .valid("Administrator", "Staff", "Client")
      .required()
      .label("Role"),
  });
  return schema.validate(data);
};

/**
 * Función de validación de datos de plan.
 * @param {Object} data - Datos a validar.
 * @returns {Object} - Objeto con los errores y el valor.
 */
const validatePlan = (data) => {
  const schema = Joi.object({ // Esquema de validación
    name: Joi.string().required(),
    services: Joi.array()
      .items(
        Joi.object({
          serviceId: Joi.string().required(),
          credits: Joi.number().min(0).required(),
        })
      )
      .required(),
  });

  return schema.validate(data);
};

// Definición del modelo de usuario
const User = mongoose.model("User", userSchema);

// Exportación del modelo y la función de validación
module.exports = { User, validate, validatePlanId: validatePlan };
