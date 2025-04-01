import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  urlSingIn,
  redirectLogin,
  SuccessAlert,
  ErrorAlert,
} from "../../GlobalVariables";
import "./Register.css";

// Componente para registrar un nuevo usuario
const SignIn = () => {
  // Estado para almacenar los datos del formulario de registro
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Client", // Rol por defecto para nuevos usuarios
  });
  // Estado para almacenar y mostrar mensajes de error o éxito
  const [error, setError] = useState("");
  // Hook para navegar programáticamente después de acciones como el registro
  useNavigate();

  // Manejar cambios en los campos de entrada del formulario y actualizar el estado
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Manejar el envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(urlSingIn, data);
      // Mostrar mensaje de éxito y potencialmente redirigir al usuario
      setError(<SuccessAlert message={res.message} />);
      // Aquí podrías incluir navigate('/') para redirigir al inicio o a otra ruta
    } catch (error) {
      // Verificar si el error es un error de respuesta del servidor y mostrarlo
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(<ErrorAlert message={error.response.data.message} />);
      }
    }
  };

  // Renderizar el componente
  return (
    <div className="register_container">
      <div className="register_form_container">
        <div className="register-left">
          <h1>¿Ya tienes cuenta?</h1>
          <Link to={redirectLogin}>
            <button type="button" className="register-white_btn">
              Iniciar sesión
            </button>
          </Link>
        </div>

        <div className="register-right">
          <form className="register-form_container" onSubmit={handleSubmit}>
            <h1>Crear Cuenta</h1>
            <input
              type="text"
              placeholder="Nombre"
              name="firstName"
              onChange={handleChange}
              value={data.firstName}
              required
              className="register-input"
            />
            <input
              type="text"
              placeholder="Apellido"
              name="lastName"
              onChange={handleChange}
              value={data.lastName}
              required
              className="register-input"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="register-input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="register-input mb-3"
            />

            {error && <div>{error}</div>}
            <button type="submit" className="register-form_btn">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
