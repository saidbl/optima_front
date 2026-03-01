'use client'

import { useState, useEffect } from 'react'
import {
  Wrench,
  Plus,
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { almacenService } from '@/app/services/almacenService'
import { unidadesService } from '@/app/services/unidadesService'
import { refaccionesService } from '@/app/services/refaccionesService'
import { exportMantenimientoPDF } from '@/utils/pdfExport'
import {
  StatCard,
  MantenimientoCard,
  CreateMantenimientoModal,
  ViewMantenimientoModal
} from './components'

const TIPOS_MANTENIMIENTO = {
  PREVENTIVO: { label: 'Preventivo', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  CORRECTIVO: { label: 'Correctivo', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  PREDICTIVO: { label: 'Predictivo', color: 'bg-purple-100 text-purple-800', icon: TrendingUp }
}

const MantenimientoPage = () => {
  const [mantenimientos, setMantenimientos] = useState([])
  const [filteredMantenimientos, setFilteredMantenimientos] = useState([])
  const [unidades, setUnidades] = useState([])
  const [refacciones, setRefacciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState('TODOS')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(15)

  const [stats, setStats] = useState({
    total: 0,
    preventivos: 0,
    correctivos: 0,
    predictivos: 0,
    costoTotal: 0,
    costoMesActual: 0
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadMantenimientos(currentPage)
  }, [currentPage])

  useEffect(() => {
    filterMantenimientos()
  }, [searchTerm, tipoFilter, mantenimientos])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadMantenimientos(0),
        loadUnidades(),
        loadRefacciones()
      ])
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Error al cargar datos iniciales')
    } finally {
      setLoading(false)
    }
  }

  const loadMantenimientos = async (page = 0) => {
    try {
      setLoading(true)
      const response = await almacenService.getMantenimientos(page, pageSize)

      if (response.content) {
        setMantenimientos(response.content)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
        setCurrentPage(response.number)

        // Calcular estadísticas con los datos disponibles
        // Nota: Para estadísticas precisas de toda la base de datos, el backend debería proveer un endpoint de stats
        updateStats(response.content, response.totalElements)
      } else {
        const data = Array.isArray(response) ? response : (response.data || [])
        setMantenimientos(data)
        setTotalPages(1)
        setTotalElements(data.length)
        updateStats(data, data.length)
      }
    } catch (error) {
      console.error('Error loading mantenimientos:', error)
      toast.error('Error al cargar mantenimientos')
      setMantenimientos([])
    } finally {
      setLoading(false)
    }
  }

  const updateStats = (data, total) => {
    const preventivos = data.filter(m => m.tipo === 'PREVENTIVO' || m.tipo === 'Preventivo').length
    const correctivos = data.filter(m => m.tipo === 'CORRECTIVO' || m.tipo === 'Correctivo').length
    const predictivos = data.filter(m => m.tipo === 'PREDICTIVO' || m.tipo === 'Predictivo').length

    // Calcular costo total (sumar los montos de todos los gastos)
    const costoTotal = data.reduce((sum, m) => {
      const gastosTotal = (m.gastos || []).reduce((gSum, g) => gSum + (parseFloat(g.monto) || 0), 0)
      return sum + gastosTotal
    }, 0)

    // Calcular costo del mes actual
    const mesActual = new Date().getMonth()
    const anioActual = new Date().getFullYear()
    const costoMesActual = data
      .filter(m => {
        if (!m.fecha) return false
        const fecha = new Date(m.fecha)
        return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual
      })
      .reduce((sum, m) => {
        const gastosTotal = (m.gastos || []).reduce((gSum, g) => gSum + (parseFloat(g.monto) || 0), 0)
        return sum + gastosTotal
      }, 0)

    setStats({
      total: total,
      preventivos,
      correctivos,
      predictivos,
      costoTotal,
      costoMesActual
    })
  }

  const loadUnidades = async () => {
    try {
      const response = await unidadesService.getAll()
      const data = Array.isArray(response) ? response : (response.content || response.data || [])
      setUnidades(data)
    } catch (error) {
      console.error('Error loading unidades:', error)
      setUnidades([])
    }
  }

  const loadRefacciones = async () => {
    try {
      const response = await refaccionesService.getAllRefacciones()
      const data = Array.isArray(response) ? response : (response.content || response.data || [])
      setRefacciones(data)
    } catch (error) {
      console.error('Error loading refacciones:', error)
      setRefacciones([])
    }
  }

  const filterMantenimientos = () => {
    const filtered = mantenimientos.filter(mantenimiento => {
      const matchesSearch =
        mantenimiento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mantenimiento.realizadoPor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mantenimiento.unidad?.numeroEconomico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mantenimiento.id?.toString().includes(searchTerm)

      const matchesTipo = tipoFilter === 'TODOS' ||
        mantenimiento.tipo?.toUpperCase() === tipoFilter.toUpperCase()

      return matchesSearch && matchesTipo
    })
    setFilteredMantenimientos(filtered)
  }

  const handleCreateMantenimiento = async (mantenimientoData) => {
    try {
      await almacenService.createMantenimiento(mantenimientoData)
      toast.success('Mantenimiento creado exitosamente')
      setShowCreateModal(false)
      loadMantenimientos(currentPage)
    } catch (error) {
      toast.error(error.message || 'Error al crear mantenimiento')
      throw error
    }
  }

  const handleViewDetails = (mantenimiento) => {
    setSelectedMantenimiento(mantenimiento)
    setShowViewModal(true)
  }

  if (loading && mantenimientos.length === 0) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Mantenimientos</h1>
            <p className="text-slate-600 mt-2">Administra los mantenimientos de las unidades</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportMantenimientoPDF(filteredMantenimientos, 'Almacén')}
              className="flex cursor-pointer items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <FileDown className="h-5 w-5" />
              <span>Exportar PDF</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex cursor-pointer items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo mantenimiento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total de mantenimientos"
          value={stats.total}
          icon={Wrench}
          color="bg-blue-600"
          description="Registros totales"
        />
        <StatCard
          title="Preventivos"
          value={stats.preventivos}
          icon={CheckCircle}
          color="bg-green-600"
          description="Planificados"
        />
        <StatCard
          title="Correctivos"
          value={stats.correctivos}
          icon={AlertCircle}
          color="bg-orange-600"
          description="Reparaciones"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por descripción, realizado por, unidad o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="PREVENTIVO">Preventivo</option>
              <option value="CORRECTIVO">Correctivo</option>
              <option value="PREDICTIVO">Predictivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          Mostrando <span className="font-semibold text-slate-900">{filteredMantenimientos.length}</span> de{' '}
          <span className="font-semibold text-slate-900">{totalElements}</span> mantenimientos
        </p>
      </div>

      {/* Mantenimientos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMantenimientos.map((mantenimiento) => (
          <MantenimientoCard
            key={mantenimiento.id}
            mantenimiento={mantenimiento}
            onViewDetails={handleViewDetails}
            unidades={unidades}
          />
        ))}
      </div>

      {filteredMantenimientos.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No se encontraron mantenimientos</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !searchTerm.trim() && tipoFilter === 'TODOS' && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Mostrando <span className="font-medium">{currentPage * pageSize + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * pageSize, totalElements)}
                </span>{' '}
                de <span className="font-medium">{totalElements}</span> resultados
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    (index >= currentPage - 1 && index <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        aria-current={currentPage === index ? 'page' : undefined}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === index
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'
                          }`}
                      >
                        {index + 1}
                      </button>
                    )
                  } else if (
                    index === currentPage - 2 ||
                    index === currentPage + 2
                  ) {
                    return (
                      <span
                        key={index}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0"
                      >
                        ...
                      </span>
                    )
                  }
                  return null
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateMantenimientoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateMantenimiento}
        unidades={unidades}
        refacciones={refacciones}
      />

      <ViewMantenimientoModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedMantenimiento(null)
        }}
        mantenimiento={selectedMantenimiento}
      />
    </div>
  )
}

export default MantenimientoPage
