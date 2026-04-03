import { createClient } from '@/lib/supabase/server'
import { Clock, Search } from 'lucide-react'
import OrderCard from './order-card'
import Link from 'next/link'

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: { title: string }
}

interface Order {
  id: string
  status: string
  created_at: string
  total_amount: number
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  province: string
  ward: string
  note: string
  order_items: OrderItem[]
}

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const searchParams = await props.searchParams
  const statusFilter = searchParams.status || 'all'
  const searchQuery = searchParams.q || ''

  const supabase = await createClient()
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (title)
      )
    `)

  // Nếu có từ khóa tìm kiếm (q), hãy ưu tiên tìm kiếm trên toàn bộ trạng thái
  if (searchQuery) {
    const trimmedQ = searchQuery.trim()
    const numId = parseInt(trimmedQ)
    
    if (!isNaN(numId) && String(numId) === trimmedQ) {
      // Nếu là số ngắn (1-2 chữ số), ưu tiên tìm chính xác theo mã đơn hàng
      if (trimmedQ.length <= 2) {
        query = query.eq('id', numId)
      } else {
        // Nếu số dài hơn, có thể là mã đơn hoặc một phần số điện thoại
        query = query.or(`id.eq.${numId},customer_name.ilike.%${trimmedQ}%,customer_email.ilike.%${trimmedQ}%,customer_phone.ilike.%${trimmedQ}%`)
      }
    } else {
      // Nếu là chuỗi, tìm theo tên, email hoặc số điện thoại
      query = query.or(`customer_name.ilike.%${trimmedQ}%,customer_email.ilike.%${trimmedQ}%,customer_phone.ilike.%${trimmedQ}%`)
    }
  } else if (statusFilter !== 'all') {
    // Chỉ lọc theo trạng thái nếu KHÔNG có từ khóa tìm kiếm
    query = query.eq('status', statusFilter)
  }

  const { data: orders, error } = await query
    .order('created_at', { ascending: false }) as { data: Order[] | null, error: any }

  if (error) {
    console.error('❌ Lỗi truy vấn đơn hàng:', error)
  }

  console.log('📦 Results Count:', orders?.length)
  if (orders && orders.length > 0) {
    console.log('📦 First Match ID:', orders[0].id)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'paid': return 'Đã thanh toán'
      case 'shipped': return 'Đã giao hàng'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  return (
    <div className="space-y-10 focus-visible:outline-none">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-stone-900">Quản lý Đơn hàng</h1>
          <p className="text-stone-500">Theo dõi lộ trình trao tay các tác phẩm gốm sứ đến khách hàng.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] premium-card-shadow flex flex-wrap gap-4 items-center justify-between border border-stone-50">
        <div className="flex gap-4">
          {['all', 'pending', 'paid', 'shipped'].map((status) => {
            const params = new URLSearchParams()
            if (status !== 'all') params.set('status', status)
            if (searchQuery) params.set('q', searchQuery)
            const queryString = params.toString()
            
            return (
              <Link 
                key={status}
                href={`/admin/orders${queryString ? `?${queryString}` : ''}`}
                className={`px-6 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all ${
                  statusFilter === status 
                  ? 'bg-stone-900 text-white shadow-lg' 
                  : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                }`}
              >
                {status === 'all' ? 'Tất cả' : getStatusLabel(status)}
              </Link>
            )
          })}
        </div>
        <form action="/admin/orders" className="relative group flex items-center gap-2">
          {statusFilter !== 'all' && <input type="hidden" name="status" value={statusFilter} />}
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            name="q"
            defaultValue={searchQuery}
            placeholder="Tìm mã đơn hàng..." 
            className="pl-12 pr-6 py-3 bg-stone-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-stone-900 transition-all w-64 shadow-inner"
          />
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {(!orders || orders.length === 0) && (
          <div className="p-32 text-center space-y-6 bg-white rounded-[3rem] premium-card-shadow border-2 border-dashed border-stone-100">
            <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-10 h-10 text-stone-200" />
            </div>
            <div className="space-y-2">
              <p className="text-stone-400 font-serif italic text-xl">Đang chờ những tâm hồn đồng điệu...</p>
              <p className="text-stone-300 text-sm font-sans tracking-widest uppercase">Chưa có đơn hàng nào cần xử lý</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
