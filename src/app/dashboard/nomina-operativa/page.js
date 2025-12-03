'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, DollarSign, Users, TrendingUp, Wallet, Calendar } from 'lucide-react'
import nominaOperativaService from '@/app/services/nominaOperativaService'
import { operadoresService } from '@/app/services/operadoresService'
import toast from 'react-hot-toast'
import {
    StatCard,
    NominaCard,
    CreateNominaModal,
    EditNominaModal,
    ViewNominaModal,
    ConfirmDeleteModal
} from './components'

export default function NominaOperativaPage() {
    const [nominas, setNominas] = useState([])
    const [operadores, setOperadores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [operadorFilter, setOperadorFilter] = useState('')
    const [periodoFilter, setPeriodoFilter] = useState('')

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedNomina, setSelectedNomina] = useState(null)

    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        try {
            setLoading(true)
            await Promise.all([
                loadNominas(),
                loadOperadores()
            ])
        } catch (error) {
            console.error('Error loading initial data:', error)
            toast.error('Error al cargar datos iniciales')
        } finally {
            setLoading(false)
        }
    }

    const loadNominas = async () => {
        try {
            const data = await nominaOperativaService.getNominas(0, 1000)
            setNominas(data.content || data || [])
        } catch (error) {
            console.error('Error loading nominas:', error)
            toast.error('Error al cargar nóminas')
        }
    }

    const loadOperadores = async () => {
        try {
            const data = await operadoresService.getOperadores(0, 1000)
            setOperadores(data.content || data || [])
        } catch (error) {
            console.error('Error loading operadores:', error)
        }
    }

    const handleCreateNomina = async (nominaData) => {
        try {
            await nominaOperativaService.createNomina(nominaData)
            toast.success('Nómina creada exitosamente')
            setShowCreateModal(false)
            loadNominas()
        } catch (error) {
            toast.error(error.message || 'Error al crear nómina')
            throw error
        }
    }

    const handleEditNomina = (nomina) => {
        setSelectedNomina(nomina)
        setShowEditModal(true)
    }

    const handleUpdateNomina = async (nominaId, nominaData) => {
        try {
            await nominaOperativaService.updateNomina(nominaId, nominaData)
            toast.success('Nómina actualizada exitosamente')
            setShowEditModal(false)
            setSelectedNomina(null)
            loadNominas()
        } catch (error) {
            toast.error(error.message || 'Error al actualizar nómina')
            throw error
        }
    }

    const handleViewNomina = (nomina) => {
        setSelectedNomina(nomina)
        setShowViewModal(true)
    }

    const handleDeleteNomina = (nomina) => {
        setSelectedNomina(nomina)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = async (nominaId) => {
        try {
            await nominaOperativaService.deleteNomina(nominaId)
            toast.success('Nómina eliminada exitosamente')
            setShowDeleteModal(false)
            setSelectedNomina(null)
            loadNominas()
        } catch (error) {
            toast.error(error.message || 'Error al eliminar nómina')
        }
    }

    // Calcular estadísticas
    const stats = {
        total: nominas.length,
        operadores: new Set(nominas.map(n => n.operadorId)).size,
        totalPagado: nominas.reduce((sum, n) => {
            const total = (
                parseFloat(n.sueldoBase || 0) +
                parseFloat(n.comisionViajes || 0) +
                parseFloat(n.bono || 0) +
                parseFloat(n.compensacion || 0) -
                parseFloat(n.descuentos || 0)
            )
            return sum + total
        }, 0),
        totalViajes: nominas.reduce((sum, n) => sum + parseInt(n.numeroViajes || 0), 0),
        promedioPorNomina: nominas.length > 0
            ? nominas.reduce((sum, n) => {
                const total = (
                    parseFloat(n.sueldoBase || 0) +
                    parseFloat(n.comisionViajes || 0) +
                    parseFloat(n.bono || 0) +
                    parseFloat(n.compensacion || 0) -
                    parseFloat(n.descuentos || 0)
                )
                return sum + total
            }, 0) / nominas.length
            : 0
    }

    // Filtrar nóminas
    const filteredNominas = nominas.filter(nomina => {
        // Obtener el nombre del operador
        const operadorNombre = nomina.nombre ||
            operadores.find(op => op.id === nomina.operadorId)?.nombre ||
            ''

        // Búsqueda global
        const matchesSearch = searchTerm === '' ||
            operadorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nomina.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nomina.id?.toString().includes(searchTerm) ||
            nomina.observaciones?.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro de operador
        const matchesOperador = operadorFilter === '' || nomina.operadorId?.toString() === operadorFilter

        // Filtro de periodo (mes/año)
        const matchesPeriodo = periodoFilter === '' ||
            nomina.periodoInicio?.startsWith(periodoFilter)

        return matchesSearch && matchesOperador && matchesPeriodo
    })

    // Obtener periodos únicos para el filtro
    const periodos = [...new Set(nominas.map(n => {
        if (n.periodoInicio) {
            const date = new Date(n.periodoInicio)
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        }
        return null
    }).filter(Boolean))].sort().reverse()

    if (loading) {
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
                    <h1 className="text-3xl font-bold text-slate-900">Nómina Operativa</h1>
                    <p className="text-slate-600 mt-1">Gestión de nóminas para operadores</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
                >
                    <Plus className="h-5 w-5" />
                    <span>Nueva Nómina</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <StatCard
                    title="Total Nóminas"
                    value={stats.total}
                    icon={Wallet}
                    color="blue"
                    description="Registros totales"
                />
                <StatCard
                    title="Total Pagado"
                    value={`$${stats.totalPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    color="green"
                    description="Suma de todas las nóminas"
                />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por operador, alias, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Operador Filter */}
                    <div>
                        <select
                            value={operadorFilter}
                            onChange={(e) => setOperadorFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                            <option value="">Todos los operadores</option>
                            {operadores.map((operador) => (
                                <option key={operador.id} value={operador.id}>
                                    {operador.nombre} {operador.alias ? `(${operador.alias})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Periodo Filter */}
                    <div>
                        <select
                            value={periodoFilter}
                            onChange={(e) => setPeriodoFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                            <option value="">Todos los periodos</option>
                            {periodos.map((periodo) => {
                                const [year, month] = periodo.split('-')
                                const monthName = new Date(year, parseInt(month) - 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
                                return (
                                    <option key={periodo} value={periodo}>
                                        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    Mostrando <span className="font-semibold text-slate-900">{filteredNominas.length}</span> de{' '}
                    <span className="font-semibold text-slate-900">{nominas.length}</span> nóminas
                </p>
            </div>

            {/* Nominas Grid */}
            {filteredNominas.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <Wallet className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No se encontraron nóminas</h3>
                    <p className="text-slate-600 mb-6">
                        {searchTerm || operadorFilter || periodoFilter
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza creando una nueva nómina operativa'}
                    </p>
                    {!searchTerm && !operadorFilter && !periodoFilter && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Crear primera nómina
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNominas.map((nomina) => (
                        <NominaCard
                            key={nomina.id}
                            nomina={nomina}
                            operadores={operadores}
                            onEdit={handleEditNomina}
                            onDelete={handleDeleteNomina}
                            onViewDetails={handleViewNomina}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <CreateNominaModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateNomina}
                operadores={operadores}
            />

            <EditNominaModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setSelectedNomina(null)
                }}
                onSubmit={handleUpdateNomina}
                nomina={selectedNomina}
                operadores={operadores}
            />

            <ViewNominaModal
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false)
                    setSelectedNomina(null)
                }}
                nomina={selectedNomina}
                operadores={operadores}
            />

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setSelectedNomina(null)
                }}
                onConfirm={handleConfirmDelete}
                nomina={selectedNomina}
            />
        </div>
    )
}
