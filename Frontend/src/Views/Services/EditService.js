import { useState, useEffect } from "react";
import { updateToBD, urlService, timeWaitAlert } from "../../GlobalVariables";
import React from "react";
import "./EditService.css";
import { deleteByIDToBD } from "../../GlobalVariables";

// Componente que permite editar un servicio
const EditService = ({
  service, // objeto de servicio a editar
  onClose, // función para cerrar el modal o componente de edición
  onSave, // función para actualizar la lista de servicios en la vista principal tras guardar cambios
  setshowErroresForm, // función para mostrar errores durante la edición
  selectServicesBD, // función para recargar los servicios desde la base de datos
}) => {
  // Estado para manejar el nombre del servicio
  const [name, setName] = useState(service.name || "");
  // Estado para almacenar la lista de encargados actuales
  const [encargados] = useState(service.encargados || []);
  // Estado para manejar cambios temporales en la lista de encargados
  const [encargadosTemporales, setEncargadosTemporales] = useState(
    service.encargados || []
  );

  useEffect(() => {
    // Sincroniza los encargados temporales con los encargados actuales cuando cambian
    setEncargadosTemporales(encargados);
  }, [encargados]);

  // Maneja la eliminación de un encargado de la lista temporal
  const handleRemoveEncargado = (encargadoId) => {
    setEncargadosTemporales((prevEncargados) =>
      prevEncargados.filter((encargado) => encargado._id !== encargadoId)
    );
  };

  // Procesa la eliminación del servicio
  const handleDeleteService = async () => {
    try {
      const response = await deleteByIDToBD(urlService, service._id);
      selectServicesBD();
      onClose();
      setshowErroresForm(response);
      setTimeout(() => {
        setshowErroresForm("");
      }, timeWaitAlert);
    } catch (error) {
      window.alert("Error al eliminar el servicio.");
    }
  };

  // Maneja el envío del formulario de edición
  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmacion = window.confirm(
      "¿Está seguro de que desea guardar los cambios?"
    );
    if (confirmacion) {
      const updatedService = {
        ...service,
        name: name,
        encargados: encargadosTemporales.map((encargado) => encargado._id),
      };
      await updateService(updatedService);
      onSave();
      onClose();
    }
  };

  // Actualiza el servicio en la base de datos
  const updateService = async (service) => {
    const parametrosActualizar = {
      name: service.name,
      encargados: service.encargados,
    };
    const response = await updateToBD(
      urlService,
      service._id,
      parametrosActualizar
    );
    selectServicesBD();
    setshowErroresForm(response);
    setTimeout(() => {
      setshowErroresForm("");
    }, timeWaitAlert);
  };

  // Renderiza el formulario de edición
  return (
    <form className="container-edit-service" onSubmit={handleSubmit}>
      <div className="form-group">
        <label style={{ fontWeight: "bold", marginRight: "8px" }}>
          Nombre del servicio:
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control-edit-service"
        />
      </div>
      <br></br>
      <div className="form-group-edit-service">
        <label style={{ marginBottom: "4px", fontWeight: "bold" }}>
          Encargados:
        </label>
        {encargadosTemporales.map((encargado, index) => (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span className="flex-item-edit-service">
              {encargado.firstName} {encargado.lastName}
            </span>
            <button
              type="button"
              className="custom-button-edit-service"
              onClick={() => handleRemoveEncargado(encargado._id)}
            >
              <svg viewBox="0 0 448 512" className="svgIcon-edit-service">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="modal-footer-edit-service">
        <button
          className="btn btn-primary button-margin-edit-service"
          type="submit"
        >
          Guardar cambios
        </button>
        <button
          className="btn btn-danger button-margin-edit-service"
          type="button"
          onClick={handleDeleteService}
        >
          Eliminar Servicio
        </button>
      </div>
    </form>
  );
};

export default EditService;
