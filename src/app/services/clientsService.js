import { apiClient } from './authService'

export const clientsService = {
  // Obtener todos los clientes
  async getClients(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/api/clientes', {
        params: {
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener clientes:', error)
      throw error
    }
  },

  // Crear un nuevo cliente
  async createClient(clientData) {
    try {
      const response = await apiClient.post('/api/clientes', clientData)
      return response.data
    } catch (error) {
      console.error('Error al crear cliente:', error)
      const message = error.response?.data?.message || 'Error al crear cliente'
      throw new Error(message)
    }
  },

  // Actualizar un cliente existente
  async updateClient(id, clientData) {
    try {
      const response = await apiClient.put(`/api/clientes/${id}`, clientData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar cliente:', error)
      const message = error.response?.data?.message || 'Error al actualizar cliente'
      throw new Error(message)
    }
  },

  // Eliminar un cliente
  async deleteClient(id) {
    try {
      const response = await apiClient.delete(`/api/clientes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      const message = error.response?.data?.message || 'Error al eliminar cliente'
      throw new Error(message)
    }
  },

  // Obtener un cliente por ID
  async getClientById(id) {
    try {
      const response = await apiClient.get(`/api/clientes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener cliente:', error)
      const message = error.response?.data?.message || 'Error al obtener cliente'
      throw new Error(message)
    }
  }
}
