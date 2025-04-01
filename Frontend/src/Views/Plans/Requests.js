import React, { useEffect, useState } from "react";
import {
  urlPlanRequest,
  selectToBD,
  updateToBD,
  urlSingIn,
  NotFound,
  selectUserByToken,
} from "../../GlobalVariables"; // Asegúrate de que esta URL sea correcta
import axios from "axios";
import "./Requests.css";

// Componente para manejar las solicitudes de planes hechas por los clientes
const Requests = () => {
  const [planRequests, setPlanRequests] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState({});

  // Cargar las solicitudes de contratación de planes existentes
  const fetchPlanRequests = async () => {
    try {
      const response = await selectToBD(urlPlanRequest);
      setPlanRequests(response);
    } catch (error) {
      console.error("Error al obtener las solicitudes de contratación:", error);
    }
  };

  // Cargar información del usuario activo
  const GetUserActive = async () => {
    const user = await selectUserByToken();
    setUsuarioActivo(user);
  };

  // Efecto inicial para cargar los datos necesarios
  useEffect(() => {
    fetchPlanRequests();
    GetUserActive();
  }, []);

  // Aceptar una solicitud de contratación de plan
  const handleAccept = async (request) => {
    if (window.confirm("¿Estás seguro de que deseas aceptar esta solicitud?")) {
      try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30); // Configurar la expiración a 30 días desde hoy

        const planDetails = {
          name: request.plan.name,
          services: request.plan.services.map(service => ({
            serviceId: service.service,
            credits: service.credits
          }))
        };

        const updateData = {
          plan: planDetails,
          expirationDate: expirationDate.toISOString(),
        };

        // Actualizar la información del usuario para agregar el plan
        const response = await updateToBD(
          `${urlSingIn}/addPlan`,
          request.user._id,
          updateData
        );

        if (response.type.name === "SuccessAlert") {
          window.alert("Solicitud aceptada");
        }
        await axios.delete(`${urlPlanRequest}/${request._id}`);
        fetchPlanRequests();
      } catch (error) {
        console.error("Error al aceptar la solicitud:", error);
      }
    }
  };

  // Rechazar una solicitud
  const handleReject = async (requestId) => {
    if (window.confirm("¿Estás seguro de que deseas rechazar esta solicitud?")) {
      try {
        await axios.delete(`${urlPlanRequest}/${requestId}`);
        window.alert("Solicitud rechazada");
        fetchPlanRequests(); // Actualizar la lista tras eliminar una solicitud
      } catch (error) {
        window.alert("Error al rechazar la solicitud:", error);
      }
    }
  };

  // Formatear la fecha para mostrar
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB'); // Ajustar el formato según la localidad si es necesario
  };

  // Verificar si el usuario tiene permisos para acceder
  if (usuarioActivo.role !== "Administrator") {
    return <NotFound mensaje="Lo sentimos, no tienes acceso a esta página" />;
  }

  // Renderización de la lista de solicitudes
  return (
    <div className="request-style">
      <div className="request">
      <h1 className="m-3">Solicitudes de Planes</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre del Cliente</th>
            <th>Correo del Cliente</th>
            <th>Nombre del Plan</th>
            <th>Fecha de Solicitud</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planRequests.length > 0 ? (
            planRequests.map((request) => (
              <tr key={request._id}>
                <td>
                  {request.user.firstName} {request.user.lastName}
                </td>
                <td>{request.user.email}</td>
                <td>{request.plan.name}</td>
                <td>{formatDate(new Date(request.createdAt))}</td>
                <td>
                  <button
                    className="btn btn-primary m-3"
                    onClick={() => handleAccept(request)}
                  >
                    Aceptar
                  </button>
                  <button
                    className="btn btn-danger m-3"
                    onClick={() => handleReject(request._id)}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay solicitudes pendientes.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Requests;
