import { X, User, Calendar, DollarSign, Hash, FileText, CreditCard, TrendingUp, Wallet, MapPin, Package, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usersService } from '@/app/services/usersService'
import { viajesService } from '@/app/services/viajesService'

const ViewNominaModal = ({ isOpen, onClose, nomina, operadores }) => {
    const [creadorNombre, setCreadorNombre] = useState('Cargando...')
    const [viajes, setViajes] = useState([])
    const [loadingViajes, setLoadingViajes] = useState(false)
    const [showViajes, setShowViajes] = useState(false)

    useEffect(() => {
        const fetchCreador = async () => {
            if (nomina?.creadoPor) {
                try {
                    const usuario = await usersService.getUserById(nomina.creadoPor)
                    setCreadorNombre(usuario.nombre || 'Usuario desconocido')
                } catch (error) {
                    console.error('Error al cargar usuario:', error)
                    setCreadorNombre('Usuario no encontrado')
                }
            }
        }

        const fetchViajes = async () => {
            if (nomina?.operadorId && nomina?.periodoInicio && nomina?.periodoFin) {
                try {
                    setLoadingViajes(true)
                    const viajesData = await viajesService.getViajesByOperadorFechas(
                        nomina.operadorId,
                        nomina.periodoInicio,
                        nomina.periodoFin
                    )
                    setViajes(viajesData || [])
                } catch (error) {
                    console.error('Error al cargar viajes:', error)
                    setViajes([])
                } finally {
                    setLoadingViajes(false)
                }
            }
        }

        if (isOpen && nomina) {
            fetchCreador()
            fetchViajes()
        }
    }, [isOpen, nomina])

    if (!isOpen || !nomina) return null

    const operador = operadores.find(op => op.id === nomina.operadorId)
    const operadorNombre = operador?.nombre || 'Operador desconocido'
    const operadorAlias = nomina.alias || operador?.alias || 'N/A'

    const totalNeto = (
        parseFloat(nomina.sueldoBase || 0) +
        parseFloat(nomina.comisionViajes || 0) +
        parseFloat(nomina.bono || 0) +
        parseFloat(nomina.compensacion || 0) -
        parseFloat(nomina.descuentos || 0)
    )

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(value || 0)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatShortDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('es-MX', {
            month: 'short',
            day: 'numeric'
        })
    }

    const getEstadoBadge = (estado) => {
        const badges = {
            'PENDIENTE': 'bg-yellow-100 text-yellow-800',
            'EN_TRANSITO': 'bg-blue-100 text-blue-800',
            'COMPLETADO': 'bg-green-100 text-green-800',
            'CANCELADO': 'bg-red-100 text-red-800'
        }
        return badges[estado] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Detalles de Nómina</h2>
                            <p className="text-sm text-slate-600 mt-1">Información completa del registro</p>
                        </div>
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
                            <Wallet className="h-7 w-7 text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {/* Información del Operador */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Información del Operador
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500">Nombre Completo</label>
                                <p className="text-sm text-slate-900 mt-1 font-semibold">{operadorNombre}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Alias</label>
                                <p className="text-sm text-slate-900 mt-1">{operadorAlias}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Cuenta Bancaria</label>
                                <p className="text-sm text-slate-900 mt-1 flex items-center">
                                    <CreditCard className="h-3 w-3 mr-1 text-slate-400" />
                                    {nomina.cuenta || 'No especificada'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Periodo */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Periodo de Nómina
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <label className="text-xs font-medium text-slate-500">Fecha de Inicio</label>
                                <p className="text-sm text-slate-900 mt-1 font-semibold">{formatDate(nomina.periodoInicio)}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <label className="text-xs font-medium text-slate-500">Fecha de Fin</label>
                                <p className="text-sm text-slate-900 mt-1 font-semibold">{formatDate(nomina.periodoFin)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detalles Financieros */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Detalles Financieros
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500">Sueldo Base</label>
                                <p className="text-sm text-slate-900 mt-1 font-semibold">{formatCurrency(nomina.sueldoBase)}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Comisión por Viajes</label>
                                <p className="text-sm text-green-600 mt-1 font-semibold">{formatCurrency(nomina.comisionViajes)}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Bonos</label>
                                <p className="text-sm text-blue-600 mt-1 font-semibold">{formatCurrency(nomina.bono)}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Compensación</label>
                                <p className="text-sm text-cyan-600 mt-1 font-semibold">{formatCurrency(nomina.compensacion)}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Descuentos</label>
                                <p className="text-sm text-red-600 mt-1 font-semibold">-{formatCurrency(nomina.descuentos)}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500">Número de Viajes</label>
                                <p className="text-sm text-slate-900 mt-1 font-semibold flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1 text-orange-600" />
                                    {nomina.numeroViajes || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Neto */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Neto</p>
                                <p className="text-xs text-slate-500 mt-0.5">Sueldo + Comisiones + Bonos - Descuentos</p>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalNeto)}</p>
                        </div>
                    </div>

                    {/* Viajes del Período */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setShowViajes(!showViajes)}
                            className="w-full bg-slate-50 hover:bg-slate-100 transition-colors p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-slate-700" />
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Viajes del Período ({loadingViajes ? '...' : viajes.length})
                                </h3>
                            </div>
                            {showViajes ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                        </button>

                        {showViajes && (
                            <div className="p-4 bg-white">
                                {loadingViajes ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-sm text-slate-500 mt-2">Cargando viajes...</p>
                                    </div>
                                ) : viajes.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">No hay viajes en este período</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {viajes.map((viaje, index) => (
                                            <div
                                                key={viaje.viajeId || `viaje-${index}`}
                                                className="border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-mono text-slate-500">#{viaje.viajeId}</span>
                                                            {viaje.folio && (
                                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                                                                    {viaje.folio}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center text-sm text-slate-700 mb-1">
                                                            <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                                                            <span className="font-medium">{viaje.ruta || 'Ruta no especificada'}</span>
                                                        </div>
                                                        {viaje.cliente && (
                                                            <div className="flex items-center text-xs text-slate-600">
                                                                <User className="h-3 w-3 mr-1 text-slate-400" />
                                                                <span>Cliente: {viaje.cliente}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {viaje.comision && (
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500">Comisión</p>
                                                            <p className="text-sm font-semibold text-green-600">
                                                                {formatCurrency(viaje.comision)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                {viaje.observaciones && (
                                                    <div className="mt-2 pt-2 border-t border-slate-100">
                                                        <p className="text-xs text-slate-600">{viaje.observaciones}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Observaciones */}
                    {nomina.observaciones && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Observaciones
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{nomina.observaciones}</p>
                            </div>
                        </div>
                    )}

                    {/* Información del Sistema */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                            <Hash className="h-4 w-4 mr-2" />
                            Información del Sistema
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500">Creado Por</label>
                                <p className="text-sm text-slate-900 mt-1">{creadorNombre}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
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

export default ViewNominaModal
