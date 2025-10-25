import { apiClient } from './authService'

export const viajesService = {
  // Obtener todos los viajes con paginación
  async getViajes(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/api/viajes', {
        params: {
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener viajes:', error)
      throw error
    }
  },

  // Crear un nuevo viaje
  async createViaje(viajeData) {
    try {
      const response = await apiClient.post('/api/viajes', viajeData)
      return response.data
    } catch (error) {
      console.error('Error al crear viaje:', error)
      const message = error.response?.data?.message || 'Error al crear viaje'
      throw new Error(message)
    }
  },

  // Actualizar un viaje existente
  async updateViaje(id, viajeData) {
    try {
      const response = await apiClient.put(`/api/viajes/${id}`, viajeData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar viaje:', error)
      const message = error.response?.data?.message || 'Error al actualizar viaje'
      throw new Error(message)
    }
  },

  // Eliminar un viaje
  async deleteViaje(id) {
    try {
      const response = await apiClient.delete(`/api/viajes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar viaje:', error)
      const message = error.response?.data?.message || 'Error al eliminar viaje'
      throw new Error(message)
    }
  },

  // Obtener un viaje por ID
  async getViajeById(id) {
    try {
      const response = await apiClient.get(`/api/viajes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener viaje:', error)
      const message = error.response?.data?.message || 'Error al obtener viaje'
      throw new Error(message)
    }
  },

  // Obtener viajes por estado
  async getViajesByEstado(estado, page = 0, size = 10) {
    try {
      const response = await apiClient.get('/api/viajes/estado', {
        params: {
          estado,
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener viajes por estado:', error)
      throw error
    }
  },

  // Obtener viajes por operador
  async getViajesByOperador(operadorId, page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/api/viajes/operador/${operadorId}`, {
        params: {
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener viajes por operador:', error)
      throw error
    }
  }
}
