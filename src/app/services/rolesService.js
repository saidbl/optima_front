import { apiClient, authService } from './authService'

export const rolesService = {
  // Obtener todos los roles
  async getRoles(page = 0, size = 10) {
    try {
      const token = authService.getToken()
      const response = await apiClient.get('/api/roles', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener roles:', error)
      throw error
    }
  },

  // Crear un nuevo rol
  async createRole(roleData) {
    try {
      const token = authService.getToken()
      const response = await apiClient.post('/api/roles', roleData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al crear rol:', error)
      const message = error.response?.data?.message || 'Error al crear rol'
      throw new Error(message)
    }
  },

  // Actualizar un rol existente
  async updateRole(id, roleData) {
    try {
      const token = authService.getToken()
      const response = await apiClient.put(`/api/roles/${id}`, roleData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar rol:', error)
      const message = error.response?.data?.message || 'Error al actualizar rol'
      throw new Error(message)
    }
  },

  // Eliminar un rol
  async deleteRole(id) {
    try {
      const token = authService.getToken()
      const response = await apiClient.delete(`/api/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al eliminar rol:', error)
      const message = error.response?.data?.message || 'Error al eliminar rol'
      throw new Error(message)
    }
  },

  // Obtener un rol por ID
  async getRoleById(id) {
    try {
      const token = authService.getToken()
      const response = await apiClient.get(`/api/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener rol:', error)
      const message = error.response?.data?.message || 'Error al obtener rol'
      throw new Error(message)
    }
  }
}
