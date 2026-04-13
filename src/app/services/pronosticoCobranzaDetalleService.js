import { apiClient } from "./authService";

export const pronosticoCobranzaDetalleService = {
  async getByRange(inicio, fin) {
    try {
      const response = await apiClient.get("/api/pronostico-cobranza-detalle/rango", {
        params: { inicio, fin },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener pronóstico por rango:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/pronostico-cobranza-detalle/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener pronóstico por id:", error);
      throw error;
    }
  },

  async update(id, payload) {
    try {
      const response = await apiClient.put(`/api/pronostico-cobranza-detalle/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar pronóstico:", error);
      throw error;
    }
  },

  async remove(id) {
    try {
      const response = await apiClient.delete(`/api/pronostico-cobranza-detalle/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar pronóstico:", error);
      throw error;
    }
  },
};

export default pronosticoCobranzaDetalleService;