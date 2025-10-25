'use client'

import { 
  Home, 
  Truck, 
  Users, 
  FileText, 
  Calculator, 
  Route, 
  Shield, 
  DollarSign, 
  Quote, 
  Settings, 
  Building2, 
  FolderOpen, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  MapPin,
  BarChart3,
  CreditCard,
  Wrench,
  Coins,
  ToolCase,
  CoinsIcon,
  User2,
  Users2,
  ToolCaseIcon
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tooltip } from 'recharts'

// Páginas que actualmente existen en el proyecto
const availablePages = [
  '/dashboard',
  '/dashboard/clients',
  '/dashboard/usuarios',
  '/dashboard/clientes',
  '/dashboard/operadores',
  '/dashboard/pagos',
  '/dashboard/roles',
  '/dashboard/viajes',
  '/dashboard/bitacora',
  '/dashboard/unidades',
]

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    title: 'Bitácora',
    icon: FileText,
    children: [
      { title: 'Bitácora de viaje detallada', href: '/dashboard/carta-portes' },
      { title: 'Bitácora de viaje', href: '/dashboard/bitacora' },
      { title: 'Bitácora contable', href: '/dashboard/compliance' },
    ]
  },
  {
    title: 'Nómina',
    icon: Coins,
    children: [
      { title: 'Pagos', href: '/dashboard/pagoss' },
      { title: 'Operadores', href: '/dashboard/operadores' }
    ]
  },
  {
    title: 'Cartas porte',
    icon: DollarSign,
    children: [
      { title: 'Cartas porte', href: '/dashboard/quotes' }
    ]
  },
  {
    title: 'Ruta de viaje',
    icon: Truck,
    children: [
      { title: 'Visualización de gps', href: '/dashboard/insurance' },
      { title: 'Viajes', href: '/dashboard/viajes' }
    ]
  },
  {
    title: 'Mantenimiento',
    icon: ToolCase,
    children: [
      { title: 'Mantenimiento de refacciones', href: '/dashboard/insurance' },
      { title: 'Renovación de seguros', href: '/dashboard/licenses' },
      { title: 'Mantenimiento proveedor', href: '/dashboard/maintenance' },
      { title: 'Mantenimiento unidad', href: '/dashboard/unidades' },

    ]
  },
  {
    title: 'Facturación',
    icon: CoinsIcon,
    children: [
      { title: 'Factura de viaje', href: '/dashboard/insurance' },
      { title: 'Factura de cliente', href: '/dashboard/licenses' },
      { title: 'Factura de pagos', href: '/dashboard/maintenance' },
      { title: 'Factura de costos extra', href: '/dashboard/vehicles' },
    ]
  },
  {
    title: 'Almacén',
    icon: Building2,
    children: [
      { title: 'Opción 1', href: '/dashboard/insurance' },
      { title: 'Opción 2', href: '/dashboard/licenses' },
      { title: 'Opción 3', href: '/dashboard/maintenance' }

    ]
  },
  {
    title: 'Clientes',
    icon: Users2,
    href: '/dashboard/clientes',
  },
  {
    title: 'Usuarios',
    icon: Users,
    href: '/dashboard/usuarios',
  },
  {
    title: 'Configuración',
    icon: Settings,
    children: [
      { title: 'Roles', href: '/dashboard/roles' }

    ]
  },
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState(new Set())
  const pathname = usePathname()

  const toggleExpanded = (title) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href) => {
    return pathname === href
  }

  const hasActiveChild = (children) => {
    return children?.some(child => pathname === child.href)
  }

  const isPageAvailable = (href) => {
    return availablePages.includes(href)
  }

  return (
    <div className="bg-white text-gray-800 w-64 min-h-screen flex flex-col border-r border-gray-200 shadow-lg">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Optima transportes</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.has(item.title)
          const hasChildren = item.children && item.children.length > 0
          const pageAvailable = !hasChildren && isPageAvailable(item.href)

          return (
            <div key={item.title}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    hasActiveChild(item.children)
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-3 transition-colors" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </button>
              ) : (
                pageAvailable ? (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700 shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3 transition-colors" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                ) : (
                  <div
                    className="flex items-center px-3 py-2.5 rounded-lg cursor-not-allowed opacity-60"
                  >
                    <Icon className="h-4 w-4 mr-3 text-red-500" />
                    <span className="font-medium text-sm text-red-500">{item.title}</span>
                    <span className="ml-auto text-xs text-red-400">(No disponible)</span>
                  </div>
                )
              )}

              {hasChildren && isExpanded && (
                <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-3">
                  {item.children.map((child) => {
                    const childAvailable = isPageAvailable(child.href)
                    
                    return childAvailable ? (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          isActive(child.href)
                            ? 'bg-blue-100 text-blue-700 font-medium '
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        {child.title}
                      </Link>
                    ) : (
                      <div
                        key={child.href}
                        className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-not-allowed opacity-60"
                      >
                        <span className="text-red-500">{child.title}</span>
                        <span className="text-xs text-red-400">N/D</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Settings className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700">Sistema</p>
              <p className="text-xs text-gray-500">v1.0.0(BETA)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}