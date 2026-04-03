'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getCollections } from '@/app/actions/products'
import { ArrowRight, Box } from 'lucide-react'

interface Collection {
  id: number
  title: string
  description?: string
  image_url?: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await getCollections()
      setCollections(data as any[] || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-24 bg-stone-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-stone-800 skew-x-12 translate-x-1/2 opacity-20" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h4 className="text-stone-400 uppercase tracking-[0.4em] text-xs font-sans">Triển lãm</h4>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight">
              Các <br /> <span className="italic text-stone-400 font-light">Bộ sưu tập</span>
            </h1>
            <p className="text-stone-400 text-xl font-sans font-light leading-relaxed">
              Mỗi bộ sưu tập là một câu chuyện riêng về sự giao thoa giữa đất, lửa và tâm hồn nghệ nhân.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse space-y-8">
                  <div className="bg-stone-100 aspect-video rounded-[3rem]" />
                  <div className="space-y-4">
                    <div className="h-8 bg-stone-100 w-1/2 rounded-full" />
                    <div className="h-4 bg-stone-100 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : collections.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-16"
            >
              {collections.map((collection) => (
                <motion.div key={collection.id} variants={itemVariants}>
                  <Link href={`/products?collection=${collection.id}`} className="group block">
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl mb-8">
                      <Image 
                        src={collection.image_url || '/images/hero.png'}
                        alt={collection.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                      <div className="absolute bottom-10 left-10">
                         <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white text-xs uppercase tracking-widest font-bold border border-white/30">
                           {collection.title}
                         </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end gap-12">
                      <div className="space-y-3 flex-1">
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors">
                          {collection.title}
                        </h3>
                        <p className="text-stone-500 font-sans font-light line-clamp-2 leading-relaxed">
                          {collection.description || 'Khám phá những tác phẩm độc bản trong bộ sưu tập đặc sắc này.'}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-all group-hover:translate-x-2">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-24 text-center bg-stone-50 rounded-[4rem] border border-dashed border-stone-200">
              <Box className="mx-auto text-stone-200 mb-6" size={64} />
              <h3 className="text-2xl font-serif font-bold text-stone-900">Đang chuẩn bị triển lãm</h3>
              <p className="text-stone-400 font-sans mt-2">Các bộ sưu tập mới sẽ sớm ra mắt.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
