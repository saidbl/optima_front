'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, User, LogOut, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/app/services/authService'

export function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  // Lazy initialization - solo se ejecuta una vez en el cliente
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return authService.getUser()
    }
    return null
  })
  const router = useRouter()
  const userMenuRef = useRef(null)

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleSignOut = () => {
    authService.logout()
    toast.success('Sesión cerrada correctamente')
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar servicios, clientes, vehículos, documentos..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <button className="relative p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all group"
              suppressHydrationWarning
            >
              <div className="w-10 h-10 bg-linear-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-left hidden sm:block" suppressHydrationWarning>
                <p className="text-sm font-semibold text-slate-700" suppressHydrationWarning>
                  {user?.nombre || 'Usuario'}
                </p>
                <p className="text-xs text-slate-500" suppressHydrationWarning>
                  {user?.rol?.[0]?.replace('ROLE_', '') || 'Usuario'}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-700">{user?.nombre || 'Usuario'}</p>
                  <p className="text-xs text-slate-500">{user?.email || 'usuario@optima.com'}</p>
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
