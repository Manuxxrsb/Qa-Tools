import { useState } from "react";
import axios from "axios";
import { generateJwt } from "./JwtGeneratorComponent";

// Determinar la baseURL según el entorno
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment ? "/api" : import.meta.env.VITE_API_URL;

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL,
  withCredentials: false, // importante para CORS
});

const useRequest = () => {
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [statusCode, setStatusCode] = useState("");
  /**
   * Realiza una petición HTTP genérica.
   * @param {Object} params
   * @param {string} params.url - Endpoint relativo o absoluto.
   * @param {string} params.method - Método HTTP (GET, POST, PUT, PATCH, DELETE, etc). Obligatorio.
   * @param {Object} [params.headers] - Headers adicionales a enviar (opcional).
   * @param {any} [params.body] - Cuerpo de la petición (opcional, para POST, PUT, PATCH, etc).
   */
  const handleRequest = async ({ url, method, headers = undefined, body = undefined }) => {
    if (!url || !method) {
      setError("Los parámetros 'url' y 'method' son obligatorios.");
      return;
    }
    try {
      let res;
      const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
      let jwtToken;
      try {
        jwtToken = generateJwt();
      } catch (e) {
        setError("Error generando JWT: " + e.message);
        return;
      }
      // Construir headers
      const finalHeaders = {
        ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(headers || {}),
        Authorization: `Bearer ${jwtToken}`
      };
      const config = { headers: finalHeaders };
      const upperMethod = method.toUpperCase();
      if (["POST", "PUT", "PATCH"].includes(upperMethod)) {
        res = await api[upperMethod.toLowerCase()](cleanUrl, body, config);
      } else if (upperMethod === "DELETE") {
        res = await api.delete(cleanUrl, config);
      } else {
        // GET u otros métodos sin body
        res = await api.get(cleanUrl, config);
      } setRespuesta(res.data);
      setStatusCode(res.status);
      setError("");
    } catch (err) {
      setRespuesta("");
      setStatusCode(err.response?.status || "");
      let errorMessage = "Error en la solicitud";
      if (err.response) {
        errorMessage = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Error detallado:", err);
    }
  }; return { respuesta, error, statusCode, handleRequest };
};

export default useRequest;
