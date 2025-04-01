const router = require("express").Router();
const { User } = require("../Models/User.js");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const token = req.query.token;
    // El usuario decodificado del token está disponible en req.user
    const decoded = jwt.decode(token, process.env.JWTPRIVATEKEY);

    // Buscar al usuario por ID y poblar los detalles de los planes
    const user = await User.findById(decoded._id).populate({
      // Pobla el documento Plan dentro del array 'plans'
      path: "plans.plan.services.service", // Aquí asumimos que 'services' es un array dentro de cada 'plan' y 'service' es una referencia a otro modelo
      model: "Service", // Especifica el modelo 'Service' si el nombre de la referencia no coincide con el modelo
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Devolver el usuario con los planes poblados
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    // Verificar la expiración de los planes
    const now = new Date();
    let isModified = false;
    if (user.plans.length > 0) {
      user.plans = user.plans.filter((plan) => {
        const expiration = new Date(plan.expiration);
        if (expiration < now) {
          isModified = true;
          return false;
        }
        return true;
      });
    }

    // Guardar el usuario si se modificó la lista de planes
    if (isModified) {
      await user.save();
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
