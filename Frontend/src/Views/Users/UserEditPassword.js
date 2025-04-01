import { useState } from "react";
import axios from "axios";
import {
  ErrorAlert,
  SuccessAlert,
  urlUsers,
  timeWaitAlert,
} from "../../GlobalVariables";

// Componente para editar la contraseña de un usuario
const UserPasswordEdit = ({ user, onClose, onSave, setshowAlerts }) => {
  // Estados para las contraseñas y validaciones
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState(false);
  const [error, setError] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Crea el objeto usuario actualizado con la nueva contraseña
    const updatedUser = { ...user, password };
    // Función para actualizar la contraseña del usuario
    await updateUserPassword(updatedUser);
    onSave();  // Ejecuta cualquier función adicional tras guardar
    onClose(); // Cierra el formulario/modal
  };

  // Función para actualizar información en la base de datos
  const updateToDB = async (serviceUrl, infoToSave) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(infoToSave);

      // Envía una solicitud PUT a la URL del servicio con los datos proporcionados
      const response = await axios.put(serviceUrl, infoToSave, config);

      // Retorna un mensaje de éxito
      const message = (
        <SuccessAlert
          message={response.data.message || "Se ha actualizado correctamente"}
        />
      );
      return message;
      
    } catch (error) {
      // Manejo de errores de la respuesta del servidor o errores generales
      if (error.response && error.response.data && error.response.data.error) {
        // Error específico del servidor
        const errorMessage = error.response.data.error;
        const message = <ErrorAlert message={errorMessage} />;
        return message;
      } else {
        // Error no especificado
        const errorMessage = error.message || "Error desconocido";
        const message = <ErrorAlert message={errorMessage} />;
        return message;
      }
    }
  };

  // Función para actualizar la contraseña del usuario
  const updateUserPassword = async (user) => {
    const response = await updateToDB(urlUsers, user);
    setshowAlerts(response);
    setTimeout(() => {
      setshowAlerts("");
    }, timeWaitAlert);
  };

  // Renderizar el formulario
  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nuevo Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onMouseDown={() => setValidation(true)}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
        {password.length === 0 && validation && (
          <span className="text-danger">Enter the new password</span>
        )}
      </div>
      <div className="form-group">
        <label>Confirmar Contraseña</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onMouseDown={() => setValidation(true)}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-control"
        />
        {confirmPassword.length === 0 && validation && (
          <span className="text-danger">Confirm the new password</span>
        )}
        {error && <span className="text-danger">{error}</span>}
      </div>

      <div className="form-group">
        <button className="btn btn-success m-3" type="submit">
          Actualizar Contraseña
        </button>
        <button className="btn btn-danger m-3" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default UserPasswordEdit;
