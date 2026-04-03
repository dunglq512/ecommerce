import { createClient } from '@/lib/supabase/server'
import { 
  Package, 
  Layers, 
  ShoppingCart, 
  TrendingUp,
  ArrowUpRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { DashboardCharts } from './dashboard-charts'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // 1. Fetch counts
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: collectionsCount } = await supabase
    .from('collections')
    .select('*', { count: 'exact', head: true })

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // 2. Fetch Stats for Chart (Last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setHours(0, 0, 0, 0)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: chartOrders } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // 3. Process data for Chart
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  const chartDataMap = new Map()
  
  // Initialize last 7 days including today
  for (let i = 6; i >= 0; i--) {
     const date = new Date()
     date.setDate(date.getDate() - i)
     const dayName = days[date.getDay()]
     chartDataMap.set(dayName, { name: dayName, sales: 0, orders: 0 })
  }

  chartOrders?.forEach(order => {
     const date = new Date(order.created_at)
     const dayName = days[date.getDay()]
     if (chartDataMap.has(dayName)) {
        const current = chartDataMap.get(dayName)
        chartDataMap.set(dayName, {
           ...current,
           sales: current.sales + Number(order.total_amount),
           orders: current.orders + 1
        })
     }
  })

  const chartData = Array.from(chartDataMap.values())

  const stats = [
    { label: 'Sản phẩm', value: productsCount || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Bộ sưu tập', value: collectionsCount || 0, icon: Layers, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Đơn hàng', value: ordersCount || 0, icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Doanh thu', value: new Intl.NumberFormat('vi-VN').format(chartOrders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
  ]

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-stone-900">Chào quản trị viên,</h1>
          <p className="text-stone-500">Đây là cái nhìn tổng quan về xưởng gốm của bạn ngày hôm nay.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full hover:bg-stone-800 transition-all font-bold shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2rem] premium-card-shadow flex items-start justify-between group hover:-translate-y-1 transition-all">
            <div className="space-y-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl w-fit`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-serif font-bold text-stone-900 mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className="text-stone-300 group-hover:text-stone-900 transition-colors">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sales Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] premium-card-shadow p-10 space-y-10 group">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-bold text-stone-900">Doanh thu & Sản lượng</h3>
              <p className="text-stone-400 text-xs">Biến động doanh thu theo từng ngày trong tuần.</p>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-stone-900" />
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Doanh thu (VNĐ)</span>
            </div>
          </div>
          
          <DashboardCharts data={chartData} />
        </div>

        {/* Quick Report */}
        <div className="bg-stone-900 rounded-[3rem] p-10 text-white space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Hiệu suất vận hành</span>
            </div>
            <h3 className="text-3xl font-serif font-bold italic">Nghệ thuật & Thương mại</h3>
          </div>
          
          <div className="space-y-6">
            <p className="text-stone-400 text-sm leading-relaxed">
              Dữ liệu của bạn được đồng bộ trực tiếp từ hệ thống. Hãy đảm bảo mọi sản phẩm đều được cập nhật bộ sưu tập và giá cả chính xác.
            </p>
            <div className="h-px bg-stone-800" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-serif font-bold">100%</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold">An toàn</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Bảo mật</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
