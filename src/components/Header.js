'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, User, LogOut, ChevronDown, Menu, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/app/services/authService'
import { alertsService } from '@/app/services/alertsService'
import { getRoleDisplayName } from '@/config/permissions'

export function Header({ onMenuClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [alertCount, setAlertCount] = useState(0)
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

  // Obtener solo el conteo para la campana
  const fetchAlertCount = async () => {
    if (!user) return
    try {
      const count = await alertsService.getAlertsCount()
      setAlertCount(count)
    } catch (error) {
      console.error('Error getting alert count:', error)
    }
  }

  // Obtener la lista completa de alertas
  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoadingNotifications(true)
      const activeAlerts = await alertsService.getActiveAlerts()

      // Mapear respuesta de API al formato de notificaciones
      const mappedNotifications = activeAlerts.map(alerta => ({
        id: alerta.id,
        title: alerta.titulo || 'Notificación',
        message: alerta.mensaje || alerta.descripcion || '',
        type: (alerta.tipo || 'INFO').toLowerCase(), // Asumimos WARNING, ERROR, INFO
        date: new Date(alerta.fechaCreacion || Date.now()),
        link: alerta.enlace || '#', // Enlace opcional
        icon: getIconForType(alerta.tipo),
        color: getColorForType(alerta.tipo)
      }))

      setNotifications(mappedNotifications)
      // Actualizar el count también por si acaso
      setAlertCount(mappedNotifications.length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setNotifications([])
    } finally {
      setLoadingNotifications(false)
    }
  }

  const getIconForType = (type) => {
    switch (type?.toUpperCase()) {
      case 'ERROR': return AlertCircle
      case 'WARNING': return Clock
      case 'SUCCESS': return CheckCircle
      default: return Bell
    }
  }

  const getColorForType = (type) => {
    switch (type?.toUpperCase()) {
      case 'ERROR': return 'text-red-500 bg-red-50'
      case 'WARNING': return 'text-yellow-500 bg-yellow-50'
      case 'SUCCESS': return 'text-green-500 bg-green-50'
      default: return 'text-blue-500 bg-blue-50'
    }
  }

  // Polling para el contador
  useEffect(() => {
    fetchAlertCount()
    const interval = setInterval(fetchAlertCount, 60 * 1000) // Cada minuto
    return () => clearInterval(interval)
  }, [user])

  // Cargar lista cuando se abre el menú
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
    }
  }, [showNotifications])

  // ... (click outside effect remains) ...

  // ... (handleSignOut remains) ...

  const handleNotificationClick = async (notification) => {
    try {
      await alertsService.markAsAttended(notification.id)
      // Actualizar lista localmente
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
      setAlertCount(prev => Math.max(0, prev - 1))

      setShowNotifications(false)
      if (notification.link && notification.link !== '#') {
        router.push(notification.link)
      }
    } catch (error) {
      console.error('Error marking alert as attended:', error)
      // Navegar de todos modos?
      if (notification.link && notification.link !== '#') {
        router.push(notification.link)
      }
    }
  }

  const handleSignOut = () => {
  authService.logout()
  toast.success('Sesión cerrada')
  router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-end px-4 lg:px-6 py-3 lg:py-4">
        {/* ... (mobile menu button) ... */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-slate-600" />
        </button>

        <div className="flex items-center space-x-2 lg:space-x-4 ml-auto lg:ml-6">
          {/* Mostrar notificaciones para todos o roles específicos? Usuario dijo "obvio quita las alertas que usabamos antes" */}
          {user?.rol && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 lg:p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Bell className="h-5 w-5" />
                {alertCount > 0 && (
                  <span className="absolute top-1 right-1 lg:top-2 lg:right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">Notificaciones</h3>
                    <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      {alertCount} nuevas
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
                        const Icon = notification.icon || Bell
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

          {/* ... User Menu ... */}

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


    </header >
  )
}
