import { useEffect, useState } from "react";
import "./Appointment.css";
import { Modal } from "react-bootstrap";
import AppointmentEdit from "./AppointmentEdit";
import moment from "moment-timezone";

import {
  createToBD,
  selectFilterToBD,
  urlReserveClassAsClient,
  urlReserveClassAsAdmin,
  deleteByIDToBD,
  selectUserByToken,
  urlClass,
  selectToBD,
  NotFound,
  urlService,
  ErrorAlert,
  timeWaitAlert,
} from "../../GlobalVariables";

const Appointment = () => {

  // Estado para almacenar el usuario activo 
  const [usuarioActivo, setUsuarioActivo] = useState("");

  // Estado para almacenar los servicios existentes
  const [existingServices, setExistingServices] = useState([]);

  // Estado para almacenar los datos de entrada del formulario de búsqueda
  const [inputData, setInputData] = useState({
    searchDate: "",
    searchClass: "",
  });

  // Estados para mostrar mensajes y clases
  const [showClasses, setshowClasses] = useState("");
  const [showErrorSearch, setshowErrorSearch] = useState("");
  const [showAlerts, setshowAlerts] = useState("");

  /**
   * Función asincrónica para obtener y establecer el usuario activo utilizando el token de autenticación.
   */
  const GetUserActive = async () => {
    const user = await selectUserByToken();
    setUsuarioActivo(user);
  };

  /**
   * Efecto secundario que se ejecuta al montar el componente (cargar la pagina)
   * El segundo argumento vacío asegura que se llame solo una vez al cargar la página.
   */
  useEffect(() => {
    // Llamar a la función para obtener y establecer el usuario activo
    GetUserActive();
    selectClassBD();
    fetchExistingServices();
  }, []);

  /**
   * Reserva una clase como cliente o administrador.
   * @param {string} idClass - El ID de la clase que se va a reservar.
   */
  const reserve = async (idClass) => {
    const confirmacion = window.confirm("¿Está seguro que desea reservar?");

    // Si el usuario cancela la acción, no se realiza la reserva
    if (!confirmacion) {
      setshowAlerts(<ErrorAlert message={"Acción Cancelada"} />);
      setTimeout(() => {
        setshowAlerts("");
      }, timeWaitAlert);
      return;
    }

    // Obtener el ID del usuario activo y el ID de la clase a reservar
    const userId = usuarioActivo._id;
    const classId = idClass;

    // Selecciona el URL apropiado dependiendo del rol del usuario
    let urlreserve;
    if (usuarioActivo.role === "Client") {
      urlreserve = urlReserveClassAsClient;
    } else if (
      usuarioActivo.role === "Administrator" ||
      usuarioActivo.role === "Staff"
    ) {
      urlreserve = urlReserveClassAsAdmin;
    } else {
      // Manejar el caso en que el rol no es reconocido
      setshowAlerts(<ErrorAlert message={"Rol no reconocido"} />);
      setTimeout(() => {
        setshowAlerts("");
      }, timeWaitAlert);
      return;
    }

    // Crear la reserva en la base de datos
    const response = await createToBD(urlreserve, {
      userId,
      classId,
    });

    // Mostrar el mensaje de confirmación o error
    await selectClassBD();

    // Mostrar el mensaje de confirmación o error
    setshowAlerts(response);
    setTimeout(() => {
      setshowAlerts("");
    }, timeWaitAlert);
  };

  /**
   * Función para seleccionar clases de la base de datos con fecha mayor a la actual.
   * Se utiliza para obtener las clases disponibles para reserva.
   */
  const selectClassBD = async () => {
    // Fecha y hora actual en zona horaria de Costa Rica
    const fechaActual = moment().tz("America/Costa_Rica").toDate(); // Obtener la fecha actual en la zona horaria de Costa Rica
    let filtro = {
      date: { $gt: fechaActual }, // Filtra las clases con fecha mayor a la fecha actual
    };

    const response = await selectFilterToBD(urlClass, filtro);
    setshowClasses(response);
  };

  /**
   * Función para buscar registros en la base de datos utilizando un filtro flexible.
   * Se busca por coincidencias parciales en los campos 'usuario', 'hour', 'service' y 'capacity',
   * y se filtran las clases con fecha mayor a la actual.
   */
  const searchByAnyBD = async () => {
    const fechaActual = moment().tz("America/Costa_Rica").toDate(); // Obtener la fecha actual en la zona horaria de Costa Rica

    let filtro = {
      $and: [{ date: { $gt: fechaActual } }],
    };

    // Verificar si se ha seleccionado una fecha específica de búsqueda
    if (inputData.searchDate) {
      const fechaInicio = moment
        .tz(inputData.searchDate, "YYYY-MM-DD", "America/Costa_Rica")
        .startOf("day")
        .toDate(); // Fecha de inicio del día seleccionado
      const fechaFin = moment
        .tz(inputData.searchDate, "YYYY-MM-DD", "America/Costa_Rica")
        .endOf("day")
        .toDate(); // Fecha de fin del día seleccionado

      filtro.$and.push({
        date: {
          $gte: fechaInicio,
          $lte: fechaFin,
        },
      });
    }
    // Verificar si se ha proporcionado un servicio específico para búsqueda
    if (inputData.searchClass) {
      filtro.$and.push({
        service: inputData.searchClass,
      });
    }

    const response = await selectFilterToBD(urlClass, filtro);
    setshowClasses(response);
  };

  /**
   * Función asincrónica para eliminar una clase de la base de datos.
   * @param {string} id - El ID de la clase que se va a eliminar.
   */
  const deleteClassBD = async (id) => {
    // Eliminar el comentario de la base de datos por su ID
    const response = await deleteByIDToBD(urlClass, id);
    setshowAlerts(response);
    setTimeout(() => {
      setshowAlerts("");
    }, timeWaitAlert);
    // Si la eliminación tiene éxito, seleccionar los comentarios actualizados
    await selectClassBD();
  };

  /**
   * Función para manejar el evento de envío del formulario de búsqueda.
   * Realiza la búsqueda en la base de datos según los criterios especificados en los campos de búsqueda.
   * Muestra un mensaje de error si no se proporciona ningún criterio de búsqueda.
   * @param {Event} event - Objeto de evento que representa el envío del formulario.
   */
  const handleSubmitSearch = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe vacio
    if (!inputData.searchClass && !inputData.searchDate) {
      selectClassBD();
      return;
    }

    setshowErrorSearch("");

    await searchByAnyBD();
  };

  // Estados para manejar la edición de un Appointment
  const [appointmentActual, setAppointmentActual] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mostrarEditAppointment, setMostrarEditAppointment] = useState(false);

  /**
   * Función para manejar el cierre del modal de edición de Appointment.
   * Limpia los estados relacionados con la edición y oculta el modal.
   */
  const handleModalClose = () => {
    setMostrarEditAppointment(false);
    setAppointmentActual(false);
    setShowModal(false);
  };

  /**
   * Función para manejar el clic en el botón de editar un Appointment.
   * Establece el estado para mostrar el modal de edición y guarda el Appointment actual a editar.
   * @param {Object} item - El Appointment a editar.
   */
  const OnClickEdit = async (item) => {
    setMostrarEditAppointment(true);
    setAppointmentActual(item);
    setShowModal(true);
  };

  /**
   * Función asincrónica para obtener los servicios existentes en la base de datos.
   */
  const fetchExistingServices = async () => {
    try {
      const ServicesData = await selectToBD(urlService);
      if (ServicesData.length > 0) {
        setExistingServices(
          ServicesData.map((service) => ({
            ...service,
            encargados: service.encargados,
          }))
        );
      } else {
        setExistingServices([]);
      }
    } catch (error) {
      console.error("Error al obtener servicios existentes:", error);
    }
  };

  // Renderizar la vista de Appointment
  return (
    <div>
      {/* mostrar solo a los registrados*/}
      <span className={usuarioActivo.role ? "" : "d-none"}>
        <div className="AppointmentStyle">
          <h1>Reserva tu clase </h1>
          <div className={`m-4 ${showAlerts ? "" : "d-none"}`}>
            <div className="mostrar-alert">{showAlerts}</div>
          </div>

          <div className="container mt-5">
            <div className="search">
              <form className="form-inline" onSubmit={handleSubmitSearch}>
                <div className="CreateClass-input-group">
                  <select
                    id="inputActivityreserve"
                    className="m-2"
                    value={inputData.searchClass}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        searchClass: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccione un servicio</option>
                    {existingServices.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <input
                    type="date"
                    id="inputDate"
                    value={inputData.searchDate}
                    onChange={(e) =>
                      setInputData({ ...inputData, searchDate: e.target.value })
                    }
                    min={moment().tz("America/Costa_Rica").format("YYYY-MM-DD")}
                  />
                </div>

                <div className={`m-4 ${showErrorSearch ? "" : "d-none"}`}>
                  <div className="d-flex justify-content-center align-items-center">
                    {showErrorSearch}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary m-2">
                  Buscar
                </button>
              </form>

              <button onClick={selectClassBD} className="btn btn-primary mb-4">
                Ver Todas
              </button>
            </div>
            <div className="Appointment-card-container">
              {showClasses.length > 0 ? (
                showClasses.map((item, index) => (
                  <div key={index} className="Appointment-card">
                    <p className="stylePActivity">
                      Actividad: {item.service.name}
                    </p>

                    <p>Fecha: {moment(item.date).format("DD/MM/YYYY")}</p>

                    {console.log("user", item.user)}
                    <p>Profesor: {item.user && item.user.firstName} {item.user && item.user.lastName}</p>

                    <p>
                      Hora:{" "}
                      {moment(item.date)
                        .tz("America/Costa_Rica")
                        .format("HH:mm")}
                    </p>

                    <p>Cupos disponibles: {item.capacity}</p>

                    <button
                      className="btn btn-primary m-2"
                      onClick={() => reserve(item._id)}
                    >
                      INSCRIBIRSE
                    </button>

                    <span
                      className={
                        usuarioActivo.role === "Administrator" ||
                        (usuarioActivo.role === "Staff" &&
                          usuarioActivo._id === item.user._id)
                          ? ""
                          : "d-none"
                      }
                    >
                      <button
                        className="btn btn-success m-2"
                        onClick={() => OnClickEdit(item)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => deleteClassBD(item._id)}
                      >
                        Borrar
                      </button>
                    </span>
                  </div>
                ))
              ) : (
                <div className="Appointment-no-data">
                  <h2>Aun no hay clases</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </span>
      <div className={!usuarioActivo.role ? "" : "d-none"}>
        <NotFound mensaje="Por favor, inicia sesión para continuar" />
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Clase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mostrarEditAppointment && (
            <AppointmentEdit
              Appointment={appointmentActual}
              onClose={handleModalClose}
              onSave={OnClickEdit}
              setshowAlerts={setshowAlerts}
              selectClassBD={selectClassBD}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default Appointment;
