import { apiClient } from './authService'

export const operadoresService = {
  // Obtener todos los operadores
  async getOperadores(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/api/operadores', {
        params: {
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener operadores:', error)
      throw error
    }
  },

  // Crear un nuevo operador
  async createOperador(operadorData) {
    try {
      const response = await apiClient.post('/api/operadores', operadorData)
      return response.data
    } catch (error) {
      console.error('Error al crear operador:', error)
      const message = error.response?.data?.message || 'Error al crear operador'
      throw new Error(message)
    }
  },

  // Actualizar un operador existente
  async updateOperador(id, operadorData) {
    try {
      const response = await apiClient.put(`/api/operadores/${id}`, operadorData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar operador:', error)
      const message = error.response?.data?.message || 'Error al actualizar operador'
      throw new Error(message)
    }
  },

  // Eliminar un operador
  async deleteOperador(id) {
    try {
      const response = await apiClient.delete(`/api/operadores/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar operador:', error)
      const message = error.response?.data?.message || 'Error al eliminar operador'
      throw new Error(message)
    }
  },

  // Obtener un operador por ID
  async getOperadorById(id) {
    try {
      const response = await apiClient.get(`/api/operadores/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener operador:', error)
      const message = error.response?.data?.message || 'Error al obtener operador'
      throw new Error(message)
    }
  }
}
