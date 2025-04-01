import { useState } from "react";
import { updateToBD, urlClass, timeWaitAlert } from "../../GlobalVariables";
import React from "react";

// Componente AppointmentEdit: permite la edición de un appointment específico.
const AppointmentEdit = ({
  Appointment, // Objeto Appointment que contiene la información inicial para la edición.
  onClose, // Función para cerrar el modal de edición.
  onSave, // Función a ejecutar cuando se guarda la edición correctamente.
  setshowAlerts, // Función para mostrar alertas en la interfaz de usuario.
  selectClassBD, // Función para actualizar la lista de clases mostradas tras editar.
}) => {
  // Estado para manejar la capacidad del appointment, inicializado con el valor actual.
  const [capacity, setCapacity] = useState(Appointment.capacity || "");

  // Función para actualizar el appointment en la base de datos.
  const updateAppointment = async (Appointment) => {
    // Parámetros mínimos según el modelo del backend para actualizar un appointment.
    const parametrosActualizar = {
      capacity: Appointment.capacity,
      date: Appointment.date,
      user: Appointment.user._id,
      service: Appointment.service._id,
    };
    // Llamada a la API para actualizar los datos en la base de datos.
    const response = await updateToBD(
      urlClass,
      Appointment._id,
      parametrosActualizar
    );
    selectClassBD(); // Actualizar la lista de clases.
    setshowAlerts(response); // Mostrar la respuesta como alerta.
    setTimeout(() => {
      setshowAlerts(""); // Limpiar la alerta después del tiempo establecido.
    }, timeWaitAlert);
  };

  // Manejador del evento de envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario.
    const updatedAppointment = {
      ...Appointment,
      capacity: capacity, // Actualizar la capacidad con el nuevo valor.
    };
    await updateAppointment(updatedAppointment); // Llamar a la función de actualización.
    onSave(); // Ejecutar cualquier lógica adicional después de guardar.
    onClose(); // Cerrar el formulario de edición.
  };

  // Renderización del formulario de edición.
  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Capacidad</label>
        <input
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <button className="btn btn-primary m-3" type="submit">
          Guardar
        </button>
        <button className="btn btn-danger m-3" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AppointmentEdit;
