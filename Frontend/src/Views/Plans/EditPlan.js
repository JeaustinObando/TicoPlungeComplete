import React, { useState, useEffect } from "react";
import {
  updateToBD,
  urlPlan,
  deleteByIDToBD,
  selectToBD,
  urlService,
} from "../../GlobalVariables";
import "./EditPlan.css";

// Componente para editar un plan existente
const EditPlan = ({
  plan, // Objeto del plan actual a editar
  onClose, // Función para cerrar el modal de edición
  onSave, // Función para realizar acciones tras guardar los cambios
  fetchExistingPlans, // Función para recargar los planes desde la base de datos
  setshowErroresForm, // Función para mostrar errores en el formulario
}) => {
  // Estado local para manejar los datos del plan
  const [planData, setPlanData] = useState({
    name: plan.name,
    services: plan.services,
    price: plan.price,
  });
  const [existingServices, setExistingServices] = useState([]);

  // Función para obtener los servicios existentes desde la base de datos
  const fetchExistingServices = async () => {
    try {
      const servicesData = await selectToBD(urlService);
      setExistingServices(servicesData);
    } catch (error) {
      console.error("Error al obtener servicios existentes:", error);
    }
  };

  // Efecto para cargar los servicios al montar el componente
  useEffect(() => {
    fetchExistingServices();
  }, []);

  // Maneja los cambios en los campos de entrada del formulario
  const handleInputChange = (e) => {
    setPlanData({
      ...planData,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle para agregar o quitar servicios del plan
  const handleToggleService = (service) => {
    const isSelected = planData.services.some(
      (s) => s.service._id === service._id
    );
    const updatedServices = isSelected
      ? planData.services.filter((s) => s.service._id !== service._id)
      : [...planData.services, { service: service, credits: 1 }]; // Assign default credits

    setPlanData({ ...planData, services: updatedServices });
  };

  // Cambia los créditos para un servicio específico
  const handleCreditsChange = (serviceId, credits) => {
    const updatedServices = planData.services.map((contratedService) =>
      contratedService.service._id === serviceId
        ? { ...contratedService, credits: parseInt(credits) || 0 }
        : contratedService
    );
    setPlanData({ ...planData, services: updatedServices });
  };

  // Maneja el envío del formulario para guardar los cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmacion = window.confirm("¿Está seguro de que desea guardar los cambios?");
    if (confirmacion) {
      try {
        const response = await updateToBD(urlPlan, plan._id, planData);
        if (response.success) {
          onSave();
          setshowErroresForm("Plan actualizado exitosamente.");
          onClose();
        } else {
          setshowErroresForm("Error actualizando el plan: " + response.message);
        }
      } catch (error) {
        setshowErroresForm("Se ha fallado actualizando plan: " + error.message);
      }
    }
    fetchExistingPlans();
  };

  // Elimina el plan actual
  const handleDelete = async () => {
    try {
      await deleteByIDToBD(urlPlan, plan._id);
      fetchExistingPlans();
      onClose();
      window.alert("Plan eliminado exitosamente.");
    } catch (error) {
      setshowErroresForm("Error eliminando el plan: " + error.message);
    }
  };

  // Renderiza el formulario de edición de plan
  return (
    <form className="container-edit-plan" onSubmit={handleSubmit}>
      <div className="form-group">
        <label style={{ fontWeight: "bold", marginRight: "8px" }}>
          Nombre del plan:
        </label>
        <input
          type="text"
          name="name"
          value={planData.name}
          onChange={handleInputChange}
          className="form-control-edit-plan"
        />
      </div>
      <label style={{ marginBottom: "4px", fontWeight: "bold" }}>
        Servicios Incluidos:
      </label>
      {existingServices.map((service) => (
        <div key={service._id} className="input-group-editPlan-plan">
          <label className="container-plan-checkbox">
            <input
              className="input"
              type="checkbox"
              id={`service2-${service._id}`}
              checked={planData.services.some(
                (s) => s.service._id === service._id
              )}
              onChange={() => handleToggleService(service)}
            />
            <span className="checkmark-plan"></span>
          </label>
          <label
            style={{ marginLeft: "20px" }}
            htmlFor={`service-${service._id}`}
          >
            {service.name}
          </label>
          {planData.services.some((s) => s.service._id === service._id) && (
            <>
              <br></br>
              <label
                htmlFor={`credits-${service._id}`}
                style={{ fontSize: "14px" }}
              >
                Créditos:
              </label>
              <input
                type="number"
                value={
                  planData.services.find((s) => s.service._id === service._id)
                    .credits
                }
                onChange={(e) =>
                  handleCreditsChange(service._id, e.target.value)
                }
                min="1"
                className="form-control-edit-plan"
              />
            </>
          )}
        </div>
      ))}
      <div className="form-group">
        <br></br>
        <label style={{ marginRight: "4px", fontWeight: "bold" }}>
          Precio del Plan (₡)
        </label>
        <input
          type="number"
          name="price"
          value={planData.price}
          onChange={handleInputChange}
          min="0"
          className="form-control-edit-plan"
        />
      </div>
      <div className="modal-footer-edit-plan">
        <button className="btn btn-primary" type="submit">
          Guardar Cambios
        </button>
        <button className="btn btn-danger" type="button" onClick={handleDelete}>
          Eliminar Plan
        </button>
      </div>
    </form>
  );
};

export default EditPlan;
