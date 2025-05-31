import { useState } from "react";
import axios from "axios";
import { generateJwt } from "./JwtGeneratorComponent";

console.log('API URL:', import.meta.env.VITE_API_URL); // Para debug

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: "http://127.0.0.1:8080", // URL directa al backend
  withCredentials: false, // importante para CORS
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

const useRequest = () => {
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [cachedJwt, setCachedJwt] = useState(null);
  const [jwtExpiration, setJwtExpiration] = useState(null);

  const getValidJwt = async () => {
    const now = Date.now();
    if (cachedJwt && jwtExpiration && now < jwtExpiration) {
      return cachedJwt;
    }

    try {
      const newToken = generateJwt();
      // Guardar el nuevo token y establecer su expiración a 55 minutos
      // (un poco menos que la hora típica para estar seguros)
      setCachedJwt(newToken);
      setJwtExpiration(now + 55 * 60 * 1000);
      return newToken;
    } catch (e) {
      throw new Error("Error generando JWT: " + e.message);
    }
  };

  /**
   * Realiza una petición HTTP genérica.
   * @param {Object} params
   * @param {string} params.url - Endpoint relativo o absoluto.
   * @param {string} params.method - Método HTTP (GET, POST, PUT, PATCH, DELETE, etc). Obligatorio.
   * @param {Object} [params.headers] - Headers adicionales a enviar (opcional).
   * @param {any} [params.body] - Cuerpo de la petición (opcional, para POST, PUT, PATCH, etc).
   */
  const handleRequest = async ({ url, method, headers = undefined, body = undefined }) => {
    console.log('Request params:', { url, method, headers, body });

    if (!url || !method) {
      setError("Los parámetros 'url' y 'method' son obligatorios.");
      return;
    } try {
      let finalHeaders = {
        ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(headers || {})
      };
      // Si la ruta NO es /ping, agregar JWT
      if (!url.includes('/ping')) {
        const jwtToken = await getValidJwt();
        finalHeaders = {
          ...finalHeaders,
          Authorization: `Bearer ${jwtToken}`
        };
      }
      const config = { headers: finalHeaders };
      const upperMethod = method.toUpperCase();
      let res;      // Limpiamos la URL de cualquier slash inicial
      const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
      console.log('Requesting URL:', cleanUrl); // Para debug

      if (["POST", "PUT", "PATCH"].includes(upperMethod)) {
        res = await api[upperMethod.toLowerCase()](cleanUrl, body, config);
      } else if (upperMethod === "DELETE") {
        res = await api.delete(cleanUrl, config);
      } else {
        res = await api.get(cleanUrl, config);
      } console.log('Response:', { data: res.data, status: res.status });
      setRespuesta(res.data);
      setStatusCode(res.status);
      setError("");
    } catch (err) {
      console.error('Request error:', err);
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
