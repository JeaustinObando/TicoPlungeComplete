// Import React and other necessary libraries
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  urlLogin,
  redirectRegister,
  ErrorAlert,
} from "../../GlobalVariables";
import "./Register.css";

// Componente para iniciar sesión
const Login = () => {
  // Estado para almacenar los datos de entrada del usuario (email y contraseña)
  const [data, setData] = useState({ email: "", password: "" });
  // Estado para almacenar y mostrar mensajes de error
  const [error, setError] = useState("");

  // Manejar los cambios en los campos de entrada y actualizar el estado correspondientemente
  const handleChange = ({ target: { name, value } }) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Manejar el envío del formulario para el inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(urlLogin, data);
      localStorage.setItem("token", res.data); // Guardar el token de inicio de sesión en localStorage
      window.location = "/"; // Redirigir al usuario a la página principal después del inicio de sesión exitoso
    } catch (error) {
      // Verificar si el error es un error de respuesta y mostrarlo
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
          <h1>¿No tienes cuenta?</h1>
          <Link to={redirectRegister}>
            <button type="button" className="register-white_btn">
              Registrarse
            </button>
          </Link>
        </div>

        <div className="register-right">
          <form className="register-form_container" onSubmit={handleSubmit}>
            <h1>Inicia sesión en tu cuenta</h1>
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
              className="register-input"
            />
            {error && <div className="errorMsg">{error}</div>}
            <button type="submit" className="register-form_btn">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
