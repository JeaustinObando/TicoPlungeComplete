const express = require("express");
const router = express.Router();
const { Plan, validatePlan } = require("../Models/PlanModel");
const { Service } = require("../Models/ServiceModel");

// Ruta para obtener todos los planes
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find().populate('services.service');
    res.json(plans.map(plan => ({
      ...plan.toObject(),
      services: plan.services.map(cp => ({
        service: cp.service,
        credits: cp.credits
      })),
      price: plan.price,
    })));
  } catch (error) {
    console.error("Error al consultar planes en MongoDB:", error);
    res.status(500).json({ error: "Error al consultar planes en MongoDB" });
  }
});

// Ruta para crear un nuevo plan
router.post("/", async (req, res) => {

  const planData = req.body;

  const { error } = validatePlan(planData);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if plan with the same name already exists
  const existingPlan = await Plan.findOne({ name: req.body.name });
  if (existingPlan) {
    return res.status(400).json({ error: "Ya existe un plan con ese nombre." });
  }

  try {
    const newPlan = await Plan.create(req.body);
    res.status(201).json({
      message: "Plan creado exitosamente.",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error al crear plan en MongoDB:", error);
    res.status(500).json({ error: "Error al crear plan en MongoDB" });
  }
});

// Ruta para actualizar un plan existente
router.put("/:id", async (req, res) => {

  const planData = {
    ...req.body,
    services: req.body.services.map((s) => ({
      ...s,
      service: s.service._id || s.service,
    })),
  };

  const { error } = validatePlan(planData);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('services.service', 'name');
    if (!updatedPlan) return res.status(404).json({ error: "Plan no encontrado." });
    res.json({
      message: "Plan actualizado exitosamente.",
      plan: updatedPlan
    });
  } catch (error) {
    console.error("Error al actualizar plan en MongoDB:", error);
    res.status(500).json({ error: "Error al actualizar plan en MongoDB" });
  }
});

// Ruta para eliminar un plan existente
router.delete("/:id", async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ error: "Plan no encontrado." });
    res.json({ message: "Plan eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar plan en MongoDB:", error);
    res.status(500).json({ error: "Error al eliminar plan en MongoDB" });
  }
});

module.exports = router;