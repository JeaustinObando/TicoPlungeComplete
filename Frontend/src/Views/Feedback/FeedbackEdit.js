import { useState } from "react";
import { updateToBD, urlFeedback, timeWaitAlert } from "../../GlobalVariables";
import React from "react";

// Componente para editar un comentario existente
const FeedbackEdit = ({
  feedback, // Objeto feedback actual a editar
  onClose, // Función para cerrar el modal de edición
  onSave, // Función que se llama al guardar los cambios con éxito
  setshowAlerts, // Función para mostrar alertas
  selectComentariosBD, // Función para actualizar la lista de comentarios
}) => {
  // Estados locales para manejar los valores del comentario y la calificación
  const [comentario, setComentario] = useState(feedback.comentario || "");
  const [rating, setRating] = useState(feedback.rating || 5);

  /**
   * Actualiza un comentario en la base de datos.
   * @param {Object} comentario - El objeto comentario con los valores actualizados.
   */
  const updateComentario = async (comentario) => {
    // Parametros mínimos según el modelo del backend para actualizar un comentario.
    const parametrosActualizar = {
      comentario: comentario.comentario,
      rating: comentario.rating,
      user: comentario.user._id,
    };

    // Llamada a la API para actualizar el comentario.
    const response = await updateToBD(urlFeedback, comentario._id, parametrosActualizar);

    // Actualiza la lista de comentarios tras la actualización.
    selectComentariosBD();

    // Muestra la respuesta y luego limpia la alerta después de un tiempo definido.
    setshowAlerts(response);
    setTimeout(() => {
      setshowAlerts("");
    }, timeWaitAlert);
  };

  /**
   * Maneja el envío del formulario para actualizar el comentario.
   * @param {Event} e - Evento del formulario que evita el envío por defecto.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFeedback = { ...feedback, comentario: comentario, rating: rating };

    // Actualiza el comentario con los valores nuevos.
    await updateComentario(updatedFeedback);

    // Llama a la función onSave al completar la actualización.
    onSave();

    // Cierra el modal de edición.
    onClose();
  };

  // Renderización del formulario de edición.
  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="feedback-rating-stars-container">
        {[...Array(5)].map((_, i) => {
          const value = 5 - i; // Ajuste del valor para corregir el orden
          return (
            <React.Fragment key={"stars" + i}>
              <input
                value={value} // El valor del input, que va de 1 a 5
                name="rate"
                id={`stars${value}`}
                type="radio"
                onChange={(e) => setRating(e.target.value)}
                className="feedback-star-input"
              />
              <label htmlFor={`stars${value}`} className="feedback-star-label">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

      <div className="form-group">
        <label>comentario</label>
        <input
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
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

export default FeedbackEdit;
