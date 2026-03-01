import { apiClient } from './authService'

export const alertsService = {
    // Obtener alertas activas (abiertas)
    async getActiveAlerts() {
        try {
            const response = await apiClient.get('/api/alertas/activas')
            return response.data
        } catch (error) {
            console.error('Error al obtener alertas activas:', error)
            throw error
        }
    },

    // Obtener conteo de alertas
    async getAlertsCount() {
        try {
            const response = await apiClient.get('/api/alertas/count')
            return response.data
        } catch (error) {
            console.error('Error al obtener conteo de alertas:', error)
            return 0
        }
    },

    // Marcar alerta como atendida
    async markAsAttended(id) {
        try {
            const response = await apiClient.patch(`/api/alertas/${id}/atender`)
            return response.data
        } catch (error) {
            console.error('Error al marcar alerta como atendida:', error)
            throw error
        }
    }
}
