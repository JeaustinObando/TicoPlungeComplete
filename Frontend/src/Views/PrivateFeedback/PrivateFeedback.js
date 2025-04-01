import { useEffect, useState } from "react";
import "./PrivateFeedback.css";
import React from "react";
import { NotFound } from "../../GlobalVariables";
import { Link } from "react-router-dom";

import {
  createToBD,
  deleteByIDToBD,
  selectToBD,
  urlPrivateFeedback,
  selectUserByToken,
  ErrorAlert,
  timeWaitAlert,
  redirectFeedback,
} from "../../GlobalVariables";

const PrivateFeedback = () => {
  // -------------------------------------------------------------
  // Se usara para optener los datos de la persona activa
  // -------------------------------------------------------------
  const [usuarioActivo, setUsuarioActivo] = useState("");

  // -------------------------------------------------------------
  // Estas se mostraran en el HTML
  // -------------------------------------------------------------
  const [showComentarios, setshowComentarios] = useState("");
  const [showErroresForm, setshowErroresForm] = useState("");
  const [showAlerts, setshowAlerts] = useState("");

  // -------------------------------------------------------------
  // Seran input
  // -------------------------------------------------------------
  const [inputData, setInputData] = useState({
    comentario: "",
  });

  /**
   * Función asincrónica para obtener y establecer el usuario activo utilizando el token de autenticación.
   */
  const GetUserActive = async () => {
    const user = await selectUserByToken();
    setUsuarioActivo(user);
  };

  /**
   * Efecto secundario que se ejecuta al montar el componente para obtener el usuario activo y seleccionar los comentarios de la base de datos.
   * El segundo argumento vacío asegura que se llame solo una vez al cargar la página.
   */
  useEffect(() => {
    // Llamar a la función para obtener y establecer el usuario activo
    GetUserActive();

    // Llamar a la función para seleccionar los comentarios de la base de datos
    selectComentariosBD();
  }, []);

  /**
   * Función asincrónica para crear un nuevo comentario en la base de datos.
   */
  const createComentariosBD = async () => {
    const newComentario = {
      comentario: inputData.comentario,
      user: usuarioActivo._id,
    };

    // Manda a crear el comentario a la base de datos
    const response = await createToBD(urlPrivateFeedback, newComentario);

    await selectComentariosBD();

    // Deja un mensaje de exito o error al crear
    setshowErroresForm(response);
    setTimeout(() => {
      setshowErroresForm("");
    }, timeWaitAlert);
  };

  /**
   * Función asincrónica para seleccionar comentarios de la base de datos.
   */
  const selectComentariosBD = async () => {
    const response = await selectToBD(urlPrivateFeedback);
    setshowComentarios(response);
  };

  /**
   * Función asincrónica para eliminar un comentario de la base de datos.
   * @param {string} id - El ID del comentario que se va a eliminar.
   */
  const deleteComentariosBD = async (id) => {
    // Eliminar el comentario de la base de datos por su ID
    const response = await deleteByIDToBD(urlPrivateFeedback, id);
    setshowAlerts(response);
    setTimeout(() => {
      setshowAlerts("");
    }, timeWaitAlert);
    // Si la eliminación tiene éxito, seleccionar los comentarios actualizados
    await selectComentariosBD();
  };

  /**
   * Función para manejar la presentación de datos del formulario y llamar a la función para crear un nuevo comentario.
   * @param {Event} event - El evento del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar si se proporcionaron datos para la calificación y el comentario
    if (!inputData.comentario) {
      // Mostrar un mensaje de error si no se proporcionaron los datos requeridos
      setshowErroresForm(<ErrorAlert message="Debe llenar  el comentario" />);
      setTimeout(() => {
        setshowErroresForm("");
      }, timeWaitAlert);
      return;
    }

    // Limpiar el mensaje de error
    setshowErroresForm("");
    // Llamar a la función para crear un nuevo comentario
    createComentariosBD();
  };

  return (
    <div className="PrivateFeedbackStyle">
      <div className={` ${showAlerts ? "" : "d-none"}`}>
        <div className="mostrar-alert">{showAlerts}</div>
      </div>

      <span className={usuarioActivo.role === "Client" ? "" : "d-none"}>
        <div className="PrivateFeedback-rating-card">
          <form onSubmit={handleSubmit}>
            <div className="PrivateFeedback-text-wrapper">
              <h1 className="PrivateFeedback-text-title">
                Deja tu comentario Privado
              </h1>
              <p className="PrivateFeedback-text-subtitle">
                Este sera visible solo para los empleados de Tico Plunche.
              </p>
            </div>

            <div>
              <textarea
                type="text"
                id="inputComentario"
                className="m-4"
                value={inputData.comentario}
                onChange={(e) =>
                  setInputData({ ...inputData, comentario: e.target.value })
                }
                required
              />
            </div>

            <div className={` ${showErroresForm ? "" : "d-none"}`}>
              <div className="d-flex justify-content-center align-items-center">
                {showErroresForm}
              </div>
            </div>

            <div className="input-group mt-3">
              <button className="btn btn-success" type="submit">
                Crear Comentario
              </button>
            </div>
          </form>
          <div className="m-4">
            <Link to={redirectFeedback} className="btn btn-primary m-2">
              Dejar comentario público
            </Link>
          </div>
        </div>
      </span>

      <span
        className={
          usuarioActivo.role === "Administrator" ||
          usuarioActivo.role === "Staff"
            ? ""
            : "d-none"
        }
      >
        <div className="container pt-4 ">
          <div>
            {showComentarios.length > 0 ? (
              showComentarios.map((item) => (
                <div key={item._id} className="feedback-Box m-3">
                  <span className="feedback-notititle">
                    {item.user.firstName}
                    {new Date(item.creationDate).toLocaleDateString()}
                  </span>
                  <br></br>
                  <span className="feedback-notibody">
                    Comentario: {item.comentario}
                  </span>
                  <span
                    className={
                      usuarioActivo.role === "Administrator" ? "" : "d-none"
                    }
                  >
                    <div>
                      <button
                        className="btn btn-danger m-4"
                        onClick={() => deleteComentariosBD(item._id)}
                      >
                        Borrar
                      </button>
                    </div>{" "}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-data">
                <h2>No Hay Comentario</h2>
              </div>
            )}
          </div>
        </div>
      </span>
      <div className={!usuarioActivo.role ? "" : "d-none"}>
        <NotFound mensaje="Por favor, inicia sesión para continuar" />
      </div>
    </div>
  );
};
export default PrivateFeedback;
