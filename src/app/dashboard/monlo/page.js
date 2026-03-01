'use client'

import { useState } from 'react'
import { ExternalLink, AlertCircle, RefreshCw } from 'lucide-react'

export default function MonloPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleReload = () => {
    setIsLoading(true)
    setHasError(false)
    // Forzar recarga del iframe
    const iframe = document.getElementById('monlo-iframe')
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <ExternalLink className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monlo</h1>
            <p className="text-sm text-gray-500">monlo.mx</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recargar</span>
          </button>

          <a
            href="https://monlo.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Abrir en nueva pestaña</span>
          </a>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando Monlo...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md px-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No se pudo cargar Monlo
            </h2>
            <p className="text-gray-600 mb-6">
              Puede que el sitio web no permita ser embebido. 
              Intenta abrir en una nueva pestaña o recarga la página.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleReload}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reintentar</span>
              </button>
              <a
                href="https://monlo.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Abrir en nueva pestaña</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Iframe Container */}
      <div className="flex-1 relative">
        <iframe
          id="monlo-iframe"
          src="https://monlo.mx"
          className="w-full h-full border-0"
          title="Monlo"
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
