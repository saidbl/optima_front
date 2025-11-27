import { AlertTriangle, X } from 'lucide-react'

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, nomina }) => {
    if (!isOpen || !nomina) return null

    const handleConfirm = () => {
        onConfirm(nomina.id)
    }

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
            month: 'short',
            day: 'numeric'
        })
    }

    const totalNeto = (
        parseFloat(nomina.sueldoBase || 0) +
        parseFloat(nomina.comisionViajes || 0) +
        parseFloat(nomina.bono || 0) +
        parseFloat(nomina.compensacion || 0) -
        parseFloat(nomina.descuentos || 0)
    )

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-start space-x-3">
                        <div className="p-2.5 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900">Confirmar Eliminación</h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Esta acción no se puede deshacer
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-700">
                        ¿Estás seguro de que deseas eliminar esta nómina?
                    </p>

                    {/* Nomina Info */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Operador:</span>
                            <span className="text-sm font-semibold text-slate-900">{nomina.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Periodo:</span>
                            <span className="text-sm font-semibold text-slate-900">
                                {formatDate(nomina.periodoInicio)} - {formatDate(nomina.periodoFin)}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                            <span className="text-sm text-slate-600">Total:</span>
                            <span className="text-sm font-bold text-blue-600">{formatCurrency(totalNeto)}</span>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                            <strong>Advertencia:</strong> Esta nómina será eliminada permanentemente del sistema.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-200 flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal
