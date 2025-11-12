'use client'

import { useState } from 'react'
import { CheckCircle, Calendar, CreditCard, AlertCircle } from 'lucide-react'

const PagarFacturaModal = ({ isOpen, onClose, onConfirm, factura }) => {
  const [formData, setFormData] = useState({
    fechaPago: new Date().toISOString().split('T')[0],
    metodoPago: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onConfirm(factura, formData.fechaPago, formData.metodoPago)
      setFormData({
        fechaPago: new Date().toISOString().split('T')[0],
        metodoPago: ''
      })
      onClose()
    } catch (error) {
      console.error('Error al procesar pago:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !factura) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 text-center">Marcar como pagada</h2>
          <p className="text-sm text-slate-600 text-center mt-2">
            Factura: <span className="font-semibold">{factura.numeroFactura}</span>
          </p>
          <p className="text-lg font-bold text-center mt-2 text-emerald-600">
            ${(factura.monto || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Fecha de pago *
              </label>
              <input
                type="date"
                value={formData.fechaPago}
                onChange={(e) => setFormData({ ...formData, fechaPago: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <CreditCard className="h-4 w-4 mr-2" />
                Método de pago *
              </label>
              <select
                value={formData.metodoPago}
                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-slate-900"
                required
              >
                <option value="">Selecciona un método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia bancaria">Transferencia bancaria</option>
                <option value="Cheque">Cheque</option>
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Tarjeta de débito">Tarjeta de débito</option>
                <option value="Depósito">Depósito</option>
              </select>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Confirmar pago</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Esta acción marcará la factura como pagada. Asegúrate de que el pago haya sido recibido.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 cursor-pointer px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Procesando...' : 'Confirmar pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PagarFacturaModal
