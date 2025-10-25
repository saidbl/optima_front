import { apiClient, authService } from './authService'

export const usersService = {
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

  // Obtener todos los usuarios
  async getUsers(page = 0, size = 10) {
    try {
      const token = authService.getToken()
      const response = await apiClient.get('/api/usuarios', {
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
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  },

  // Crear un nuevo usuario
  async createUser(userData) {
    try {
      const token = authService.getToken()
      const response = await apiClient.post('/api/usuarios', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al crear usuario:', error)
      const message = error.response?.data?.message || 'Error al crear usuario'
      throw new Error(message)
    }
  },

  // Actualizar un usuario existente
  async updateUser(id, userData) {
    try {
      const token = authService.getToken()
      const response = await apiClient.put(`/api/usuarios/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      const message = error.response?.data?.message || 'Error al actualizar usuario'
      throw new Error(message)
    }
  },

  // Eliminar un usuario
  async deleteUser(id) {
    try {
      const token = authService.getToken()
      const response = await apiClient.delete(`/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      const message = error.response?.data?.message || 'Error al eliminar usuario'
      throw new Error(message)
    }
  },

  // Obtener un usuario por ID
  async getUserById(id) {
    try {
      const token = authService.getToken()
      const response = await apiClient.get(`/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      const message = error.response?.data?.message || 'Error al obtener usuario'
      throw new Error(message)
    }
  },

  // Obtener roles de un usuario específico
  async getUserRoles(userId) {
    try {
      const token = authService.getToken()
      const response = await apiClient.get(`/api/usuarios/${userId}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener roles del usuario:', error)
      throw error
    }
  },

  // Activar/Desactivar usuario
  async toggleUserStatus(id, activo) {
    try {
      const token = authService.getToken()
      const response = await apiClient.patch(`/api/usuarios/${id}`, 
        { activo },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error)
      const message = error.response?.data?.message || 'Error al cambiar estado del usuario'
      throw new Error(message)
    }
  },

  // Asignar rol a usuario
  async assignRole(usuarioId, rolId) {
    try {
      const token = authService.getToken()
      const response = await apiClient.post('/api/usuario-rol/asignar', 
        {
          usuarioId: usuarioId.toString(),
          rolId: rolId.toString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error al asignar rol:', error)
      const message = error.response?.data?.message || 'Error al asignar rol'
      throw new Error(message)
    }
  },

  // Quitar rol de usuario
  async removeRole(usuarioId, rolId) {
    try {
      const token = authService.getToken()
      const response = await apiClient.delete('/api/usuario-rol/quitar', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          usuarioId: usuarioId.toString(),
          rolId: rolId.toString()
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al quitar rol:', error)
      const message = error.response?.data?.message || 'Error al quitar rol'
      throw new Error(message)
    }
  },

  // Quitar todos los roles de un usuario
  async removeAllRoles(usuarioId, roles) {
    try {
      const token = authService.getToken()
      // Eliminar cada rol secuencialmente
      for (const rolNombre of roles) {
        // Necesitamos obtener el ID del rol a partir de su nombre
        const rolesResponse = await this.getRoles(0, 100)
        const roleData = rolesResponse.content.find(r => r.nombre === rolNombre)
        if (roleData) {
          await this.removeRole(usuarioId, roleData.id)
        }
      }
    } catch (error) {
      console.error('Error al quitar todos los roles:', error)
      throw error
    }
  }
}
