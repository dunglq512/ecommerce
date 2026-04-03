'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Heart
} from 'lucide-react'

interface Product {
  id: number
  title: string
  slug: string
  price: number
  original_price?: number
  description: string
  image_url: string
  stock: number
  collections?: { title: string } | null
}

export function ProductDetails({ 
  product, 
  relatedProducts = [] 
}: { 
  product: Product, 
  relatedProducts?: Product[] 
}) {
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <div className="container mx-auto px-6 lg:px-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-12 font-sans tracking-wide">
        <Link href="/" className="hover:text-stone-900 transition-colors">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-stone-900 transition-colors">Sản phẩm</Link>
        <ChevronRight size={14} />
        <span className="text-stone-900 font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left Col: Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group lg:sticky lg:top-32"
        >
          {/* Main Image Container */}
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white premium-card-shadow border border-stone-100 group-hover:premium-card-shadow-hover transition-all duration-700">
            <Image
              src={product.image_url || '/images/hero.png'}
              alt={product.title}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500" />
            
            {/* Discount Badge Overlay */}
            {discountPercentage > 0 && (
              <div className="absolute top-8 left-8 z-10">
                <div className="bg-stone-900 text-white text-xs font-sans font-bold px-4 py-2 rounded-full shadow-2xl border border-white/20">
                  -{discountPercentage}% SALE
                </div>
              </div>
            )}

            {/* Favorite Button Overlay */}
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-8 right-8 z-10 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-xl hover:bg-white transition-all text-stone-900 border border-stone-100 active:scale-90"
            >
              <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-stone-200/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </motion.div>

        {/* Right Col: Product Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Title & Collection */}
          <div className="space-y-4">
            <div className="inline-block py-1.5 px-4 rounded-full bg-stone-100 text-stone-500 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">
              {product.collections?.title || 'Bộ sưu tập độc bản'}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 text-stone-400 font-sans text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-100">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </div>
              <span>SKU: POT-{(product.id * 1234).toString().padStart(4, '0')}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-2 p-8 rounded-[2rem] bg-stone-50 border border-stone-100">
            {product.original_price && product.original_price > product.price && (
              <p className="text-stone-400 font-sans text-lg line-through decoration-stone-300">
                {formatPrice(product.original_price)}
              </p>
            )}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-sans font-bold text-stone-900 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Tiết kiệm {formatPrice(product.original_price! - product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-stone-400 font-sans font-bold">Mô tả sản phẩm</h4>
            <div className="text-lg text-stone-600 leading-relaxed font-sans font-light whitespace-pre-wrap italic">
              &quot;{product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}&quot;
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-wrap items-center gap-6">
              {/* Quantity Selector */}
              <div className="flex items-center bg-white border border-stone-200 rounded-full h-16 px-2 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all active:scale-90"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center text-lg font-sans font-bold text-stone-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all active:scale-90"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={() => {
                  useCartStore.getState().addItem(product, quantity)
                }}
                className="flex-1 min-w-[200px] h-16 bg-stone-900 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] group overflow-hidden relative cursor-pointer"
              >
                <motion.div 
                  className="absolute inset-0 bg-stone-700 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none" 
                />
                <ShoppingBag size={20} className="relative z-10" />
                <span className="relative z-10">Thêm vào giỏ hàng</span>
              </button>
            </div>
            
            <button 
              onClick={() => {
                useCartStore.getState().addItem(product, quantity)
                window.location.href = '/checkout'
              }}
              className="w-full h-16 border-2 border-stone-900 text-stone-900 rounded-full font-bold hover:bg-stone-900 hover:text-white transition-all active:scale-[0.98] cursor-pointer"
            >
              Mua ngay
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-stone-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-stone-100 rounded-2xl text-stone-900">
                <Truck size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-sm">Giao hàng nhanh</h5>
                <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">Toàn quốc từ 2-5 ngày</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-stone-100 rounded-2xl text-stone-900">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-sm">Bảo hành rơi vỡ</h5>
                <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">Cam kết vận chuyển an toàn</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-stone-100 rounded-2xl text-stone-900">
                <RotateCcw size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-sm">Đổi trả 7 ngày</h5>
                <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">Miễn phí nếu lỗi từ NSX</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 pt-24 border-t border-stone-100"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h4 className="text-sm uppercase tracking-[0.5em] text-stone-400 font-sans">Có thể bạn sẽ thích</h4>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 italic">Sản phẩm tiêu biểu khác</h3>
            </div>
            <Link 
              href="/products" 
              className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-all inline-flex items-center gap-2 group"
            >
              Xem tất cả
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {relatedProducts
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((rp) => (
                <Link key={rp.id} href={`/products/${rp.slug}`} className="group block">
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white premium-card-shadow mb-6">
                    <Image
                      src={rp.image_url || '/images/hero.png'}
                      alt={rp.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">{rp.collections?.title || 'Gốm sứ'}</p>
                    <h5 className="font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors">{rp.title}</h5>
                    <p className="font-sans font-semibold text-stone-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rp.price)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
