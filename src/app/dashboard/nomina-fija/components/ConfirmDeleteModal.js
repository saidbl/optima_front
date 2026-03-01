import { X } from 'lucide-react'

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, nomina }) => {
    if (!isOpen || !nomina) return null

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900">Confirmar Eliminación</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-slate-600" />
                        </button>
                    </div>

                    <p className="text-slate-600 mb-6">
                        ¿Estás seguro de que deseas eliminar la nómina de <span className="font-semibold text-slate-900">{nomina.nombre}</span>?
                        Esta acción no se puede deshacer.
                    </p>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => onConfirm(nomina.id)}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal
