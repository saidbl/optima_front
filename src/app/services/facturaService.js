import { apiClient } from './authService'

export const facturaService = {
  // Obtener todas las facturas con paginación
  async getFacturas(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/api/facturas', {
        params: {
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener facturas:', error)
      throw error
    }
  },

  // Obtener facturas por estatus
  async getFacturasByEstatus(estatus, page = 0, size = 10) {
    try {
      const response = await apiClient.get('/api/facturas/estatus', {
        params: {
          estatus,
          page,
          size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener facturas por estatus:', error)
      throw error
    }
  },

  // Obtener una factura por ID
  async getFacturaById(id) {
    try {
      const response = await apiClient.get(`/api/facturas/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener factura:', error)
      const message = error.response?.data?.message || 'Error al obtener factura'
      throw new Error(message)
    }
  },

  // Actualizar el estatus de una factura (marcar como pagada)
  async updateFacturaEstatus(id, facturaData) {
    try {
      const response = await apiClient.put(`/api/facturas/${id}`, facturaData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar factura:', error)
      const message = error.response?.data?.message || 'Error al actualizar factura'
      throw new Error(message)
    }
  },

  // Marcar factura como pagada (método helper)
  async marcarComoPagada(id, fechaPago, metodoPago) {
    try {
      const facturaData = {
        estatus: 'PAGADA',
        fechaPago,
        metodoPago
      }
      return await this.updateFacturaEstatus(id, facturaData)
    } catch (error) {
      console.error('Error al marcar factura como pagada:', error)
      throw error
    }
  }
}
