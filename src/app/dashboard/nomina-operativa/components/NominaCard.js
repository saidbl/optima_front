import { MoreVertical, Eye, Edit, Trash2, User, Calendar, DollarSign, TrendingUp, FileDown } from 'lucide-react'
import { useState } from 'react'
import { viajesService } from '@/app/services/viajesService'
import { exportNominaOperativaPDF } from '@/utils/pdfExport'
import toast from 'react-hot-toast'

const NominaCard = ({ nomina, operadores, onEdit, onDelete, onViewDetails }) => {
    const [showMenu, setShowMenu] = useState(false)
    const [generatingPDF, setGeneratingPDF] = useState(false)

    const operador = operadores.find(op => op.id === nomina.operadorId)
    const operadorNombre = nomina.nombre || operador?.nombre || 'Operador desconocido'
    const operadorAlias = nomina.alias || operador?.alias || ''

    // Calcular el total neto
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
        // Agregar T00:00:00 para evitar problemas de zona horaria
        const date = new Date(dateString + 'T00:00:00')
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const handleGeneratePDF = async () => {
        setGeneratingPDF(true)
        const toastId = toast.loading('Generando recibo...')
        try {
            // Fetch viajes
            let viajes = []
            if (nomina.operadorId && nomina.periodoInicio && nomina.periodoFin) {
                viajes = await viajesService.getViajesByOperadorFechas(
                    nomina.operadorId,
                    nomina.periodoInicio,
                    nomina.periodoFin
                )
            }

            exportNominaOperativaPDF(nomina, operador, viajes)
            toast.success('Recibo generado', { id: toastId })
        } catch (error) {
            console.error('Error generating PDF:', error)
            toast.error('Error al generar recibo', { id: toastId })
        } finally {
            setGeneratingPDF(false)
            setShowMenu(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-lg truncate">
                                {operadorNombre}
                            </h3>
                            {operadorAlias && (
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Alias: {operadorAlias}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <MoreVertical className="h-5 w-5 text-slate-600" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                                    <button
                                        onClick={handleGeneratePDF}
                                        disabled={generatingPDF}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        <FileDown className="h-4 w-4" />
                                        <span>{generatingPDF ? 'Generando...' : 'Recibo Nomina'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onViewDetails(nomina)
                                            setShowMenu(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>Ver detalles</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onEdit(nomina)
                                            setShowMenu(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(nomina)
                                            setShowMenu(false)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Eliminar</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* Periodo */}
                <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">Periodo:</span>
                    <span className="font-medium text-slate-900">
                        {formatDate(nomina.periodoInicio)} - {formatDate(nomina.periodoFin)}
                    </span>
                </div>

                {/* Detalles financieras */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600 mb-1">Sueldo Base</p>
                        <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(nomina.sueldoBase)}
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-green-700 mb-1">Comisión Viajes</p>
                        <p className="text-sm font-semibold text-green-900">
                            {formatCurrency(nomina.comisionViajes)}
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-700 mb-1">Bonos</p>
                        <p className="text-sm font-semibold text-blue-900">
                            {formatCurrency(nomina.bono)}
                        </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-xs text-red-700 mb-1">Descuentos</p>
                        <p className="text-sm font-semibold text-red-900">
                            {formatCurrency(nomina.descuentos)}
                        </p>
                    </div>
                </div>

                {/* Número de viajes */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Viajes realizados:</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                        {nomina.numeroViajes || 0}
                    </span>
                </div>
            </div>

            {/* Footer - Total */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-slate-100 rounded-b-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">Total Neto:</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(totalNeto)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default NominaCard
