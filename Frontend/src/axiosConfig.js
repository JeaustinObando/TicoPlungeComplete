import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Asegúrate de que esta URL sea la del servidor backend
});

export default instance;
