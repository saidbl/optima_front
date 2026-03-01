import { apiClient } from './authService'

const nominaFijaService = {
    // Obtener todas las nóminas fijas
    async getNominasFijas(page = 0, size = 100) {
        try {
            const response = await apiClient.get('/api/nomina-fija', {
                params: {
                    page,
                    size
                }
            })
            return response.data
        } catch (error) {
            console.error('Error al obtener nóminas fijas:', error)
            throw error
        }
    },

    // Obtener nómina fija por ID
    async getNominaFijaById(id) {
        try {
            const response = await apiClient.get(`/api/nomina-fija/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener nómina fija:', error)
            throw error
        }
    },

    // Crear nueva nómina fija
    async createNominaFija(nominaData) {
        try {
            const response = await apiClient.post('/api/nomina-fija', nominaData)
            return response.data
        } catch (error) {
            console.error('Error al crear nómina fija:', error)
            const message = error.response?.data?.message || 'Error al crear nómina fija'
            throw new Error(message)
        }
    },

    // Actualizar nómina fija existente
    async updateNominaFija(id, nominaData) {
        try {
            const response = await apiClient.put(`/api/nomina-fija/${id}`, nominaData)
            return response.data
        } catch (error) {
            console.error('Error al actualizar nómina fija:', error)
            const message = error.response?.data?.message || 'Error al actualizar nómina fija'
            throw new Error(message)
        }
    },

    // Eliminar nómina fija
    async deleteNominaFija(id) {
        try {
            const response = await apiClient.delete(`/api/nomina-fija/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al eliminar nómina fija:', error)
            const message = error.response?.data?.message || 'Error al eliminar nómina fija'
            throw new Error(message)
        }
    }
}

export default nominaFijaService
