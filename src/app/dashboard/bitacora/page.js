'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  FileText,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Truck,
  MapPin,
  Calendar,
  Clock,
  User,
  Package,
  Fuel,
  Receipt
} from 'lucide-react'
import toast from 'react-hot-toast'
import { bitacoraService } from '@/app/services/bitacoraService'

const StatCard = ({ title, value, icon: Icon, color, description }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  </div>
)

const BitacoraCard = ({ bitacora, onEdit, onDelete, onViewDetails }) => {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value || 0)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-slate-900">{bitacora.folio}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  Viaje #{bitacora.viajeId}
                </span>
              </div>
              <div className="flex items-center text-sm text-slate-500 space-x-2">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{bitacora.origen} → {bitacora.destino}</span>
              </div>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                <button
                  onClick={() => {
                    onViewDetails(bitacora)
                    setShowMenu(false)
                  }}
                  className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-3 text-slate-400" />
                  Ver detalles
                </button>
                <button
                  onClick={() => {
                    onEdit(bitacora)
                    setShowMenu(false)
                  }}
                  className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4 mr-3 text-slate-400" />
                  Editar
                </button>
                <hr className="my-2 border-slate-100" />
                <button
                  onClick={() => {
                    onDelete(bitacora)
                    setShowMenu(false)
                  }}
                  className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Carga
            </span>
            <span className="font-medium text-slate-900">{formatDate(bitacora.fechaCarga)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Entrega
            </span>
            <span className="font-medium text-slate-900">{formatDate(bitacora.fechaEntrega)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center">
              <DollarSign className="h-3.5 w-3.5 mr-1.5" />
              Costo Total
            </span>
            <span className="font-semibold text-emerald-600">{formatCurrency(bitacora.costoTotal)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-500">
            <Receipt className="h-3.5 w-3.5 mr-1.5" />
            {bitacora.numeroFactura || 'Sin factura'}
          </div>
          <div className="flex items-center text-xs text-blue-600 font-medium">
            <Truck className="h-3.5 w-3.5 mr-1.5" />
            ID: {bitacora.id}
          </div>
        </div>
      </div>
    </div>
  )
}

const CreateBitacoraModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    viajeId: '',
    folio: '',
    clienteId: '',
    origen: '',
    destino: '',
    fechaCarga: '',
    fechaEntrega: '',
    horaEntrega: '',
    operadorId: '',
    unidadId: '',
    caja: '',
    casetas: '',
    dieselLitros: '',
    comisionOperador: '',
    gastosExtras: '',
    costoTotal: '',
    comentarios: '',
    numeroFactura: '',
    creadoPor: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Convertir strings a números donde corresponda
      const dataToSend = {
        ...formData,
        viajeId: parseInt(formData.viajeId),
        clienteId: parseInt(formData.clienteId),
        operadorId: parseInt(formData.operadorId),
        unidadId: parseInt(formData.unidadId),
        casetas: parseFloat(formData.casetas) || 0,
        dieselLitros: parseFloat(formData.dieselLitros) || 0,
        comisionOperador: parseFloat(formData.comisionOperador) || 0,
        gastosExtras: parseFloat(formData.gastosExtras) || 0,
        costoTotal: parseFloat(formData.costoTotal) || 0,
        creadoPor: parseInt(formData.creadoPor)
      }
      await onSave(dataToSend)
      setFormData({
        viajeId: '',
        folio: '',
        clienteId: '',
        origen: '',
        destino: '',
        fechaCarga: '',
        fechaEntrega: '',
        horaEntrega: '',
        operadorId: '',
        unidadId: '',
        caja: '',
        casetas: '',
        dieselLitros: '',
        comisionOperador: '',
        gastosExtras: '',
        costoTotal: '',
        comentarios: '',
        numeroFactura: '',
        creadoPor: ''
      })
      onClose()
    } catch (error) {
      console.error('Error saving bitácora:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Nueva bitácora de viaje</h2>
          <p className="text-sm text-slate-600 mt-1">Registra un nuevo viaje con todos sus detalles</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Información General */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Viaje *
                  </label>
                  <input
                    type="number"
                    value={formData.viajeId}
                    onChange={(e) => setFormData({ ...formData, viajeId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Folio *
                  </label>
                  <input
                    type="text"
                    value={formData.folio}
                    onChange={(e) => setFormData({ ...formData, folio: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="VJ-2025-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Cliente *
                  </label>
                  <input
                    type="number"
                    value={formData.clienteId}
                    onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número de Factura
                  </label>
                  <input
                    type="text"
                    value={formData.numeroFactura}
                    onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="FACT-2025-001"
                  />
                </div>
              </div>
            </div>

            {/* Ruta */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Ruta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Origen *
                  </label>
                  <input
                    type="text"
                    value={formData.origen}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="Ciudad de México"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Destino *
                  </label>
                  <input
                    type="text"
                    value={formData.destino}
                    onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="Guadalajara"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fechas y Horarios */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Fechas y Horarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Carga *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaCarga}
                    onChange={(e) => setFormData({ ...formData, fechaCarga: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaEntrega}
                    onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Entrega *
                  </label>
                  <input
                    type="time"
                    value={formData.horaEntrega}
                    onChange={(e) => setFormData({ ...formData, horaEntrega: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Recursos */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Recursos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Operador *
                  </label>
                  <input
                    type="number"
                    value={formData.operadorId}
                    onChange={(e) => setFormData({ ...formData, operadorId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Unidad *
                  </label>
                  <input
                    type="number"
                    value={formData.unidadId}
                    onChange={(e) => setFormData({ ...formData, unidadId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Caja *
                  </label>
                  <input
                    type="text"
                    value={formData.caja}
                    onChange={(e) => setFormData({ ...formData, caja: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="CAJA-001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Costos */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Costos y Gastos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Casetas ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.casetas}
                    onChange={(e) => setFormData({ ...formData, casetas: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="850.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Diesel (Litros)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.dieselLitros}
                    onChange={(e) => setFormData({ ...formData, dieselLitros: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="120.75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comisión Operador ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.comisionOperador}
                    onChange={(e) => setFormData({ ...formData, comisionOperador: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="1500.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gastos Extras ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.gastosExtras}
                    onChange={(e) => setFormData({ ...formData, gastosExtras: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="250.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Costo Total ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costoTotal}
                    onChange={(e) => setFormData({ ...formData, costoTotal: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="5800.00"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Adicional */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Información Adicional
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comentarios
                  </label>
                  <textarea
                    value={formData.comentarios}
                    onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    rows={3}
                    placeholder="Observaciones o incidencias del viaje..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Creado Por (ID Usuario) *
                  </label>
                  <input
                    type="number"
                    value={formData.creadoPor}
                    onChange={(e) => setFormData({ ...formData, creadoPor: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    placeholder="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 cursor-pointer py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 cursor-pointer py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Crear bitácora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditBitacoraModal = ({ isOpen, onClose, onSave, bitacora }) => {
  const [formData, setFormData] = useState({
    viajeId: '',
    folio: '',
    clienteId: '',
    origen: '',
    destino: '',
    fechaCarga: '',
    fechaEntrega: '',
    horaEntrega: '',
    operadorId: '',
    unidadId: '',
    caja: '',
    casetas: '',
    dieselLitros: '',
    comisionOperador: '',
    gastosExtras: '',
    costoTotal: '',
    comentarios: '',
    numeroFactura: '',
    creadoPor: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (bitacora) {
      setFormData({
        viajeId: bitacora.viajeId || '',
        folio: bitacora.folio || '',
        clienteId: bitacora.clienteId || '',
        origen: bitacora.origen || '',
        destino: bitacora.destino || '',
        fechaCarga: bitacora.fechaCarga || '',
        fechaEntrega: bitacora.fechaEntrega || '',
        horaEntrega: bitacora.horaEntrega || '',
        operadorId: bitacora.operadorId || '',
        unidadId: bitacora.unidadId || '',
        caja: bitacora.caja || '',
        casetas: bitacora.casetas || '',
        dieselLitros: bitacora.dieselLitros || '',
        comisionOperador: bitacora.comisionOperador || '',
        gastosExtras: bitacora.gastosExtras || '',
        costoTotal: bitacora.costoTotal || '',
        comentarios: bitacora.comentarios || '',
        numeroFactura: bitacora.numeroFactura || '',
        creadoPor: bitacora.creadoPor || ''
      })
    }
  }, [bitacora])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const dataToSend = {
        ...formData,
        viajeId: parseInt(formData.viajeId),
        clienteId: parseInt(formData.clienteId),
        operadorId: parseInt(formData.operadorId),
        unidadId: parseInt(formData.unidadId),
        casetas: parseFloat(formData.casetas) || 0,
        dieselLitros: parseFloat(formData.dieselLitros) || 0,
        comisionOperador: parseFloat(formData.comisionOperador) || 0,
        gastosExtras: parseFloat(formData.gastosExtras) || 0,
        costoTotal: parseFloat(formData.costoTotal) || 0,
        creadoPor: parseInt(formData.creadoPor)
      }
      await onSave(bitacora.id, dataToSend)
      onClose()
    } catch (error) {
      console.error('Error saving bitácora:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs  bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Editar bitácora de viaje</h2>
          <p className="text-sm text-slate-600 mt-1">Actualiza la información del viaje</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Información General */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Viaje *
                  </label>
                  <input
                    type="number"
                    value={formData.viajeId}
                    onChange={(e) => setFormData({ ...formData, viajeId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Folio *
                  </label>
                  <input
                    type="text"
                    value={formData.folio}
                    onChange={(e) => setFormData({ ...formData, folio: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Cliente *
                  </label>
                  <input
                    type="number"
                    value={formData.clienteId}
                    onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Número de Factura
                  </label>
                  <input
                    type="text"
                    value={formData.numeroFactura}
                    onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Ruta */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Ruta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Origen *
                  </label>
                  <input
                    type="text"
                    value={formData.origen}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Destino *
                  </label>
                  <input
                    type="text"
                    value={formData.destino}
                    onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fechas y Horarios */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Fechas y Horarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Carga *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaCarga}
                    onChange={(e) => setFormData({ ...formData, fechaCarga: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaEntrega}
                    onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora de Entrega *
                  </label>
                  <input
                    type="time"
                    value={formData.horaEntrega}
                    onChange={(e) => setFormData({ ...formData, horaEntrega: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Recursos */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Recursos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Operador *
                  </label>
                  <input
                    type="number"
                    value={formData.operadorId}
                    onChange={(e) => setFormData({ ...formData, operadorId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Unidad *
                  </label>
                  <input
                    type="number"
                    value={formData.unidadId}
                    onChange={(e) => setFormData({ ...formData, unidadId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Caja *
                  </label>
                  <input
                    type="text"
                    value={formData.caja}
                    onChange={(e) => setFormData({ ...formData, caja: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Costos */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Costos y Gastos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Casetas ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.casetas}
                    onChange={(e) => setFormData({ ...formData, casetas: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Diesel (Litros)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.dieselLitros}
                    onChange={(e) => setFormData({ ...formData, dieselLitros: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comisión Operador ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.comisionOperador}
                    onChange={(e) => setFormData({ ...formData, comisionOperador: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gastos Extras ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.gastosExtras}
                    onChange={(e) => setFormData({ ...formData, gastosExtras: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Costo Total ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costoTotal}
                    onChange={(e) => setFormData({ ...formData, costoTotal: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Adicional */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Información Adicional
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Comentarios
                  </label>
                  <textarea
                    value={formData.comentarios}
                    onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Creado Por (ID Usuario) *
                  </label>
                  <input
                    type="number"
                    value={formData.creadoPor}
                    onChange={(e) => setFormData({ ...formData, creadoPor: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 cursor-pointer py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 cursor-pointer py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar bitácora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ViewBitacoraModal = ({ isOpen, onClose, bitacora }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value || 0)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen || !bitacora) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Detalles de la bitácora</h2>
              <p className="text-sm text-slate-600 mt-1">Información completa del viaje</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
              <FileText className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
          {/* Información General */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Información General
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Folio</label>
                <p className="text-sm text-slate-900 mt-1 font-semibold">{bitacora.folio}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">ID Viaje</label>
                <p className="text-sm text-slate-900 mt-1">#{bitacora.viajeId}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">ID Cliente</label>
                <p className="text-sm text-slate-900 mt-1">#{bitacora.clienteId}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Número de Factura</label>
                <p className="text-sm text-slate-900 mt-1">{bitacora.numeroFactura || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">ID Bitácora</label>
                <p className="text-sm text-slate-900 mt-1">#{bitacora.id}</p>
              </div>
            </div>
          </div>

          {/* Ruta */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Ruta del Viaje
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Origen</label>
                <p className="text-sm text-slate-900 mt-1 font-medium">{bitacora.origen}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Destino</label>
                <p className="text-sm text-slate-900 mt-1 font-medium">{bitacora.destino}</p>
              </div>
            </div>
          </div>

          {/* Fechas y Horarios */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Fechas y Horarios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Fecha de Carga</label>
                <p className="text-sm text-slate-900 mt-1">{formatDate(bitacora.fechaCarga)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Fecha de Entrega</label>
                <p className="text-sm text-slate-900 mt-1">{formatDate(bitacora.fechaEntrega)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Hora de Entrega</label>
                <p className="text-sm text-slate-900 mt-1 flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {bitacora.horaEntrega}
                </p>
              </div>
            </div>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Recursos Asignados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Operador</label>
                <p className="text-sm text-slate-900 mt-1 flex items-center">
                  <User className="h-3.5 w-3.5 mr-1" />
                  ID #{bitacora.operadorId}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Unidad</label>
                <p className="text-sm text-slate-900 mt-1 flex items-center">
                  <Truck className="h-3.5 w-3.5 mr-1" />
                  ID #{bitacora.unidadId}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Caja</label>
                <p className="text-sm text-slate-900 mt-1 flex items-center">
                  <Package className="h-3.5 w-3.5 mr-1" />
                  {bitacora.caja}
                </p>
              </div>
            </div>
          </div>

          {/* Costos y Gastos */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Costos y Gastos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <label className="text-xs font-medium text-slate-500">Casetas</label>
                <p className="text-sm text-slate-900 mt-1 font-semibold">{formatCurrency(bitacora.casetas)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <label className="text-xs font-medium text-slate-500 flex items-center">
                  <Fuel className="h-3 w-3 mr-1" />
                  Diesel (Litros)
                </label>
                <p className="text-sm text-slate-900 mt-1 font-semibold">{bitacora.dieselLitros} L</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <label className="text-xs font-medium text-slate-500">Comisión Operador</label>
                <p className="text-sm text-slate-900 mt-1 font-semibold">{formatCurrency(bitacora.comisionOperador)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <label className="text-xs font-medium text-slate-500">Gastos Extras</label>
                <p className="text-sm text-slate-900 mt-1 font-semibold">{formatCurrency(bitacora.gastosExtras)}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg md:col-span-2 border border-emerald-200">
                <label className="text-xs font-medium text-emerald-700">Costo Total</label>
                <p className="text-2xl text-emerald-700 mt-1 font-bold">{formatCurrency(bitacora.costoTotal)}</p>
              </div>
            </div>
          </div>

          {/* Comentarios */}
          {bitacora.comentarios && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Comentarios
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-700 leading-relaxed">{bitacora.comentarios}</p>
              </div>
            </div>
          )}

          {/* Información del Sistema */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Información del Sistema
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Creado por (ID Usuario)</label>
                <p className="text-sm text-slate-900 mt-1">#{bitacora.creadoPor}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full cursor-pointer px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, bitacoraFolio }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-xs backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Eliminar bitácora</h2>
          <p className="text-slate-600 mb-6">
            ¿Estás seguro de que deseas eliminar la bitácora <span className="font-semibold">{bitacoraFolio}</span>? 
            Esta acción no se puede deshacer y se perderán todos los registros asociados.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 cursor-pointer px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 cursor-pointer px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BitacoraPage() {
  const [bitacoras, setBitacoras] = useState([])
  const [filteredBitacoras, setFilteredBitacoras] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBitacora, setSelectedBitacora] = useState(null)

  useEffect(() => {
    fetchBitacoras()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBitacoras(bitacoras)
    } else {
      const filtered = bitacoras.filter(bitacora =>
        bitacora.folio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bitacora.origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bitacora.destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bitacora.numeroFactura?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBitacoras(filtered)
    }
  }, [searchTerm, bitacoras])

  const fetchBitacoras = async () => {
    try {
      setIsLoading(true)
      const response = await bitacoraService.getAll()
      // Manejar diferentes formatos de respuesta de la API
      const data = Array.isArray(response) ? response : (response.content || response.data || [])
      setBitacoras(data)
      setFilteredBitacoras(data)
    } catch (error) {
      console.error('Error fetching bitácoras:', error)
      toast.error('Error al cargar las bitácoras')
      setBitacoras([])
      setFilteredBitacoras([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data) => {
    try {
      await bitacoraService.create(data)
      toast.success('Bitácora creada exitosamente')
      fetchBitacoras()
    } catch (error) {
      console.error('Error creating bitácora:', error)
      toast.error('Error al crear la bitácora')
      throw error
    }
  }

  const handleEdit = async (id, data) => {
    try {
      await bitacoraService.update(id, data)
      toast.success('Bitácora actualizada exitosamente')
      fetchBitacoras()
    } catch (error) {
      console.error('Error updating bitácora:', error)
      toast.error('Error al actualizar la bitácora')
      throw error
    }
  }

  const handleDelete = async () => {
    try {
      await bitacoraService.delete(selectedBitacora.id)
      toast.success('Bitácora eliminada exitosamente')
      setShowDeleteModal(false)
      setSelectedBitacora(null)
      fetchBitacoras()
    } catch (error) {
      console.error('Error deleting bitácora:', error)
      toast.error('Error al eliminar la bitácora')
    }
  }

  const calculateStats = () => {
    // Asegurarse de que bitacoras sea un array
    const bitacorasArray = Array.isArray(bitacoras) ? bitacoras : []
    const totalBitacoras = bitacorasArray.length
    const totalCosto = bitacorasArray.reduce((sum, b) => sum + (parseFloat(b.costoTotal) || 0), 0)
    const totalDiesel = bitacorasArray.reduce((sum, b) => sum + (parseFloat(b.dieselLitros) || 0), 0)
    const totalCasetas = bitacorasArray.reduce((sum, b) => sum + (parseFloat(b.casetas) || 0), 0)

    return {
      totalBitacoras,
      totalCosto,
      totalDiesel,
      totalCasetas
    }
  }

  const stats = calculateStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando bitácoras...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-blue-600" />
              Bitácora de Viajes
            </h1>
            <p className="text-slate-600 mt-1">Gestiona y monitorea todos los viajes registrados</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl cursor-pointer font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva bitácora
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Viajes"
            value={stats.totalBitacoras}
            icon={FileText}
            color="bg-blue-600"
            description="Bitácoras registradas"
          />
          <StatCard
            title="Costo Total"
            value={new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 0
            }).format(stats.totalCosto)}
            icon={DollarSign}
            color="bg-emerald-600"
            description="Suma de todos los viajes"
          />
          <StatCard
            title="Diesel Total"
            value={`${stats.totalDiesel.toFixed(1)} L`}
            icon={Fuel}
            color="bg-amber-600"
            description="Litros consumidos"
          />
          <StatCard
            title="Casetas Total"
            value={new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 0
            }).format(stats.totalCasetas)}
            icon={Receipt}
            color="bg-purple-600"
            description="Gastos en casetas"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por folio, origen, destino o número de factura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
            />
          </div>
        </div>

        {/* Bitácoras List */}
        {filteredBitacoras.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? 'No se encontraron bitácoras' : 'No hay bitácoras registradas'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primera bitácora de viaje'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear bitácora
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBitacoras.map((bitacora) => (
              <BitacoraCard
                key={bitacora.id}
                bitacora={bitacora}
                onEdit={(bitacora) => {
                  setSelectedBitacora(bitacora)
                  setShowEditModal(true)
                }}
                onDelete={(bitacora) => {
                  setSelectedBitacora(bitacora)
                  setShowDeleteModal(true)
                }}
                onViewDetails={(bitacora) => {
                  setSelectedBitacora(bitacora)
                  setShowViewModal(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateBitacoraModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreate}
      />

      <EditBitacoraModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedBitacora(null)
        }}
        onSave={handleEdit}
        bitacora={selectedBitacora}
      />

      <ViewBitacoraModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedBitacora(null)
        }}
        bitacora={selectedBitacora}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedBitacora(null)
        }}
        onConfirm={handleDelete}
        bitacoraFolio={selectedBitacora?.folio}
      />
    </div>
  )
}