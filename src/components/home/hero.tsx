'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-stone-900 font-serif">
      {/* Background Image with Reveal Animation */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero.png"
          alt="Pottery workshop background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/40 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-stone-400 uppercase tracking-[0.4em] text-sm mb-6 block">
              Tinh hoa từ đất và lửa
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-[1.1] mb-8">
              Nghệ Thuật <br /> 
              <span className="text-stone-400 italic font-light">Gốm Sứ</span> Đương Đại
            </h1>
          </motion.div>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-stone-300 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-sans font-light"
          >
            Khám phá những tác phẩm độc bản kết hợp giữa kỹ thuật truyền thống 
            và tư duy thẩm mỹ hiện đại. Mang hơi thở của thiên nhiên vào không gian sống của bạn.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap gap-6 items-center"
          >
            <a 
              href="/collections" 
              className="bg-white text-stone-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-stone-200 transition-all hover:scale-105 active:scale-95"
            >
              Khám phá ngay
            </a>
            <a 
              href="/about" 
              className="text-white border-b-2 border-stone-500 pb-1 hover:border-white transition-all text-lg"
            >
              Câu chuyện nghệ nhân
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Element */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1, ease: 'circOut' }}
        className="absolute bottom-0 left-0 h-1 bg-stone-500/30 w-full origin-left"
      />
    </section>
  )
}
