'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { formatCurrencyVND } from '@/lib/format-utils'

export default function CartPage() {
  const isMounted = useMounted()
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  if (!isMounted) return null

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <div className="flex flex-col gap-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900">Giỏ hàng của bạn</h1>
          <p className="text-stone-500 font-sans tracking-wide uppercase text-xs">
            {items.length === 0 ? 'Hiện chưa có sản phẩm nào' : `Bạn đang có ${items.length} loại sản phẩm`}
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center space-y-8 bg-white rounded-[3rem] border border-stone-100 shadow-sm"
          >
            <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-stone-300">
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold">Giỏ hàng đang trống</h3>
              <p className="text-stone-400 font-sans font-light">Hãy khám phá những tuyệt tác gốm sứ của chúng tôi.</p>
            </div>
            <NextLink 
              href="/products" 
              className="inline-block bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-stone-800 transition-all"
            >
              Tiếp tục mua sắm
            </NextLink>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* List items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-white rounded-3xl border border-stone-100 shadow-sm group hover:shadow-md transition-all"
                >
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-stone-50">
                    <Image 
                      src={item.image_url || '/images/hero.png'} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold">
                      {item.collection_title || 'Gốm sứ'}
                    </p>
                    <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-stone-900 font-sans font-semibold">
                      {formatCurrencyVND(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-stone-50 rounded-full p-1 border border-stone-100">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-stone-400 hover:text-stone-900"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-stone-400 hover:text-stone-900"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-10 bg-stone-900 text-white rounded-[3rem] shadow-2xl space-y-8 sticky top-32">
              <h3 className="text-2xl font-serif font-bold border-b border-white/10 pb-6 uppercase tracking-wider">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4 font-sans font-light">
                <div className="flex justify-between items-center text-stone-400">
                  <span>Tạm tính</span>
                  <span className="text-white font-medium">{formatCurrencyVND(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between items-center text-stone-400">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-400 font-medium italic">Miễn phí</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-stone-400 font-sans text-sm uppercase tracking-widest">Tổng cộng</span>
                  <span className="text-4xl font-sans font-bold">{formatCurrencyVND(getTotalPrice())}</span>
                </div>
                
                <NextLink 
                  href="/checkout" 
                  className="w-full bg-white text-stone-900 h-16 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-stone-200 transition-all active:scale-[0.98] group"
                >
                  Thanh toán ngay
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </NextLink>
                
                <p className="text-[10px] text-stone-500 text-center uppercase tracking-widest font-sans">
                  Thuế VAT đã bao gồm trong giá sản phẩm
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
