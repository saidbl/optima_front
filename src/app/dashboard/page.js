'use client'

import { useState, useEffect } from 'react'
import { 
  Truck, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react'

const StatCard = ({ title, value, change, changeType, icon: Icon, color, description }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
        {description && (
          <p className="text-xs text-slate-500 mb-2">{description}</p>
        )}
        {change && (
          <div className={`flex items-center ${
            changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">{change}</span>
            <span className="text-xs text-slate-500 ml-1">vs mes anterior</span>
          </div>
        )}
      </div>
    </div>
  </div>
)

const RecentTrips = ({ trips }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200">
    <div className="p-6 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Servicios Recientes</h3>
        <Activity className="h-5 w-5 text-slate-400" />
      </div>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                trip.status === 'COMPLETED' ? 'bg-emerald-500' :
                trip.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                trip.status === 'PROGRAMMED' ? 'bg-amber-500' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="font-semibold text-slate-900">{trip.tripNumber}</p>
                <p className="text-sm text-slate-600">{trip.origin} → {trip.destination}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{trip.client}</p>
              <p className="text-xs text-slate-500">{trip.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const TasksWidget = ({ tasks }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200">
    <div className="p-6 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Alertas y Tareas</h3>
        <AlertTriangle className="h-5 w-5 text-slate-400" />
      </div>
    </div>
    <div className="p-6">
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              task.priority === 'high' ? 'bg-red-500' :
              task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{task.title}</p>
              <p className="text-xs text-slate-600 mt-1">{task.description}</p>
            </div>
            <div className="text-xs text-slate-400 whitespace-nowrap">
              {task.dueDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200">
    <div className="p-6 border-b border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900">Acciones Rápidas</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-center">
          <Truck className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Nuevo Servicio</span>
        </button>
        <button className="p-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-center">
          <FileText className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Carta Porte</span>
        </button>
        <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center">
          <Users className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Nuevo Cliente</span>
        </button>
        <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center">
          <BarChart3 className="h-6 w-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Ver Reportes</span>
        </button>
      </div>
    </div>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    vehiclesActive: 0
  })

  const [recentTrips, setRecentTrips] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulamos la carga de datos
    const loadDashboardData = async () => {
      try {
        setTimeout(() => {
          setStats({
            totalTrips: 156,
            activeTrips: 23,
            totalClients: 45,
            monthlyRevenue: 2875000,
            pendingInvoices: 12,
            vehiclesActive: 18
          })

          setRecentTrips([
            {
              id: 1,
              tripNumber: 'VJ-001234',
              origin: 'Ciudad de México',
              destination: 'Guadalajara',
              status: 'IN_PROGRESS',
              client: 'Empresa ABC',
              date: '15 Ene 2025'
            },
            {
              id: 2,
              tripNumber: 'VJ-001235',
              origin: 'Monterrey',
              destination: 'Tijuana',
              status: 'COMPLETED',
              client: 'Logística XYZ',
              date: '14 Ene 2025'
            },
            {
              id: 3,
              tripNumber: 'VJ-001236',
              origin: 'Puebla',
              destination: 'Veracruz',
              status: 'PROGRAMMED',
              client: 'Transportes DEF',
              date: '16 Ene 2025'
            }
          ])

          setTasks([
            {
              id: 1,
              title: 'Renovar póliza de seguro',
              description: 'Vehículo ABC-123 - Vence en 3 días',
              priority: 'high',
              dueDate: 'Hoy'
            },
            {
              id: 2,
              title: 'Factura pendiente de envío',
              description: 'Cliente Empresa ABC - $45,000 MXN',
              priority: 'medium',
              dueDate: 'Mañana'
            },
            {
              id: 3,
              title: 'Mantenimiento programado',
              description: 'Vehículo XYZ-789 - Revisión 10,000 km',
              priority: 'low',
              dueDate: 'En 3 días'
            }
          ])

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-slate-600 mt-2">Resumen ejecutivo de operaciones</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Servicios Activos"
          value={stats.activeTrips}
          change="+12%"
          changeType="positive"
          icon={Truck}
          color="bg-slate-600"
          description="En ruta actualmente"
        />
        <StatCard
          title="Clientes Activos"
          value={stats.totalClients}
          change="+8%"
          changeType="positive"
          icon={Users}
          color="bg-emerald-600"
          description="Base de clientes"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${(stats.monthlyRevenue / 1000000).toFixed(1)}M`}
          change="+15%"
          changeType="positive"
          icon={DollarSign}
          color="bg-blue-600"
          description="Facturación mensual"
        />
        <StatCard
          title="Facturas Pendientes"
          value={stats.pendingInvoices}
          change="-5%"
          changeType="positive"
          icon={FileText}
          color="bg-amber-500"
          description="Por cobrar"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Estado de Servicios</h3>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">En Ruta</span>
              <span className="text-sm font-semibold text-blue-600">{stats.activeTrips}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Completados</span>
              <span className="text-sm font-semibold text-emerald-600">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Programados</span>
              <span className="text-sm font-semibold text-amber-600">44</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Flota Vehicular</h3>
            <Truck className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Activos</span>
              <span className="text-sm font-semibold text-emerald-600">{stats.vehiclesActive}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">En Mantenimiento</span>
              <span className="text-sm font-semibold text-amber-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Fuera de Servicio</span>
              <span className="text-sm font-semibold text-red-600">1</span>
            </div>
          </div>
        </div>

        <QuickActions />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTrips trips={recentTrips} />
        </div>
        <div>
          <TasksWidget tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
export default Dashboard;