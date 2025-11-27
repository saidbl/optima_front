import { X, User, Calendar, DollarSign, Hash, FileText, CreditCard, TrendingUp } from 'lucide-react'

const ViewNominaModal = ({ isOpen, onClose, nomina, operadores }) => {
    if (!isOpen || !nomina) return null

    const operador = operadores.find(op => op.id === nomina.operadorId)
    const operadorNombre = nomina.nombre || operador?.nombre || 'Operador desconocido'
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

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">Detalles de Nómina</h2>
                            <p className="text-blue-100 mt-1">Información completa del registro</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Información del Operador */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2.5 bg-blue-100 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Información del Operador</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Nombre Completo</p>
                                <p className="font-semibold text-slate-900">{operadorNombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Alias</p>
                                <p className="font-semibold text-slate-900">{operadorAlias}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-slate-600 mb-1">Cuenta Bancaria</p>
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    <p className="font-semibold text-slate-900">{nomina.cuenta || 'No especificada'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Periodo */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2.5 bg-purple-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Periodo de Nómina</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Fecha de Inicio</p>
                                <p className="font-semibold text-slate-900">{formatDate(nomina.periodoInicio)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Fecha de Fin</p>
                                <p className="font-semibold text-slate-900">{formatDate(nomina.periodoFin)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detalles Financieros */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2.5 bg-green-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Detalles Financieros</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                <span className="text-slate-700">Sueldo Base</span>
                                <span className="font-semibold text-slate-900">{formatCurrency(nomina.sueldoBase)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                <span className="text-slate-700">Comisión por Viajes</span>
                                <span className="font-semibold text-green-600">{formatCurrency(nomina.comisionViajes)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                <span className="text-slate-700">Bonos</span>
                                <span className="font-semibold text-blue-600">{formatCurrency(nomina.bono)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                <span className="text-slate-700">Compensación</span>
                                <span className="font-semibold text-cyan-600">{formatCurrency(nomina.compensacion)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                <span className="text-slate-700">Descuentos</span>
                                <span className="font-semibold text-red-600">-{formatCurrency(nomina.descuentos)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Viajes y Total */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="h-5 w-5 text-orange-600" />
                                <p className="text-sm font-medium text-orange-900">Viajes Realizados</p>
                            </div>
                            <p className="text-3xl font-bold text-orange-600">{nomina.numeroViajes || 0}</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 border border-blue-300 shadow-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <DollarSign className="h-5 w-5 text-white" />
                                <p className="text-sm font-medium text-blue-100">Total Neto</p>
                            </div>
                            <p className="text-3xl font-bold text-white">{formatCurrency(totalNeto)}</p>
                        </div>
                    </div>

                    {/* Observaciones */}
                    {nomina.observaciones && (
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2.5 bg-slate-200 rounded-lg">
                                    <FileText className="h-5 w-5 text-slate-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Observaciones</h3>
                            </div>
                            <p className="text-slate-700 whitespace-pre-wrap">{nomina.observaciones}</p>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-600 mb-1">ID de Nómina</p>
                                <p className="font-semibold text-slate-900">#{nomina.id}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-1">Creado Por</p>
                                <p className="font-semibold text-slate-900">Usuario #{nomina.creadoPor}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white p-6 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ViewNominaModal
