import { apiClient } from './authService'

const nominaOperativaService = {
    // Obtener todas las nóminas
    async getNominas(page = 0, size = 100) {
        try {
            const response = await apiClient.get('/api/nomina-operativa', {
                params: {
                    page,
                    size
                }
            })
            return response.data
        } catch (error) {
            console.error('Error al obtener nóminas:', error)
            throw error
        }
    },

    // Obtener nómina por ID
    async getNominaById(id) {
        try {
            const response = await apiClient.get(`/api/nomina-operativa/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener nómina:', error)
            throw error
        }
    },

    // Obtener nóminas de un operador específico
    async getNominasByOperador(operadorId) {
        try {
            const response = await apiClient.get(`/api/nomina-operativa/operador/${operadorId}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener nóminas del operador:', error)
            throw error
        }
    },

    // Crear nueva nómina
    async createNomina(nominaData) {
        try {
            const response = await apiClient.post('/api/nomina-operativa', nominaData)
            return response.data
        } catch (error) {
            console.error('Error al crear nómina:', error)
            const message = error.response?.data?.message || 'Error al crear nómina'
            throw new Error(message)
        }
    },

    // Actualizar nómina existente
    async updateNomina(id, nominaData) {
        try {
            const response = await apiClient.put(`/api/nomina-operativa/${id}`, nominaData)
            return response.data
        } catch (error) {
            console.error('Error al actualizar nómina:', error)
            const message = error.response?.data?.message || 'Error al actualizar nómina'
            throw new Error(message)
        }
    },

    // Eliminar nómina
    async deleteNomina(id) {
        try {
            const response = await apiClient.delete(`/api/nomina-operativa/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al eliminar nómina:', error)
            const message = error.response?.data?.message || 'Error al eliminar nómina'
            throw new Error(message)
        }
    }
}

export default nominaOperativaService
