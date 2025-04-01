const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const { Metadata } = require("../models/MetadataModel"); // Asegúrate de tener el modelo de Metadata.

// Ruta para cargar la metadata y la imagen
router.post("/", async (req, res) => {
  const { user, phone, height, weight, birthday } = req.body;

  try {
    const metadata = new Metadata({
      user,
      phone,
      height,
      weight,
      birthday,
    });

    await metadata.save();
    res.status(201).send({ message: "Metadata saved successfully", metadata });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to save metadata", error: error.message });
  }
});

// Ruta opcional para obtener la metadata de un usuario
router.get("/:userId", async (req, res) => {
  try {
    const metadata = await Metadata.findOne({
      user: new mongoose.Types.ObjectId(req.params.userId),
    });
    if (!metadata) {
      return res.status(404).send({ message: "Metadata not found" });
    }
    res.send(metadata);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to retrieve metadata", error: error.message });
  }
});

router.put("/:userId", async (req, res) => {
  const { phone, height, weight, birthday } = req.body;
  const userId = req.params.userId;
  const updates = {
    phone,
    height,
    weight,
    birthday,
  };

  try {
    // Buscar y actualizar la metadata, retornar el documento actualizado
    const metadata = await Metadata.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true }
    );
    if (!metadata) {
      return res
        .status(404)
        .send({ message: "Metadata not found for this user" });
    }
    res.send({ message: "Metadata updated successfully", metadata });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to update metadata", error: error.message });
  }
});

module.exports = router;
