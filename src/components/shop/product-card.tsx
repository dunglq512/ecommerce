'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import { formatCurrencyVND } from '@/lib/format-utils'

interface ProductProps {
  product: {
    id: number
    title: string
    slug: string
    price: number
    original_price?: number
    image_url: string
    collections: { title: string } | null
  }
}

export function ProductCard({ product }: ProductProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem(product, 1)
    setIsAdded(true)
    
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative bg-white rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 overflow-hidden border border-transparent hover:border-stone-100">
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={product.image_url || '/images/hero.png'}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500" />
            
            {/* Sale Badge */}
            {product.original_price && product.original_price > product.price && (
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-stone-900 text-white text-[10px] font-sans font-bold px-3 py-1.5 rounded-full shadow-lg">
                  -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </div>
              </div>
            )}

            {/* Quick Add To Cart Button - Floating */}
            <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
              <button 
                onClick={handleAddToCart}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
                  isAdded ? 'bg-green-600 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Check size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Plus size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
            
            {/* Hover Center Overlay (Optional, can be used for "Xem chi tiết") */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="bg-white/80 backdrop-blur-md text-stone-900 px-6 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-widest shadow-xl">
                  Chi tiết
               </div>
            </div>
          </div>

          {/* Info Container */}
          <div className="p-8 text-center flex flex-col items-center">
            <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em] font-sans mb-3">
              {product.collections?.title || 'Gốm sứ'}
            </p>
            <h4 className="text-xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
              {product.title}
            </h4>
            <div className="pt-4 flex flex-col items-center gap-1">
              {product.original_price && product.original_price > product.price && (
                <span className="text-stone-400 font-sans line-through text-sm">
                  {formatCurrencyVND(product.original_price)}
                </span>
              )}
              <span className="text-stone-900 font-sans font-bold text-lg">
                {formatCurrencyVND(product.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
