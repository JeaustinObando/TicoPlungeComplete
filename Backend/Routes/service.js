const router = require("express").Router();
const { Service, validateService } = require("../Models/ServiceModel");
const { User } = require("../Models/User");

// Ruta para obtener todas las clases
router.get("/", async (req, res) => {
  try {
    // Obtenemos el filtro de la consulta
    const filtro = req.query.filtro;
    // Si hay un filtro en la consulta, lo utilizamos en la consulta a la base de datos
    let servicios;
    if (filtro) {
      // Convierte el filtro de cadena JSON a objeto
      const filtroObj = JSON.parse(filtro);
      servicios = await Service.find(filtroObj).populate("encargados");
    } else {
      // Si no hay filtro en la consulta, simplemente obtenemos todas las clases
      servicios = await Service.find().populate("encargados");
    }

    res.json(servicios);
  } catch (error) {
    console.error("Error al consultar servicios en MongoDB:", error);
    res.status(500).json({ error: "Error al consultar servicios en MongoDB" });
  }
});

// Ruta para agregar un nuevo servicio
router.post("/", async (req, res) => {
  // Extraemos los datos del servicio del cuerpo de la solicitud
  const servicioData = req.body;

  // Validamos los datos del servicio
  const { error } = validateService(servicioData);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Verificar si ya existe un servicio con los mismos datos de nombre y usuario
    const existingService = await Service.findOne({ name: servicioData.name });

    if (existingService) {
      // Verificar si el encargado ya está en la lista de encargados
      const newEncargado = servicioData.encargados[0];
      const isEncargadoAlreadyAdded =
        existingService.encargados.includes(newEncargado);

      if (!isEncargadoAlreadyAdded) {
        // Añadir el nuevo encargado a la lista de encargados
        existingService.encargados.push(newEncargado);
        await existingService.save();
        return res.status(200).json({
          message: "Se ha agregado un nuevo encargado al servicio.",
          servicio: existingService,
        });
      } else {
        return res
          .status(400)
          .json({
            error: "Ya existe el servicio y el encargado ya está asignado",
          });
      }
    }

    // Si no existe, creamos un nuevo servicio
    const nuevoServicio = await Service.create(servicioData);
    res.status(201).json({
      message: "Servicio agregado exitosamente.",
      servicio: nuevoServicio,
    });
  } catch (error) {
    console.error("Error al agregar servicio en MongoDB:", error);
    res.status(500).json({ error: "Error al agregar servicio en MongoDB" });
  }
});

// Ruta para obtener los usuarios con rol de "staff"
router.get("/staff", async (req, res) => {
  try {
    const staffUsers = await User.find({ role: "Staff" });
    res.json(staffUsers);
  } catch (error) {
    console.error("Error al consultar usuarios con rol de staff:", error);
    res
      .status(500)
      .json({ error: "Error al consultar usuarios con rol de staff" });
  }
});

router.delete("/:id", async (req, res) => {
  const serviceID = req.params.id;

  try {
    const resultado = await Service.deleteOne({ _id: serviceID }); // Eliminamos el servicio por su ID
    if (resultado.deletedCount === 1) {
      res.status(200).json({ message: "Servicio eliminado exitosamente." });
    } else {
      console.error("No se pudo encontrar el Servicio para eliminar.");
      res.status(404).json({ error: "Servicio no encontrado." });
    }
  } catch (error) {
    console.error("Error al eliminar servicio en MongoDB:", error);
    res.status(500).json({ error: "Error al eliminar servicio en MongoDB" });
  }
});

// Ruta para obtener un servicio específico por su ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "encargados",
      "firstName lastName -_id"
    );
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado." });
    res.json(service);
  } catch (error) {
    console.error("Error al consultar servicio en MongoDB:", error);
    res.status(500).json({ error: "Error al consultar servicio en MongoDB" });
  }
});

// Ruta para actualizar un servicio existente
router.put("/:id", async (req, res) => {
  console.log(req.body);
  const { error } = validateService(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedService)
      return res.status(404).json({ error: "Servicio no encontrado." });
    res.json(updatedService);
  } catch (error) {
    console.error("Error al actualizar servicio en MongoDB:", error);
    res.status(500).json({ error: "Error al actualizar servicio en MongoDB" });
  }
});

module.exports = router;
