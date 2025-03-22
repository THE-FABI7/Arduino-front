// En un archivo api.js o similar
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Asegúrate de que esta URL coincida con la de tu backend

export const getHistorial = async (limite = 100, offset = 0) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/historial`, {
      params: { limite, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historial:', error);
    return [];
  }
};

export const getEstadisticas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/estadisticas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching estadisticas:', error);
    return null;
  }
};

export const getTendencias = async (limite = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tendencias`, {
      params: { limite },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tendencias:', error);
    return [];
  }
};
