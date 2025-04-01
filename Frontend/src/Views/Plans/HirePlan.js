import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./HirePlan.css"; // Asegúrate de tener estilos adecuados para esta vista
import {
  urlPlan,
  selectToBD,
  selectUserByToken,
  createToBD,
  urlPlanRequest,
  timeWaitAlert,
  SuccessAlert,
  ErrorAlert,
  NotFound,
} from "../../GlobalVariables";

// Componente para permitir a los usuarios contratar planes
const HirePlan = () => {
  const [showErroresForm, setshowErroresForm] = useState("");
  const [existingPlans, setExistingPlans] = useState([]);
  const [existingRequests, setExistingRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [usuarioActivo, setUsuarioActivo] = useState({});

  // Obtener planes disponibles desde la base de datos
  const fetchExistingPlans = async () => {
    try {
      const plansData = await selectToBD(urlPlan);
      setExistingPlans(plansData);
    } catch (error) {
      console.error("Error al obtener planes existentes:", error);
    }
  };

  // Obtener solicitudes de planes hechas por el usuario
  const fetchPlanRequests = async () => {
    if (usuarioActivo) {
      try {
        const requestData = await selectToBD(urlPlanRequest);
        setExistingRequests(requestData);
      } catch (error) {
        console.error("Error al obtener las solicitudes de plan existentes:", error);
      }
    }
  };

  // Obtener el usuario activo desde la base de datos
  const GetUserActive = async () => {
    const user = await selectUserByToken();
    setUsuarioActivo(user);
  };

  useEffect(() => {
    fetchExistingPlans();
    GetUserActive();
    fetchPlanRequests();
  }, []);

  // Manejar la contratación de un plan
  const handleHire = async (planId) => {
    try {
      let alreadyRequested = existingRequests.some(
        (request) => request.plan._id === planId && request.user._id === usuarioActivo._id
      );

      let alreadyHired = usuarioActivo.plans?.some(
        (plan) => plan._id === planId
      );

      if (alreadyRequested || alreadyHired) {
        const message = alreadyRequested ? "Ya has solicitado este plan. Espera la confirmación." : "Ya has contratado este plan. Escoge uno nuevo.";
        setshowErroresForm(<ErrorAlert message={message} />);
        setTimeout(() => {
          setshowErroresForm("");
        }, timeWaitAlert);
        return;
      }

      const response = await createToBD(urlPlanRequest, {
        user: usuarioActivo._id,
        plan: planId,
      });

      setshowErroresForm(<SuccessAlert message={"Solicitud enviada exitosamente."} />);
      setTimeout(() => {
        setshowErroresForm("");
      }, timeWaitAlert);
    } catch (error) {
      console.error("Error al enviar la solicitud de contratación:", error);
      alert("No se pudo enviar la solicitud de contratación debido a un error");
    }
    fetchPlanRequests();
  };

  // Abrir modal de confirmación para contratación de plan
  const openModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Cerrar modal de confirmación
  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  if (usuarioActivo.role !== "Client" && usuarioActivo.role !== "Administrator") {
    return <NotFound mensaje="Lo sentimos, no tienes acceso a esta página" />;
  }

  // Renderizar la vista de contratación de planes
  return (
    <div className="hirePlanStyle">
      <div className={`m-3 ${showErroresForm ? "" : "d-none"}`}>
        {showErroresForm}
      </div>
      <div className="card-container-general">
        {existingPlans.length > 0 ? (
          existingPlans.map((item, index) => (
            <div className="card-general" key={item._id}>
              <span className="card-title-general" id={index}>
                {item.name}
              </span>
              <div className="card-divider-general"></div>
              <span className="card-subtitle-general">Servicios incluidos:</span>
              <span className="card-list-general">
                {item.services.map((contractedService, index) => (
                  <li key={index} className="custom-li-plan">
                    {contractedService.service.name} -{" "}
                    {contractedService.credits} créditos
                  </li>
                ))}
              </span>
              <div className="card-divider-service"></div>
              <span className="card-subtitle-general" id={index}>
                Precio ₡ {item.price}
              </span>
              <div className="card-divider-service"></div>
              <button
                className="btn btn-primary"
                onClick={() => openModal(item)}
              >
                Contratar
              </button>
            </div>
          ))
        ) : (
          <div className="no-data">
            <h2>No hay planes creados</h2>
          </div>
        )}

        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Contratar Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ fontWeight: "bold", color: "#333" }}>
              ¿Estás seguro que deseas contratar el plan "{selectedPlan?.name}"?
            </p>
            <p style={{ color: "#666" }}>
              Para confirmar la contratación, deberás realizar el pago
              correspondiente.<br></br>
              Cuando el pago sea confirmado, el plan será activado en tu cuenta.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                await handleHire(selectedPlan._id);
                closeModal();
              }}
            >
              Contratar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default HirePlan;
