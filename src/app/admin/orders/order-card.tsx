'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowRight, Eye, CheckCircle2, Package, Mail, Phone, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateOrderStatus } from '@/app/actions/orders'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function OrderCard({ order }: { order: Order }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-stone-100 text-stone-600'
      case 'paid': return 'bg-blue-50 text-blue-600'
      case 'shipped': return 'bg-green-50 text-green-600'
      case 'cancelled': return 'bg-red-50 text-red-600'
      default: return 'bg-stone-50 text-stone-400'
    }
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

  const getNextStatus = (currentStatus: string) => {
    if (currentStatus === 'pending') return 'paid'
    if (currentStatus === 'paid') return 'shipped'
    return null
  }

  const handleUpdateStatus = async () => {
    const nextStatus = getNextStatus(order.status)
    if (!nextStatus) return

    setIsProcessing(true)
    try {
      const result = await updateOrderStatus(order.id, nextStatus)
      if (result?.error) {
        alert(`Lỗi: ${result.error}`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      alert(`Đã xảy ra lỗi không mong muốn: ${message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-stone-50" />
    )
  }

  return (
    <div className="bg-white rounded-[2.5rem] premium-card-shadow overflow-hidden border border-stone-50 group transition-all">
      <div className="p-8 md:p-10 flex flex-wrap items-center justify-between gap-8 border-b border-stone-50">
        <div className="flex items-center gap-8">
          <div className={`p-4 rounded-3xl ${getStatusStyle(order.status)}`}>
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-serif font-bold text-stone-900">Đơn hàng #{String(order.id).substring(0, 8)}</h3>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest ${getStatusStyle(order.status)} border border-current opacity-70`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-stone-400 text-xs mt-1 font-sans">
              Đặt hàng vào {new Date(order.created_at).toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Tổng thanh toán</p>
          <p className="text-2xl font-serif font-bold text-stone-900">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
          </p>
        </div>
      </div>

      <div className="p-8 md:p-10 bg-stone-50/30 flex flex-wrap items-center justify-between gap-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex -space-x-4">
            {order.order_items?.map((item) => (
              <div key={item.id} className="w-12 h-12 rounded-full border-2 border-white bg-white flex items-center justify-center shadow-sm overflow-hidden bg-stone-100 text-[10px] font-bold text-stone-400">
                 {item.products?.title?.substring(0, 2) || '??'}
              </div>
            ))}
          </div>
          <p className="text-stone-500 text-sm font-sans">
            Gồm <span className="text-stone-900 font-bold">{order.order_items?.length || 0} tác phẩm</span> độc bản
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => setShowDetails(true)}
            variant="outline" 
            className="rounded-2xl border-stone-200 text-stone-600 hover:bg-white hover:text-stone-900 px-8 h-12 font-bold shadow-sm"
          >
            <Eye className="w-4 h-4 mr-2" /> Chi tiết
          </Button>
          
          {getNextStatus(order.status) && (
            <Button 
              onClick={handleUpdateStatus}
              disabled={isProcessing}
              className="rounded-2xl bg-stone-900 text-white hover:bg-stone-800 px-8 h-12 font-bold shadow-lg flex items-center gap-2"
            >
              {isProcessing ? 'Đang xử lý...' : `Xử lý đơn (${getStatusLabel(getNextStatus(order.status)! || '')})`}
              {!isProcessing && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-3xl ${getStatusStyle(order.status)}`}>
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-900">Chi tiết Đơn hàng</h2>
                    <p className="text-stone-400 font-sans">Mã đơn: <span className="text-stone-900 font-bold uppercase">{order.id}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="p-3 rounded-2xl hover:bg-stone-100 transition-colors"
                >
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-10 overflow-y-auto space-y-12">
                {/* Customer & Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <h4 className="text-stone-400 uppercase tracking-widest text-xs font-bold font-sans">Thông tin khách hàng</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-stone-600">
                        <CheckCircle2 className="w-5 h-5 text-stone-300" />
                        <span className="font-bold text-stone-900">{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-stone-600">
                        <Mail className="w-5 h-5 text-stone-300" />
                        <span>{order.customer_email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-stone-600">
                        <Phone className="w-5 h-5 text-stone-300" />
                        <span>{order.customer_phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-stone-400 uppercase tracking-widest text-xs font-bold font-sans">Địa chỉ giao hàng</h4>
                    <div className="flex gap-4 text-stone-600 group">
                      <MapPin className="w-5 h-5 text-stone-300 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-light leading-relaxed">
                          {order.shipping_address}, {order.ward}, {order.province}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-8">
                  <h4 className="text-stone-400 uppercase tracking-widest text-xs font-bold font-sans">Danh sách vật phẩm</h4>
                  <div className="border border-stone-100 rounded-[2rem] overflow-hidden">
                    <table className="w-full font-sans">
                      <thead className="bg-stone-50/50">
                        <tr>
                          <th className="px-8 py-4 text-left text-xs text-stone-400 uppercase tracking-widest">Tác phẩm</th>
                          <th className="px-8 py-4 text-center text-xs text-stone-400 uppercase tracking-widest">SL</th>
                          <th className="px-8 py-4 text-right text-xs text-stone-400 uppercase tracking-widest">Đơn giá</th>
                          <th className="px-8 py-4 text-right text-xs text-stone-400 uppercase tracking-widest">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {order.order_items.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50/30 transition-colors">
                            <td className="px-8 py-6 font-bold text-stone-900">{item.products?.title}</td>
                            <td className="px-8 py-6 text-center text-stone-500">{item.quantity}</td>
                            <td className="px-8 py-6 text-right text-stone-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                            <td className="px-8 py-6 text-right font-bold text-stone-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-stone-900 text-white">
                        <tr>
                          <td colSpan={3} className="px-8 py-6 text-right uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">Tổng cộng</td>
                          <td className="px-8 py-6 text-right text-xl font-serif font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {order.note && (
                  <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100 italic text-stone-500 font-serif">
                    <span className="block text-stone-400 not-italic uppercase tracking-widest text-[10px] font-bold mb-4">Ghi chú từ khách hàng:</span>
                    &quot;{order.note}&quot;
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
