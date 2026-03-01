import { apiClient } from './authService'

export const bitacoraService = {
  // Obtener todas las bitácoras (sin paginación)
  async getAll() {
    try {
      const response = await apiClient.get('/api/bitacora-viajes')
      return response.data
    } catch (error) {
      console.error('Error al obtener bitácoras:', error)
      throw error
    }
  },

  // Obtener todas las bitácoras (con paginación)
  async getBitacoras(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/api/bitacora-viajes', {
        params: {
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener bitácoras:', error)
      throw error
    }
  },

  // Crear una nueva bitácora
  async create(bitacoraData) {
    try {
      const response = await apiClient.post('/api/bitacora-viajes', bitacoraData)
      return response.data
    } catch (error) {
      console.error('Error al crear bitácora:', error)
      const message = error.response?.data?.message || 'Error al crear bitácora'
      throw new Error(message)
    }
  },

  // Crear una nueva bitácora (alias)
  async createBitacora(bitacoraData) {
    return this.create(bitacoraData)
  },

  // Actualizar una bitácora existente
  async update(id, bitacoraData) {
    try {
      const response = await apiClient.put(`/api/bitacora-viajes/${id}`, bitacoraData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar bitácora:', error)
      const message = error.response?.data?.message || 'Error al actualizar bitácora'
      throw new Error(message)
    }
  },

  // Actualizar una bitácora existente (alias)
  async updateBitacora(id, bitacoraData) {
    return this.update(id, bitacoraData)
  },

  // Eliminar una bitácora
  async delete(id) {
    try {
      const response = await apiClient.delete(`/api/bitacora-viajes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar bitácora:', error)
      const message = error.response?.data?.message || 'Error al eliminar bitácora'
      throw new Error(message)
    }
  },

  // Eliminar una bitácora (alias)
  async deleteBitacora(id) {
    return this.delete(id)
  },

  // Obtener una bitácora por ID
  async getById(id) {
    try {
      const response = await apiClient.get(`/api/bitacora-viajes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener bitácora:', error)
      const message = error.response?.data?.message || 'Error al obtener bitácora'
      throw new Error(message)
    }
  },

  // Obtener una bitácora por ID (alias)
  async getBitacoraById(id) {
    return this.getById(id)
  },

  // Obtener el viaje de una bitácora
  async getViajeBitacora(viajeId) {
    try {
      const response = await apiClient.get(`/api/bitacora-viajes/viaje/${viajeId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener viaje de bitácora:', error)
      const message = error.response?.data?.message || 'Error al obtener viaje de bitácora'
      throw new Error(message)
    }
  }
}
