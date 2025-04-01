import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import UserEdit from "./UserEdit";
import UserAdd from "./UserAdd";
import UserEditPassword from "./UserEditPassword";
import "./Users.css";

import {
  selectToBD,
  deleteByIDToBD,
  urlUsers,
} from "../../GlobalVariables";

const Users = () => {
  // Estados para gestionar la lista de usuarios, modales y términos de búsqueda
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlerts, setshowAlerts] = useState("");

  // Efecto para cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener los usuarios de la base de datos
  const fetchUsers = async () => {
    const response = await selectToBD(urlUsers);
    setUsers(response);
  };

  // Función para cargar el usuario a editar en el modal
  const LoadEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  // Función para cerrar el modal de edición
  const handleEditModalClose = () => {
    setEditUser(null);
    setShowEditModal(false);
  };

  // Función para cerrar el modal de agregar
  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  // Función para cargar el modal de edición de contraseña
  const RestorePassword = (user) => {
    setEditUser(user);
    setShowPasswordModal(true);
  };

  // Función para cerrar el modal de edición de contraseña
  const handlePasswordModalClose = () => {
    setEditUser(null);
    setShowPasswordModal(false);
  };

  // Función para eliminar un usuario
  const Removefunction = async (user) => {
    await deleteByIDToBD(urlUsers, user._id);
    fetchUsers();
  };

  // Función para filtrar los usuarios según el término de búsqueda
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower)
    );
  });

  // Renderizado del componente
  return (
    <div className="Users-Style">
      <div className={` ${showAlerts ? "" : "d-none"}`}>
        <div className="mostrar-alert">{showAlerts}</div>
      </div>

      <div className="Users-container">
        <div className="card-title">
          <h2>Todos Los Usuarios</h2>
        </div>
        <div className="divbtn">
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn btn-success"
          >
            Agregar Nuevo Usuario
          </Button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="m-3"
          />
        </div>
        <div className="card-body">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Funciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      onClick={() => LoadEdit(user)}
                      className="btn btn-success m-2"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => Removefunction(user)}
                      className="btn btn-danger m-2"
                    >
                      Eliminar
                    </Button>
                    <Button
                      onClick={() => RestorePassword(user)}
                      className="btn btn-primary m-2"
                    >
                      Editar Contraseña
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal show={showEditModal} onHide={handleEditModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editUser && (
              <UserEdit
                user={editUser}
                onClose={handleEditModalClose}
                onSave={fetchUsers}
                setshowAlerts={setshowAlerts}
              />
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showAddModal} onHide={handleAddModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UserAdd
              onClose={handleAddModalClose}
              onSave={fetchUsers}
              setshowAlerts={setshowAlerts}
            />
          </Modal.Body>
        </Modal>

        <Modal show={showPasswordModal} onHide={handlePasswordModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UserEditPassword
              user={editUser}
              onClose={handlePasswordModalClose}
              onSave={fetchUsers}
              setshowAlerts={setshowAlerts}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Users;
