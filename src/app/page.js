'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, Eye, EyeOff, Lock, Mail, ArrowRight, Shield, BarChart3, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from './services/authService'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('🔵 [FORM] Formulario enviado')
    console.log('📧 Email del formulario:', formData.email)
    
    setIsLoading(true)

    try {
      console.log('🔵 [FORM] Llamando a authService.login...')
      const data = await authService.login(formData.email, formData.password)
      
      console.log('✅ [FORM] Login exitoso, datos recibidos:', data)
      console.log('🔵 [FORM] Mostrando toast de bienvenida...')
      toast.success(`¡Bienvenido ${data.nombre}!`)
      
      console.log('🔵 [FORM] Redirigiendo a /dashboard...')
      router.push('/dashboard')
      console.log('✅ [FORM] Proceso de login completado')
    } catch (error) {
      console.error('❌ [FORM] Error en handleSubmit:')
      console.error('📍 Error completo:', error)
      console.error('📍 Error message:', error.message)
      toast.error(error.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      console.log('🔵 [FORM] Finalizando, setIsLoading(false)')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Panel Izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-50 border-r border-blue-200">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo y marca */}
          <div>
            <div className="flex items-center space-x-3 mb-16">
              <div className="w-11 h-11 bg-blue-900 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Fmpmex</h1>
              </div>
            </div>

            {/* Características */}
            <div className="space-y-8 max-w-md">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-3 leading-tight">
                  Sistema de Gestión<br />Logística Empresarial
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Plataforma integral para la administración y control de operaciones de transporte
                </p>
              </div>

              <div className="space-y-5 pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Seguridad empresarial</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Cumplimiento de estándares ISO 27001 y protección de datos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Analítica avanzada</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Reportes en tiempo real y KPIs de rendimiento operacional
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer del panel */}
          <div className="text-xs text-blue-500 border-t border-blue-200 pt-6">
            <p>© 2025 Fmpmex</p>
            <p className="mt-1">Todos los derechos reservados</p>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-900 rounded-xl mb-4">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-blue-900">Fmpmex</h1>
            <p className="text-xs text-blue-500 mt-1 font-medium">SISTEMA DE GESTIÓN LOGÍSTICA</p>
          </div>

          {/* Título del formulario */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Iniciar sesión</h2>
            <p className="text-slate-600">Accede a tu cuenta empresarial</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  placeholder="usuario@empresa.com"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-blue-900 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-11 pr-12 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>



            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-blue-900 hover:bg-blue-800 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group mt-8"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:tranblue-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
