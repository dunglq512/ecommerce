'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCollections } from '@/app/actions/products'

interface Collection {
  id: number
  title: string
  slug: string
  description: string
  image_url: string
}

export function FeaturedCollections() {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    async function fetchData() {
      const data = await getCollections()
      setCollections(data || [])
    }
    fetchData()
  }, [])

  if (collections.length === 0) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  }

  return (
    <section className="py-24 px-6 lg:px-12 bg-white">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.4em] text-stone-400 font-sans">Về nguồn cội</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-stone-800 leading-tight">
              Câu Chuyện <br /> Của Đất
            </h3>
          </div>
          <Link href="/collections" className="text-stone-600 border-b-2 border-stone-200 pb-2 hover:text-stone-900 hover:border-stone-900 transition-all font-sans text-lg">
            Khám phá tinh hoa
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16"
        >
          {collections.map((col: Collection) => (
            <motion.div key={col.id} variants={itemVariants}>
              <Link href={`/collections/${col.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] premium-card-shadow transition-all duration-700 group-hover:premium-card-shadow-hover translate-y-0 group-hover:-translate-y-2">
                  <Image
                    src={col.image_url || '/images/hero.png'}
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                  
                  {/* Badge */}
                  <div className="absolute top-8 left-8">
                    <span className="bg-stone-900/90 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full font-sans font-bold shadow-lg">
                      Phiên bản giới hạn
                    </span>
                  </div>

                  {/* Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-lg text-stone-900 px-10 py-4 rounded-full font-sans font-bold shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                      Xem bộ sưu tập
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-4 px-2">
                  <h4 className="text-3xl font-serif font-bold text-stone-900 leading-tight tracking-tight group-hover:text-stone-600 transition-colors">
                    {col.title}
                  </h4>
                  <p className="text-stone-500 text-lg leading-relaxed font-sans font-light max-w-sm">
                    {col.description}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block w-12 h-0.5 bg-stone-200 group-hover:w-20 group-hover:bg-stone-900 transition-all duration-500" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
