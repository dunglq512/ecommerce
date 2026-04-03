'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getFeaturedProducts } from '@/app/actions/products'
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

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchData() {
      const data = await getFeaturedProducts(4)
      setProducts(data as Product[] || [])
    }
    fetchData()
  }, [])

  if (products.length === 0) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <section className="py-24 px-6 lg:px-12 bg-stone-50">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-[0.5em] text-stone-400 font-sans"
          >
            Sản phẩm tiêu biểu
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900"
          >
            Tuyệt Tác Từ Lửa
          </motion.h3>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link 
            href="/products" 
            className="inline-block border-2 border-stone-800 text-stone-800 px-10 py-4 rounded-full font-bold hover:bg-stone-800 hover:text-white transition-all"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  )
}
