import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  LogOut, 
  Search, 
  Settings,
  Bell,
  Menu
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', href: '/admin' },
    { icon: Package, label: 'Sản phẩm', href: '/admin/products' },
    { icon: Layers, label: 'Bộ sưu tập', href: '/admin/collections' },
    { icon: ShoppingCart, label: 'Đơn hàng', href: '/admin/orders' },
  ]

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-stone-200 flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-10">
          <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-stone-900">
            POTTERY<span className="text-stone-400">.</span>
            <span className="text-[10px] uppercase tracking-[0.2em] block text-stone-400 font-sans font-normal mt-1">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-sans font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-stone-100">
          <form action={logout}>
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group font-sans font-medium">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-stone-200 px-12 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 text-stone-400">
            <span className="text-xs uppercase tracking-widest font-sans font-bold">Trang quản trị</span>
            <span className="h-4 w-px bg-stone-200" />
            <span className="text-stone-900 font-serif font-bold">Hệ thống POTTERY.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-stone-400" />
              </div>
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-12 pr-6 py-2 bg-stone-100 border-none rounded-full text-sm focus:ring-2 focus:ring-stone-900 transition-all w-64"
              />
            </div>
            <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-12 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
