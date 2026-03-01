'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, DollarSign, MapPin, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import tarifasComisionesService from '@/app/services/tarifasComisionesService'
import { clientsService } from '@/app/services/clientsService'
import toast from 'react-hot-toast'
import {
  StatCard,
  RutaComisionCard,
  CreateRutaComisionModal,
  EditRutaComisionModal,
  ViewRutaComisionModal,
  ConfirmDeleteModal
} from './components'

export default function TarifasComisionesPage() {
  const [rutasComisiones, setRutasComisiones] = useState([])
  const [filteredRutas, setFilteredRutas] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [clienteFilter, setClienteFilter] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(20)

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRuta, setSelectedRuta] = useState(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadRutasComisiones(currentPage)
  }, [currentPage])

  useEffect(() => {
    filterRutas()
  }, [searchTerm, clienteFilter, rutasComisiones, clientes])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadRutasComisiones(0),
        loadClientes()
      ])
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Error al cargar datos iniciales')
    } finally {
      setLoading(false)
    }
  }

  const loadRutasComisiones = async (page = 0) => {
    try {
      setLoading(true)
      const data = await tarifasComisionesService.getRutasComisiones(page, pageSize)

      if (data.content) {
        setRutasComisiones(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
        setCurrentPage(data.number)
      } else {
        // Fallback for non-paginated response
        const content = Array.isArray(data) ? data : (data.data || [])
        setRutasComisiones(content)
        setTotalPages(1)
        setTotalElements(content.length)
      }
    } catch (error) {
      console.error('Error loading rutas comisiones:', error)
      toast.error('Error al cargar rutas comisiones')
      setRutasComisiones([])
    } finally {
      setLoading(false)
    }
  }

  const loadClientes = async () => {
    try {
      const data = await clientsService.getClients(0, 1000)
      setClientes(data.content || data || [])
    } catch (error) {
      console.error('Error loading clientes:', error)
    }
  }

  const filterRutas = () => {
    const filtered = rutasComisiones.filter(ruta => {
      // Obtener el nombre del cliente desde el objeto o buscar en la lista
      const clienteNombre = ruta.cliente?.nombre ||
        clientes.find(c => c.id === ruta.clienteId)?.nombre ||
        ''

      // Búsqueda global: origen, destino, ID, cliente, tarifa, comisión
      const matchesSearch = searchTerm === '' ||
        ruta.origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.id?.toString().includes(searchTerm) ||
        clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.tarifa?.toString().includes(searchTerm) ||
        ruta.comision?.toString().includes(searchTerm) ||
        ruta.kms?.toString().includes(searchTerm)

      // Filtro de cliente: comparar con el ID del cliente
      const rutaClienteId = ruta.cliente?.id || ruta.clienteId
      const matchesCliente = clienteFilter === '' || rutaClienteId?.toString() === clienteFilter

      return matchesSearch && matchesCliente
    })
    setFilteredRutas(filtered)
  }

  const handleCreateRuta = async (rutaData) => {
    try {
      await tarifasComisionesService.createRutaComision(rutaData)
      toast.success('Ruta comisión creada exitosamente')
      setShowCreateModal(false)
      loadRutasComisiones(currentPage)
    } catch (error) {
      toast.error(error.message || 'Error al crear ruta comisión')
      throw error
    }
  }

  const handleEditRuta = (ruta) => {
    setSelectedRuta(ruta)
    setShowEditModal(true)
  }

  const handleUpdateRuta = async (rutaId, rutaData) => {
    try {
      await tarifasComisionesService.updateRutaComision(rutaId, rutaData)
      toast.success('Ruta comisión actualizada exitosamente')
      setShowEditModal(false)
      setSelectedRuta(null)
      loadRutasComisiones(currentPage)
    } catch (error) {
      toast.error(error.message || 'Error al actualizar ruta comisión')
      throw error
    }
  }

  const handleViewRuta = (ruta) => {
    setSelectedRuta(ruta)
    setShowViewModal(true)
  }

  const handleDeleteRuta = (ruta) => {
    setSelectedRuta(ruta)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async (rutaId) => {
    try {
      await tarifasComisionesService.deleteRutaComision(rutaId)
      toast.success('Ruta comisión eliminada exitosamente')
      setShowDeleteModal(false)
      setSelectedRuta(null)
      loadRutasComisiones(currentPage)
    } catch (error) {
      toast.error(error.message || 'Error al eliminar ruta comisión')
    }
  }

  // Calcular estadísticas usando totalElements de la API cuando sea posible
  // Nota: comisionTotal y comisionPromedio solo pueden calcularse sobre los datos cargados actualmente
  // a menos que la API devuelva estos totales. Por ahora usaremos los datos cargados.
  const stats = {
    total: totalElements || rutasComisiones.length,
    clientes: clientes.length, // Total de clientes disponibles
    // Estas estadísticas son solo de la página actual, lo cual es una limitación conocida si no hay endpoint de stats
    comisionTotal: rutasComisiones.reduce((sum, r) => sum + parseFloat(r.comision || 0), 0),
    comisionPromedio: rutasComisiones.length > 0
      ? rutasComisiones.reduce((sum, r) => sum + parseFloat(r.comision || 0), 0) / rutasComisiones.length
      : 0
  }

  if (loading && rutasComisiones.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tarifas y Comisiones</h1>
          <p className="text-slate-600 mt-1">Gestión de comisiones por ruta y cliente</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva Comisión</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Rutas"
          value={stats.total}
          icon={MapPin}
          color="blue"
          description="Rutas configuradas"
        />
        <StatCard
          title="Total Clientes"
          value={stats.clientes}
          icon={Users}
          color="green"
          description="Clientes registrados"
        />
        {/* Opcional: Mostrar stats de página actual o eliminarlos si confunden */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por origen, destino, cliente, tarifa, kms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Cliente Filter */}
          <div>
            <select
              value={clienteFilter}
              onChange={(e) => setClienteFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Todos los clientes</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Mostrando <span className="font-semibold text-slate-900">{filteredRutas.length}</span> de{' '}
          <span className="font-semibold text-slate-900">{totalElements}</span> rutas
        </p>
      </div>

      {/* Rutas Grid */}
      {filteredRutas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No se encontraron rutas</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || clienteFilter
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza creando una nueva comisión por ruta'}
          </p>
          {!searchTerm && !clienteFilter && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear primera comisión
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRutas.map((ruta) => (
            <RutaComisionCard
              key={ruta.id}
              ruta={ruta}
              clientes={clientes}
              onEdit={handleEditRuta}
              onDelete={handleDeleteRuta}
              onViewDetails={handleViewRuta}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !searchTerm.trim() && !clienteFilter && (
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
      <CreateRutaComisionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRuta}
        clientes={clientes}
      />

      <EditRutaComisionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedRuta(null)
        }}
        onSubmit={handleUpdateRuta}
        ruta={selectedRuta}
        clientes={clientes}
      />

      <ViewRutaComisionModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedRuta(null)
        }}
        ruta={selectedRuta}
        clientes={clientes}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedRuta(null)
        }}
        onConfirm={handleConfirmDelete}
        ruta={selectedRuta}
      />
    </div>
  )
}
