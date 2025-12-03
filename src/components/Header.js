'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, User, LogOut, ChevronDown, Menu, AlertCircle, FileText, Banknote, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/app/services/authService'
import { facturaService } from '@/app/services/facturaService'
import { operadoresService } from '@/app/services/operadoresService'
import { getRoleDisplayName } from '@/config/permissions'

export function Header({ onMenuClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const router = useRouter()
  const userMenuRef = useRef(null)
  const notificationRef = useRef(null)

  // Cargar usuario de forma memoizada
  const user = useMemo(() => {
    if (typeof window !== 'undefined') {
      return authService.getUser()
    }
    return null
  }, [])

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user || (user.rol !== 'ADMIN' && user.rol !== 'NOMINA')) return

    try {
      setLoadingNotifications(true)
      const [facturasExtraRes, liquidacionRes, operadoresRes] = await Promise.allSettled([
        facturaService.getFacturasExtraByEstatus('PENDIENTE', 0, 50),
        facturaService.getFacturasByTipo('SIN_FACTURA', 0, 50),
        operadoresService.getOperadores(0, 100)
      ])

      const newNotifications = []

      // 1. Facturas Extra Pendientes
      if (facturasExtraRes.status === 'fulfilled' && facturasExtraRes.value?.content) {
        facturasExtraRes.value.content.forEach(factura => {
          newNotifications.push({
            id: `fe-${factura.id}`,
            title: 'Factura Extra Pendiente',
            message: `Factura ${factura.folio || factura.id} pendiente de pago`,
            type: 'warning',
            date: new Date(factura.fechaEmision || Date.now()),
            link: '/dashboard/facturas/extra',
            icon: FileText,
            color: 'text-orange-500 bg-orange-50'
          })
        })
      }

      // 2. Liquidación Efectivo (Pendientes)
      if (liquidacionRes.status === 'fulfilled' && liquidacionRes.value?.content) {
        liquidacionRes.value.content.forEach(factura => {
          if (factura.estatus === 'PENDIENTE' || factura.estatus === 'VENCIDA') {
            const isVencida = factura.estatus === 'VENCIDA'
            newNotifications.push({
              id: `le-${factura.id}`,
              title: isVencida ? 'Liquidación Vencida' : 'Liquidación Pendiente',
              message: `Liquidación ${factura.numeroFactura} ${isVencida ? 'vencida' : 'pendiente'}`,
              type: isVencida ? 'error' : 'info',
              date: new Date(factura.fechaEmision || Date.now()),
              link: '/dashboard/liquidacion_efectivo',
              icon: Banknote,
              color: isVencida ? 'text-red-500 bg-red-50' : 'text-blue-500 bg-blue-50'
            })
          }
        })
      }

      // 3. Operadores (Licencias)
      if (operadoresRes.status === 'fulfilled' && operadoresRes.value?.content) {
        const today = new Date()
        const warningDate = new Date()
        warningDate.setDate(today.getDate() + 30) // Avisar 30 días antes

        operadoresRes.value.content.forEach(op => {
          if (op.licenciaVencimiento) {
            const vencimiento = new Date(op.licenciaVencimiento)

            if (vencimiento < today) {
              newNotifications.push({
                id: `op-v-${op.id}`,
                title: 'Licencia Vencida',
                message: `La licencia de ${op.nombre} ha vencido`,
                type: 'error',
                date: vencimiento,
                link: '/dashboard/operadores',
                icon: AlertCircle,
                color: 'text-red-500 bg-red-50'
              })
            } else if (vencimiento <= warningDate) {
              const daysLeft = Math.ceil((vencimiento - today) / (1000 * 60 * 60 * 24))
              newNotifications.push({
                id: `op-w-${op.id}`,
                title: 'Licencia por Vencer',
                message: `Licencia de ${op.nombre} vence en ${daysLeft} días`,
                type: 'warning',
                date: vencimiento,
                link: '/dashboard/operadores',
                icon: Clock,
                color: 'text-yellow-500 bg-yellow-50'
              })
            }
          }
        })
      }

      // Ordenar por fecha (más recientes primero, aunque para vencimientos quizás sea mejor las más urgentes)
      // Prioridad: Error > Warning > Info
      newNotifications.sort((a, b) => {
        const priority = { error: 3, warning: 2, info: 1 }
        if (priority[a.type] !== priority[b.type]) {
          return priority[b.type] - priority[a.type]
        }
        return b.date - a.date
      })

      setNotifications(newNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user])

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    if (showUserMenu || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, showNotifications])

  const handleSignOut = () => {
    authService.logout()
    toast.success('Sesión cerrada correctamente')
    router.push('/')
  }

  const handleNotificationClick = (notification) => {
    setShowNotifications(false)
    router.push(notification.link)
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-end px-4 lg:px-6 py-3 lg:py-4">
        {/* Botón menú móvil */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-slate-600" />
        </button>

        <div className="flex items-center space-x-2 lg:space-x-4 ml-auto lg:ml-6">
          {/* Mostrar notificaciones solo para ADMIN y NOMINA */}
          {user?.rol && (user.rol === 'ADMIN' || user.rol === 'NOMINA') && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 lg:p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 lg:top-2 lg:right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">Notificaciones</h3>
                    <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      {notifications.length} nuevas
                    </span>
                  </div>

                  {loadingNotifications ? (
                    <div className="p-4 text-center text-slate-500 text-sm">
                      Cargando...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Bell className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="text-slate-500 text-sm">No tienes notificaciones nuevas</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notification) => {
                        const Icon = notification.icon
                        return (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                          >
                            <div className={`mt-1 p-2 rounded-lg ${notification.color} shrink-0`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {notification.date.toLocaleDateString()}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 lg:space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all group"
              suppressHydrationWarning
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-linear-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              <div className="text-left hidden lg:block" suppressHydrationWarning>
                <p className="text-sm font-semibold text-slate-700">
                  {user?.nombre || 'Usuario'}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.rol ? getRoleDisplayName(user.rol) : 'Usuario'}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-700">{user?.nombre || 'Usuario'}</p>
                  <p className="text-xs text-slate-500">{user?.email || 'usuario@optima.com'}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    {user?.rol ? getRoleDisplayName(user.rol) : 'Usuario'}
                  </p>
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex cursor-pointer items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


    </header>
  )
}
