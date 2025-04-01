import { useState } from "react";
import {
  createToBD,
  urlUsers,
  timeWaitAlert,
} from "../../GlobalVariables";

// Componente para agregar un nuevo usuario
const UserAdd = ({ onClose, onSave, setshowAlerts }) => {
  // Estados para almacenar los datos del nuevo usuario
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [validation, setValidation] = useState(false);
  const [password, setPassword] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      firstName: name,
      lastName: lastname,
      email,
      role,
      password,
    };
    // Función para agregar el nuevo usuario
    await addUser(newUser);
    onSave();  // Función para manejar acciones post-guardado
    onClose(); // Función para cerrar el formulario
  };

  // Función para agregar el usuario a la base de datos
  const addUser = async (user) => {
    console.log(user); // Log del usuario para propósitos de debug
    const response = await createToBD(urlUsers, user);
    setshowAlerts(response); // Mostrar alertas basadas en la respuesta
    setTimeout(() => {
      setshowAlerts(""); // Limpiar alertas después de un tiempo determinado
    }, timeWaitAlert);
  };

  // Renderizar el formulario
  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre</label>
        <input
          required
          value={name}
          onMouseDown={(e) => setValidation(true)}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
        />
        {name.length === 0 && validation && (
          <span className="text-danger">Ingrese el nombre</span>
        )}
      </div>
      <div className="form-group">
        <label>Apellido</label>
        <input
          required
          value={lastname}
          onMouseDown={(e) => setValidation(true)}
          onChange={(e) => setLastName(e.target.value)}
          className="form-control"
        />
        {lastname.length === 0 && validation && (
          <span className="text-danger">Ingrese el apellido</span>
        )}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
        {email.length === 0 && validation && (
          <span className="text-danger">Ingrese el correo electrónico</span>
        )}
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
        {email.length === 0 && validation && (
          <span className="text-danger">Ingrese el correo electrónico</span>
        )}
      </div>
      <div className="form-group">
        <label>Rol</label>
        <select
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-control"
        >
          <option value="" disabled hidden>
            Selecciona un rol
          </option>
          <option value="Administrator">Administrator</option>
          <option value="Staff">Staff</option>
          <option value="Client">Client</option>
        </select>
        {role.length === 0 && validation && (
          <span className="text-danger">Ingrese el rol</span>
        )}
      </div>

      <div className="form-group">
        <button className="btn btn-success m-2" type="submit">
          Guardar
        </button>
        <button className="btn btn-danger m-2" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default UserAdd;
