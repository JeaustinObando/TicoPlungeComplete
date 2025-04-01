const express = require("express");
const router = express.Router();
const {
  PlanRequest,
  validatePlanRequest,
} = require("../Models/PlanRequestModel");
const { User, validate } = require("../Models/User");

router.get("/", async (req, res) => {
  try {
    const planRequests = await PlanRequest.find().populate("user plan");
    res.json(planRequests);
  } catch (error) {
    res
      .status(500)
      .send("Error al obtener las solicitudes de planes: " + error.message);
  }
});

router.post("/", async (req, res) => {
  const { error } = validatePlanRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const planRequest = new PlanRequest({
      user: req.body.user,
      plan: req.body.plan,
    });
    await planRequest.save();
    res.status(201).send(planRequest);
  } catch (error) {
    res
      .status(500)
      .send("Error al crear la solicitud de plan: " + error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const planRequest = await PlanRequest.findByIdAndDelete(req.params.id);
    if (!planRequest)
      return res.status(404).send("La solicitud de plan no fue encontrada.");
    res.send(planRequest);
  } catch (error) {
    res
      .status(500)
      .send("Error al eliminar la solicitud de plan: " + error.message);
  }
});

module.exports = router;
