'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProducts } from '@/app/actions/products'
import { Filter, Grid2X2, List, Search } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'

interface Product {
  id: number
  title: string
  slug: string
  price: number
  original_price?: number
  image_url: string
  collections: { title: string } | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await getProducts()
      setProducts(data as Product[] || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-stone-50 border-b border-stone-100 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <h4 className="text-stone-400 uppercase tracking-[0.4em] text-xs font-sans">Cửa hàng trực tuyến</h4>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">
                Tất cả <span className="italic text-stone-500 font-light">Sản phẩm</span>
              </h1>
            </div>
            <div className="flex items-center gap-6 pb-2">
              <p className="text-stone-400 font-sans text-sm italic">Hiển thị {products.length} tác phẩm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[88px] z-30 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 lg:px-12">
        <div className="container mx-auto py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-stone-200 hover:border-stone-900 transition-all text-xs uppercase tracking-widest font-bold text-stone-600 hover:text-stone-900">
              <Filter size={14} />
              Bộ lọc
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <input 
                type="text" 
                placeholder="Tìm kiếm..."
                className="bg-stone-50 border border-stone-100 rounded-full px-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300 w-48 group-hover:w-64 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
            </div>
            <div className="h-4 w-px bg-stone-200 hidden sm:block" />
            <div className="flex items-center gap-1">
              <button className="p-2 text-stone-900 bg-stone-100 rounded-lg">
                <Grid2X2 size={18} />
              </button>
              <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 px-6 lg:px-12">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="bg-stone-100 aspect-[4/5] rounded-[2rem]" />
                  <div className="space-y-3 px-4">
                    <div className="h-2 bg-stone-100 w-1/3 rounded-full mx-auto" />
                    <div className="h-4 bg-stone-100 w-3/4 rounded-full mx-auto" />
                    <div className="h-4 bg-stone-100 w-1/2 rounded-full mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="py-32 text-center space-y-6 bg-stone-50 rounded-[4rem]">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-sm border border-stone-100">
                <Search size={32} className="text-stone-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-stone-900">Chưa có sản phẩm nào</h3>
                <p className="text-stone-400 font-sans">Chúng tôi đang cập nhật các tác phẩm mới nhất.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
