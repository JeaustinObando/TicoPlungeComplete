import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { selectUserByToken } from "../../GlobalVariables";
import { useEffect, useState } from "react";

function Navbar() {

  // Estado para almacenar el usuario activo
  const [usuarioActivo, setUsuarioActivo] = useState("");

  /**
   * Función asíncrona para obtener el usuario activo.
   */
  const GetUserActive = async () => {
    const user = await selectUserByToken();
    setUsuarioActivo(user);
  };

  /**
   * Hook de efecto para obtener y establecer el usuario activo.
   * Se ejecuta al renderizar el componente.
   * Se ejecuta una sola vez.
   */
  useEffect(() => {
    GetUserActive();
  }, []);

  /**
   * Función para cerrar sesión.
   * Se ejecuta al hacer clic en el botón de cerrar sesión.
   */
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "¿Estás seguro de que deseas cerrar sesion?"
    );
    if (confirmLogout) {
      localStorage.setItem("token", "");
      window.location = "/";
    }
  };

  // Renderizado del componente
  return (
    <div>
      <div className="containe-navbar">
        <div className={usuarioActivo.role ? "" : "d-none"}>
          <Link to="/Profile" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-user"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Ver Perfil
          </Link>
        </div>

        <div className={!usuarioActivo.role ? "" : "d-none"}>
          <Link to="/LogIn" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-user"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Iniciar Sesión
          </Link>
        </div>

        <div>
          <Link to="/" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-home"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </Link>
        </div>

        <div>
          <Link to="/Feedback" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-message-circle"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Comentarios
          </Link>
        </div>

        <div
          className={
            usuarioActivo.role === "Administrator" ||
            usuarioActivo.role === "Staff"
              ? ""
              : "d-none"
          }
        >
          <Link to="/PrivateFeedback" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-message-circle"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Comentarios Privados
          </Link>
        </div>

        <div
          className={
            usuarioActivo.role === "Administrator" ||
            usuarioActivo.role === "Staff"
              ? ""
              : "d-none"
          }
        >
          <Link to="/CreateClass" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-clipboard"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            Crear Clase
          </Link>
        </div>

        <div className={usuarioActivo.role ? "" : "d-none"}>
          <Link to="/AppointmentForm" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-calendar"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Reservar
          </Link>
        </div>

        <div
          className={
            usuarioActivo.role === "Administrator" ||
            usuarioActivo.role === "Staff"
              ? ""
              : "d-none"
          }
        >
          <Link to="/CreateService" className="link-navbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-codepen"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
              <line x1="12" y1="22" x2="12" y2="15.5"></line>
              <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
              <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
              <line x1="12" y1="2" x2="12" y2="8.5"></line>
            </svg>
            Servicios
          </Link>
        </div>

        <div className={usuarioActivo.role === "Administrator" ? "" : "d-none"}>
          <Link to="/PurchaseHistory" className="link-navbar">
            <svg
              xmlns="https://www3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-shopping-cart"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a1 1 0 0 0 1 .61h9.72a1 1 0 0 0 1-.78l3.26-12.17a1 1 0 0 0-.94-1.22H6"></path>
            </svg>
            Historial de Compras
          </Link>
        </div>

        <div className={usuarioActivo.role === "Administrator" ? "" : "d-none"}>
          <Link to="/CreatePlan" className="link-navbar">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-check-square"
            >
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Planes
          </Link>
        </div>

        <div className={usuarioActivo.role === "Client" ? "" : "d-none"}>
          <Link to="/HirePlan" className="link-navbar">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-edit"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Contratar
          </Link>
        </div>

        <div className={usuarioActivo.role === "Administrator" ? "" : "d-none"}>
          <Link to="/Requests" className="link-navbar">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-edit"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Solicitudes
          </Link>
        </div>

        <div className={usuarioActivo.role === "Administrator" ? "" : "d-none"}>
          <Link to="/Users" className="link-navbar">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-calendar"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Lista de Usuarios
          </Link>
        </div>

        <div className={usuarioActivo.role ? "" : "d-none"}>
          <Link className="link-navbar" onClick={handleLogout}>
            <svg
              xmlns="https://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Salir
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
