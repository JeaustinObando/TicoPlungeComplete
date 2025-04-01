import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import "./CreateService.css";
import EditService from "./EditService";
import {
  ErrorAlert,
  timeWaitAlert,
  urlService,
  urlGetStaff,
  deleteByIDToBD,
  createToBD,
  selectToBD,
  selectUserByToken,
  NotFound,
} from "../../GlobalVariables";

const CreateService = () => {
  // Estados para controlar la visualización de mensajes de error y datos de formulario
  const [showErroresForm, setshowErroresForm] = useState("");
  const [inputData, setInputData] = useState({
    name: "",
    encargados: [],
    otroServicio: "",
    selectedStaff: null, // Indica que aún no se ha seleccionado ningún encargado
  });
  const [existingServices, setExistingServices] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [otherServiceSelected, setOtherServiceSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [usuarioActivo, setUsuarioActivo] = useState("");

  // Función para obtener el usuario activo a partir del token de sesión
  const GetUserActive = async () => {
    const user = await selectUserByToken();
    setUsuarioActivo(user);
  };

  // Función para cargar los servicios existentes desde la base de datos
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

  // Función para obtener los usuarios con rol de staff
  const fetchStaffUsers = async () => {
    try {
      const { data } = await axios(urlGetStaff);
      setStaffUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios con rol de staff:", error);
    }
  };

  // Efecto para cargar los datos necesarios al montar el componente
  useEffect(() => {
    GetUserActive().then(() => {
      if (usuarioActivo.role === "Staff") {
        setInputData((prevState) => ({
          ...prevState,
          selectedStaff: usuarioActivo,
        }));
      }
    });
    fetchExistingServices();
    fetchStaffUsers();
  }, []);

  // Manejo del clic en la tarjeta de servicio, para administradores
  const handleCardClick = (service) => {
    if (usuarioActivo.role === "Administrator") {
      setCurrentService(service);
      setShowModal(true);
    }
  };

  // Controla cambios en los selectores de servicio
  const handleSelectChange = (e) => {
    const selectedService = e.target.value;
    if (selectedService === "Otro") {
      setOtherServiceSelected(true);
      setInputData({
        ...inputData,
        name: "Otro",
      });
    } else {
      setOtherServiceSelected(false);
      setInputData({
        ...inputData,
        name: selectedService,
      });
    }
  };

  // Controla cambios en los selectores de encargados
  const handleStaffSelectChange = (e) => {
    if (usuarioActivo.role === "Administrator") {
      const selectedStaffId = e.target.value;
      const selectedStaff = staffUsers.find(
        (user) => user._id === selectedStaffId
      );
      setInputData({
        ...inputData,
        selectedStaff: selectedStaff,
      });
    }
  };

  // Cierra el modal de edición
  const handleModalClose = () => {
    setCurrentService(null);
    setShowModal(false);
  };

  // Actualiza los campos del formulario
  const handleChange = (e, field) => {
    setInputData({
      ...inputData,
      [field]: e.target.value,
    });
  };

  // Manejo del envío del formulario para crear o actualizar un servicio
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputData.name || inputData.name.trim() === "") {
      setshowErroresForm(
        <ErrorAlert message="Debe llenar el nombre del servicio." />
      );
      return;
    }

    const confirmacion = window.confirm(
      "¿Está seguro de iniciar la creación del servicio?"
    );

    if (confirmacion) {
      createServiceBD();
      setInputData({
        name: "",
        encargados: [],
        otroServicio: "",
        selectedStaff: null,
      });
      setOtherServiceSelected(false);
    } else {
      setshowErroresForm(<ErrorAlert message="Acción cancelada." />);
    }
  };

  // Función para crear un servicio en la base de datos
  const createServiceBD = async () => {
    try {
      let serviceName = inputData.name;
      if (otherServiceSelected) {
        serviceName = inputData.otroServicio;
      }
      const newService = {
        name: serviceName,
        encargados: inputData.selectedStaff ? [inputData.selectedStaff._id] : [],
      };

      const response = await createToBD(urlService, newService);
      fetchExistingServices();
      setshowErroresForm(response);
      setTimeout(() => {
        setshowErroresForm("");
      }, timeWaitAlert);
      if (response.type === "success") {
        window.alert("¡Servicio creado exitosamente!");
      }
    } catch (error) {
      console.error("Error al crear el servicio:", error);
    }
  };

  // Renderiza la interfaz del usuario según su rol
  if (
    usuarioActivo.role !== "Administrator" &&
    usuarioActivo.role !== "Staff"
  ) {
    return <NotFound mensaje="Lo sentimos, no tienes acceso a esta página" />;
  }

  return (
    <div className="createServiceStyle-service">
      <div className="form-container-service">
        <h2 className="title-service">Crear Servicio</h2>
        <div className="social-message-service">
          <div className="line-service"></div>
          <div className="message-service">
            Crear servicio o añadir encargado
          </div>
          <div className="line-service"></div>
          <br />
        </div>
        <form onSubmit={handleSubmit} className="form-createService-service">
          <div className="input-group-createService-service">
            <label htmlFor="inputName">Nombre:</label>
            {!existingServices.length &&
            usuarioActivo.role === "Administrator" ? (
              <input
                type="text"
                id="inputName"
                value={inputData.name}
                onChange={(e) => handleChange(e, "name")}
                className="input"
                required
              />
            ) : (
              <div>
                <select
                  id="inputName"
                  value={inputData.name}
                  onChange={handleSelectChange}
                  className="select-createService-service"
                  required
                >
                  <option value="">Seleccione un servicio</option>
                  {existingServices.map((service) => (
                    <option key={service._id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                  {/* mostrar solo al admin la opcion de crear mas service*/}
                  {usuarioActivo.role === "Administrator" ? (
                    <option value="Otro">Otro</option>
                  ) : null}
                </select>
              </div>
            )}
          </div>
          {otherServiceSelected && (
            <div className="input-group-createService-service">
              <label htmlFor="inputOtroServicio">
                Nombre del nuevo servicio:
              </label>
              <input
                type="text"
                id="inputOtroServicio"
                value={inputData.otroServicio}
                onChange={(e) => handleChange(e, "otroServicio")}
                className="input"
                required
              />
            </div>
          )}
          <div className="input-group-createService-service">
            <label htmlFor="inputEncargado">Encargado:</label>
            <select
              id="inputEncargado"
              value={inputData.selectedStaff ? inputData.selectedStaff._id : ""}
              onChange={handleStaffSelectChange}
              className="select-createService-service"
              required
              disabled={usuarioActivo.role === "Staff"}
            >
              {usuarioActivo.role === "Staff" ? (
                <option value={usuarioActivo._id}>
                  {usuarioActivo.firstName} {usuarioActivo.lastName}
                </option>
              ) : (
                <>
                  <option value="">Seleccione un encargado</option>
                  {staffUsers.length > 0 ? (
                    staffUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))
                  ) : (
                    <option value="">No hay encargados disponibles</option>
                  )}
                </>
              )}
            </select>
          </div>

          <div className={`m-3 ${showErroresForm ? "" : "d-none"}`}>
            {showErroresForm}
          </div>
          <button type="submit" className="buttomCreate-service mt-4">
            Crear Servicio
          </button>
        </form>
      </div>

      <div className="social-message-service">
        <div className="line-service"></div>
        <div className="message-service">Servicios existentes</div>
        <div className="line-service"></div>
      </div>
      <br />

      <div className="card-container-service">
        {existingServices.length > 0 ? (
          existingServices.map((item, index) => (
            <div
              className="card-service"
              key={item._id}
              onClick={() => handleCardClick(item)}
            >
              <span className="card-title-service" id={index}>
                {item.name}
              </span>
              <div className="card-divider-service"></div>
              <span className="card-subtitle-service">Encargados:</span>
              <span className="card-list-service">
                {" "}
                {item.encargados.map((encargado, index) => (
                  <li key={index} className="custom-li-service">
                    {encargado.firstName} {encargado.lastName}
                  </li>
                ))}
              </span>
            </div>
          ))
        ) : (
          <div className="no-data">
            <h2>No hay servicios creados</h2>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentService && (
            <EditService
              service={currentService}
              fetchExistingServices={fetchExistingServices}
              onClose={handleModalClose}
              deleteByIDToBD={deleteByIDToBD}
              onSave={fetchExistingServices}
              setshowErroresForm={setshowErroresForm}
              selectServicesBD={fetchExistingServices}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateService;
