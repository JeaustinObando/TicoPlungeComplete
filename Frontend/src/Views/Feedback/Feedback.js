import { useEffect, useState } from "react";
import "./Feedback.css";
import FeedbackEdit from "./FeedbackEdit";
import { Modal } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";

import {
  createToBD,
  deleteByIDToBD,
  selectToBD,
  urlFeedback,
  selectUserByToken,
  ErrorAlert,
  timeWaitAlert,
  redirectPrivateFeedback,
} from "../../GlobalVariables";

const Feedback = () => {
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
    rating: "",
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
      rating: inputData.rating,
    };

    // Manda a crear el comentario a la base de datos
    const response = await createToBD(urlFeedback, newComentario);

    await selectComentariosBD();

    // Deja un mensaje de exito o error al crear
    setshowErroresForm(response);
    setTimeout(() => {
      setshowErroresForm("");
    }, timeWaitAlert);
  };

  /**
   * Función asincrónica para cambiar los numeros por estrellas para mostrar
   */
  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span className="feedback-star" key={i}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span className="feedback-star" key={i}>
            ☆
          </span>
        );
      }
    }

    return stars;
  };

  /**
   * Función asincrónica para seleccionar comentarios de la base de datos.
   */
  const selectComentariosBD = async () => {
    const response = await selectToBD(urlFeedback);
    setshowComentarios(response);
  };

  /**
   * Función asincrónica para eliminar un comentario de la base de datos.
   * @param {string} id - El ID del comentario que se va a eliminar.
   */
  const deleteComentariosBD = async (id) => {
    // Eliminar el comentario de la base de datos por su ID
    const response = await deleteByIDToBD(urlFeedback, id);
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
    if (!inputData.rating || !inputData.comentario) {
      // Mostrar un mensaje de error si no se proporcionaron los datos requeridos
      setshowErroresForm(
        <ErrorAlert message="Debe llenar las estrellas y el comentario" />
      );
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

  // -------------------------------------------------------------
  // parametros para el edit
  // -------------------------------------------------------------

  const [comentarioActual, setComentarioActual] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /**
   * Función para manejar el cierre del modal de edición de comentarios.
   * Limpia los estados relacionados con la edición y oculta el modal.
   */
  const handleModalClose = () => {
    setComentarioActual(false); // Limpia el comentario actual
    setShowModal(false); // Oculta el modal
  };

  /**
   * Función para manejar el clic en el botón de editar un comentario.
   * Establece el estado para mostrar el modal de edición y guarda el comentario actual a editar.
   * @param {Object} item - El comentario a editar.
   */
  const OnClickEdit = async (item) => {
    setComentarioActual(item); // Guarda el comentario actual en el estado
    setShowModal(true); // Muestra el modal
  };

  // Renderización de la vista de comentarios
  return (
    <div className="FeedbackStyle">
      {/* para mostrar mensajes de alerta*/}
      <div className={` ${showAlerts ? "" : "d-none"}`}>
        <div className="mostrar-alert">{showAlerts}</div>
      </div>

      {/* mostrar form de feedback solo a los de User y Staff*/}
      <span
        className={
          usuarioActivo.role === "Client" || usuarioActivo.role === "Staff"
            ? ""
            : "d-none"
        }
      >
        <div className="feedback-rating-card">
          <form onSubmit={handleSubmit}>
            <div className="feedback-text-wrapper">
              <h1 className="feedback-text-title">Deja tu comentario</h1>
              <p className="feedback-text-subtitle">
                Nos gustaría saber tu opinión
              </p>
            </div>

            <div className="feedback-rating-stars-container">
              {[...Array(5)].map((_, i) => {
                const value = 5 - i; // Ajuste del valor para corregir el orden
                return (
                  <React.Fragment key={"stars" + i}>
                    <input
                      value={value} // El valor del input, que va de 1 a 5
                      name="rate"
                      id={`star${value}`}
                      type="radio"
                      onChange={() =>
                        setInputData({ ...inputData, rating: `${value}` })
                      }
                    />
                    <label
                      htmlFor={`star${value}`}
                      className="feedback-star-label"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                          pathLength="360"
                        ></path>
                      </svg>
                    </label>
                  </React.Fragment>
                );
              })}
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

            {/* por si hay un error en el form se muestre*/}
            <div className={` ${showErroresForm ? "" : "d-none"}`}>
              <div className="d-flex justify-content-center align-items-center">
                {showErroresForm}
              </div>
            </div>

            <div className="input-group mt-3">
              <button className="btn btn-primary" type="submit">
                Crear Comentario
              </button>
            </div>
          </form>
          <div className="m-4">
            <Link to={redirectPrivateFeedback} className="btn btn-warning m-2">
              Dejar comentario privado
            </Link>
          </div>
        </div>
      </span>

      <div className="container mt-4 ">
        <div>
          {showComentarios.length > 0 ? (
            showComentarios.map((item) => (
              <div key={item._id} className="feedback-Box m-4">
                <span className="feedback-notititle">
                  {item.user.firstName}
                  <span className="m-3">
                    {new Date(item.creationDate).toLocaleDateString()}
                  </span>
                  <br></br>
                </span>
                <span>{renderStars(parseInt(item.rating))}</span>
                <br></br>
                <span className="feedback-notibody">
                  Comentario: {item.comentario}
                </span>

                {/* si fue el que lo creo o es admin se muestre el boton de borrar y editar */}
                <span
                  className={
                    item.user._id === usuarioActivo._id ||
                    "Administrator" === usuarioActivo.role
                      ? ""
                      : "d-none"
                  }
                >
                  <div>
                    {/* editar solo si fue el que lo creo */}

                    <span
                      className={
                        item.user._id === usuarioActivo._id ? "" : "d-none"
                      }
                    >
                      <button
                        onClick={() => OnClickEdit(item)}
                        className="btn btn-primary m-4"
                      >
                        Editar
                      </button>
                    </span>

                    <button
                      className="btn btn-danger m-4"
                      onClick={() => deleteComentariosBD(item._id)}
                    >
                      Borrar
                    </button>
                  </div>
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

      {/* Ventana para editar  */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FeedbackEdit
            feedback={comentarioActual}
            onClose={handleModalClose}
            onSave={OnClickEdit}
            setshowAlerts={setshowAlerts}
            selectComentariosBD={selectComentariosBD}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Feedback;
