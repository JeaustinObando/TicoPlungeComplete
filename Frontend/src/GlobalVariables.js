import React, { useState } from "react";
import axios from "axios";

// -------------------------------------------------------------
// urls del front para redirigir
// -------------------------------------------------------------
export const redirectRegister = `/SignIn`;
export const redirectLogin = `/LogIn`;
export const redirectPrivateFeedback = `/PrivateFeedback `;
export const redirectFeedback = `/Feedback `;

// -------------------------------------------------------------
// urls del backend
// -------------------------------------------------------------

export const baseUrl = "http://localhost:8080";

export const urlFeedback = `${baseUrl}/comentarios`;
export const urlPrivateFeedback = `${baseUrl}/privatefeedback`;
export const urlClass = `${baseUrl}/class`;
export const urlLogin = `${baseUrl}/auth`;
export const urlSingIn = `${baseUrl}/register`;
export const urlUsers = `${baseUrl}/users`;

export const urlReserveClassAsClient = `${baseUrl}/class/reserveAsClient`;
export const urlReserveClassAsAdmin = `${baseUrl}/class/reserveAsAdmin`;
export const urlService = `${baseUrl}/service`;
export const urlGetStaff = `${baseUrl}/service/staff`;
export const urlpurchasehistory = `${baseUrl}/purchase-history`;
export const urlPlan = `${baseUrl}/plan`;
export const urlPlanRequest = `${baseUrl}/planRequest`;
export const urlMetadata = `${baseUrl}/metadata`;

// -------------------------------------------------------------
// constante de cuanto tiempo mostrar los mensajes de error en milisegundos
// -------------------------------------------------------------
export const timeWaitAlert = 10000;

// -------------------------------------------------------------
// funciones globlaes
// -------------------------------------------------------------

/**
 * Realiza una solicitud GET a un servicio web y devuelve los datos obtenidos.
 * @param {string} serviceUrl - La URL del servicio web al que se va a realizar la solicitud.
 * @returns {Promise<Array|String>} - Una promesa que resuelve en un array de datos si la solicitud es exitosa, o una cadena de texto que indica la ausencia de datos si no se encuentran resultados.
 */
export const selectToBD = async (serviceUrl) => {
  let config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    let response = await axios.get(serviceUrl, config);
    // Verifica si response.data es un array, si no lo es, devuelve un array vacío.
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return [];
  }
};

/**
 * Realiza una solicitud GET a un servicio web con un filtro y devuelve los datos obtenidos.
 * @param {string} serviceUrl - La URL del servicio web al que se va a realizar la solicitud.
 * @param {object} searchBy - El filtro a aplicar en la consulta, en formato de objeto JSON.
 * @returns {Promise<Array>} - Una promesa que resuelve en un array de datos obtenidos.
 */
export const selectFilterToBD = async (serviceUrl, searchBy) => {
  try {
    // Realizar la solicitud GET con el filtro como parámetro de consulta
    const response = await selectToBD(
      `${serviceUrl}?filtro=${JSON.stringify(searchBy)}`
    );
    return response; // Retornar los datos obtenidos
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return []; // Devolver un array vacío en caso de error
  }
};

/**
 * Envía una solicitud POST a la URL del servicio especificado para crear un nuevo documento en la base de datos MongoDB.
 * @param {string} serviceUrl - La URL del servicio donde se creará el documento.
 * @param {Object} infoToSave - Los datos que se guardarán como el nuevo documento.
 * @returns {Promise<JSX.Element>} Una promesa que se resuelve con un mensaje de éxito o error después de intentar crear el documento.
 */
export const createToBD = async (serviceUrl, infoToSave) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Send a POST request to the service URL with the provided data
    const response = await axios.post(serviceUrl, infoToSave, config);

    const message = (
      <SuccessAlert
        message={response.data.message || "Se ha creado correctamente"}
      />
    );

    // Show success message
    return message;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      // Si el error proviene del servidor y contiene un mensaje de error
      console.error("Error al insertar documento en MongoDB:", error);
      const errorMessage = error.response.data.error;
      // Aquí puedes usar el mensaje de error para mostrarlo en tu aplicación
      console.error("Mensaje de error:", errorMessage);
      const message = <ErrorAlert message={errorMessage} />;
      return message;
    } else {
      // Para errores no relacionados con el servidor, usa el mensaje de error predeterminado
      const errorMessage = error.message || "Error desconocido";
      console.error("Error desconocido:", errorMessage);
      console.error("Mensaje de error:", errorMessage);
      const message = <ErrorAlert message={errorMessage} />;
      return message;
    }
  }
};

/**
 * Envía una solicitud PUT a la URL del servicio especificado para actualizar un documento en la base de datos MongoDB.
 * @param {string} serviceUrl - La URL del servicio donde se actualizará el documento.
 * @param {string} documentId - El ID del documento que se actualizará.
 * @param {Object} newData - Los nuevos datos que se asignarán al documento.
 * @returns {Promise<JSX.Element>} Una promesa que se resuelve con un mensaje de éxito o error después de intentar actualizar el documento.
 */
export const updateToBD = async (serviceUrl, documentId, newData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Send a PUT request to the service URL with the provided data
    const response = await axios.put(
      `${serviceUrl}/${documentId}`,
      newData,
      config
    );

    const message = (
      <SuccessAlert
        message={response.data.message || "Se ha actualizado correctamente"}
      />
    );

    // Show success message
    return message;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      // Si el error proviene del servidor y contiene un mensaje de error
      console.error("Error al actualizar documento en MongoDB:", error);
      const errorMessage = error.response.data.error;
      // Aquí puedes usar el mensaje de error para mostrarlo en tu aplicación
      console.error("Mensaje de error:", errorMessage);
      const message = <ErrorAlert message={errorMessage} />;
      return message;
    } else {
      // Para errores no relacionados con el servidor, usa el mensaje de error predeterminado
      const errorMessage = error.message || "Error desconocido";
      console.error("Error desconocido:", errorMessage);
      console.error("Mensaje de error:", errorMessage);
      const message = <ErrorAlert message={errorMessage} />;
      return message;
    }
  }
};

/**
 * Borra un comentario de la base de datos haciendo una solicitud DELETE a la URL especificada.
 * @param {string} url - La URL base del servicio donde se encuentra el recurso a borrar.
 * @param {string} id - El ID del comentario que se desea borrar.
 * @returns {Promise<void>} - Una promesa que resuelve sin valor una vez que se haya completado la solicitud de borrado.
 */
export const deleteByIDToBD = async (url, id) => {
  // Se muestra un mensaje de confirmación al usuario antes de proceder con el borrado.
  const confirmacion = window.confirm("¿Está seguro que desea de borrarlo?");

  if (confirmacion) {
    const serviceUrl = `${url}/${id}`;
    try {
      await axios.delete(serviceUrl);
      // Se muestra una alerta indicando que el borrado fue exitoso.
      const message = <SuccessAlert message="Borrado con éxito" />;
      return message;
    } catch (error) {
      // Manejo de errores según el tipo de error generado.
      if (error.response) {
        // Error de respuesta del servidor con un código de error.
        console.error(
          "Error en la respuesta del servidor:",
          error.response.data
        );
        const errorMessage =
          error.response.data.error || "Error: No se pudo borrar.";
        const message = <ErrorAlert message={errorMessage} />;
        return message;
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta.
        console.error("No se recibió respuesta del servidor:", error.request);
        const message = (
          <ErrorAlert message="Error: No se pudo conectar al servidor." />
        );
        return message;
      } else {
        // Error durante la configuración de la solicitud.
        console.error(
          "Error durante la configuración de la solicitud:",
          error.message
        );
        const message = (
          <ErrorAlert message="Error: Ocurrió un problema durante la solicitud." />
        );
        return message;
      }
    }
  } else {
    // Se muestra un mensaje indicando que la acción fue cancelada por el usuario.
    const message = <ErrorAlert message="Acción cancelada." />;
    return message;
  }
};

/**
 * Función para seleccionar un usuario utilizando un token de autenticación.
 * @returns {Array} - Un array de datos del usuario seleccionado.
 */
export const selectUserByToken = async () => {
  // Configuración de los headers para la solicitud HTTP
  let config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    // Obtener el token almacenado en el localStorage
    const token = localStorage.getItem("token");

    // Construir la URL con el token incluido como parámetro
    const urlWithToken = `${urlLogin}?token=${token}`;

    // Realizar una solicitud GET utilizando axios
    let response = await axios.get(urlWithToken, config);

    // Devolver los datos de respuesta
    return response.data;
  } catch (error) {
    // Manejar cualquier error que ocurra durante la solicitud
    console.error("Error al obtener los datos:", error);
    // Devolver un array vacío en caso de error
    return [];
  }
};

/**
 *Renderiza un componente de error cuando no se encuentran resultados.
 *@param {string} mensaje - El mensaje de error que se mostrará.
 *@returns {JSX.Element} - El componente de error NotFound.
 */
export function NotFound({ mensaje }) {
  return (
    <div className="NotFound">
      <div>
        <h1>{mensaje}</h1>
      </div>
      <div className="conteiner-hamster">
        <div
          aria-label="Orange and tan hamster running in a metal wheel"
          role="img"
          className="wheel-and-hamster"
        >
          <div className="wheel"></div>
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear"></div>
                <div className="hamster__eye"></div>
                <div className="hamster__nose"></div>
              </div>
              <div className="hamster__limb hamster__limb--fr"></div>
              <div className="hamster__limb hamster__limb--fl"></div>
              <div className="hamster__limb hamster__limb--br"></div>
              <div className="hamster__limb hamster__limb--bl"></div>
              <div className="hamster__tail"></div>
            </div>
          </div>
          <div className="spoke"></div>
        </div>
      </div>
    </div>
  );
}

export const SuccessAlert = ({ message }) => {
  const [showAlert] = useState(true);

  return (
    showAlert && (
      <div className="success">
        <div className="success__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            viewBox="0 0 24 24"
            height="24"
            fill="none"
          >
            <path
              fillRule="evenodd"
              fill="#393a37"
              d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="success__title">{message}</div>
      </div>
    )
  );
};

export const ErrorAlert = ({ message }) => {
  const [showAlert] = useState(true);

  return (
    showAlert && (
      <div className="error">
        <div className="error__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            viewBox="0 0 24 24"
            height="24"
            fill="none"
          >
            <path
              fill="#393a37"
              d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
            ></path>
          </svg>
        </div>
        <div className="error__title">{message}</div>
      </div>
    )
  );
};
