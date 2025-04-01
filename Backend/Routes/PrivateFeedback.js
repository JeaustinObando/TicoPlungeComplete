const express = require("express");
const router = express.Router();
const {
  PrivateFeedback,
  validatePrivateFeedback,
} = require("../Models/PrivateFeedback");

// Ruta para obtener todos los comentarios
router.get("/", async (req, res) => {
  try {
    const comentarios = await PrivateFeedback.find().populate('user'); // Obtenemos todos los comentarios
    res.json(comentarios); // Devolvemos los comentarios como JSON
  } catch (error) {
    console.error("Error al consultar comentarios en MongoDB:", error);
    res
      .status(500)
      .json({ error: "Error al consultar comentarios en MongoDB" });
  }
});

// Ruta para agregar un nuevo comentario
router.post("/", async (req, res) => {
  // Extraemos los datos del comentario del cuerpo de la solicitud
  const comentario = req.body;
  // Validar el comentario utilizando Joi
  const { error } = validatePrivateFeedback(comentario);
  if (error) {
    // Si hay errores de validación, devolver un error 400 con los detalles del error
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    // Verificar si ya existe un comentario con el mismo contenido
    const comentarioExistente = await PrivateFeedback.findOne(comentario);

    // Si ya existe, devolver un mensaje indicando que el comentario ya existe
    if (comentarioExistente) {
      return res.status(400).json({
        message: "El comentario ya existe.",
        error: "El comentario ya existe",
      });
    }

    // Si no existe, crear un nuevo comentario
    const nuevoComentario = await PrivateFeedback.create(comentario);

    // Devolver una respuesta exitosa con el nuevo comentario creado
    res.status(201).json({
      message: "Comentario agregado exitosamente.",
      comentario: nuevoComentario,
    });
  } catch (error) {
    console.error("Error al agregar comentario en MongoDB:", error);
    res.status(500).json({ error: "Error al agregar comentario en MongoDB" });
  }
});

// Ruta para eliminar un comentario por su ID
router.delete("/:id", async (req, res) => {
  const comentarioId = req.params.id;

  try {
    const resultado = await PrivateFeedback.deleteOne({ _id: comentarioId }); // Eliminamos el comentario por su ID
    if (resultado.deletedCount === 1) {
      res.status(200).json({ message: "Comentario eliminado exitosamente." });
    } else {
      console.error("No se pudo encontrar el comentario para eliminar.");
      res.status(404).json({ error: "Comentario no encontrado." });
    }
  } catch (error) {
    console.error("Error al eliminar comentario en MongoDB:", error);
    res.status(500).json({ error: "Error al eliminar comentario en MongoDB" });
  }
});

module.exports = router;
