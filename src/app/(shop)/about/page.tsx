'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, Leaf, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
}

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.2 }
}

export default function AboutPage() {
  return (
    <main className="bg-white text-stone-900 selection:bg-stone-200 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/about-hero.png"
            alt="POTTERY. Studio"
            fill
            className="object-cover brightness-75"
            priority
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-stone-950/30 z-1" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-stone-200 uppercase tracking-[0.4em] text-sm mb-6 block font-sans">
              Chúng tôi là ai?
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight mb-8">
              Hồn Của Đất, <br />
              <span className="italic font-light text-stone-300">Tâm Của Người</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div {...fadeIn} className="space-y-8">
            <h4 className="text-stone-400 uppercase tracking-widest text-sm font-sans">Hành trình di sản</h4>
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Kể từ năm 1998, <br />
              <span className="text-stone-500 italic">Khởi đầu từ một đam mê.</span>
            </h2>
            <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-sans font-light">
              <p>
                POTTERY. không chỉ là một thương hiệu gốm sứ. Đó là kết quả của một hành trình dài đi tìm vẻ đẹp thuần khiết từ lòng đất mẹ. Bắt đầu từ một xưởng gốm nhỏ tại làng nghề truyền thống, chúng tôi đã dành hơn hai thập kỷ để nghiên cứu và bảo tồn những kỹ thuật thủ công đang dần mai một.
              </p>
              <p>
                Triết lý của chúng tôi rất đơn giản: Tôn trọng sự tự nhiên của đất và lửa. Mỗi sản phẩm được tạo ra không chỉ để sử dụng, mà để trở thành một phần tâm hồn trong không gian sống của bạn.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/about-shaping.png"
              alt="Artisan shaping clay"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-stone-50">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <motion.div variants={fadeIn} className="space-y-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto md:mx-0">
                <Sparkles className="w-8 h-8 text-stone-800" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Thủ Công Tinh Xảo</h3>
              <p className="text-stone-500 font-sans font-light leading-relaxed">
                Mỗi tác phẩm đều đi qua bàn tay của các nghệ nhân lành nghề, đảm bảo tính độc bản và chất lượng vượt trội.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto md:mx-0">
                <ShieldCheck className="w-8 h-8 text-stone-800" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Bản Sắc Việt</h3>
              <p className="text-stone-500 font-sans font-light leading-relaxed">
                Chúng tôi kết hợp tinh hoa gốm sứ truyền thống với tư duy thẩm mỹ đương đại, tạo nên ngôn ngữ thiết kế riêng biệt.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto md:mx-0">
                <Leaf className="w-8 h-8 text-stone-800" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Bền Vững & Tự Nhiên</h3>
              <p className="text-stone-500 font-sans font-light leading-relaxed">
                Cam kết sử dụng nguyên liệu tự nhiên, men không độc hại và quy trình sản xuất tối ưu hóa tài nguyên.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
          <h4 className="text-stone-400 uppercase tracking-widest text-sm font-sans">Quy trình chế tác</h4>
          <h2 className="text-4xl md:text-6xl font-serif font-bold italic">Nghệ thuật của sự kiên nhẫn</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Step 1 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[600px] rounded-[3rem] overflow-hidden cursor-default"
          >
            <Image 
              src="/images/about-glazing.png" 
              alt="Glazing process" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex flex-col justify-end p-12 text-white">
              <span className="text-6xl font-serif italic text-white/30 mb-4">01</span>
              <h3 className="text-3xl font-serif font-bold mb-4">Tráng Men Thủ Công</h3>
              <p className="text-stone-300 font-sans font-light">
                Mỗi lớp men được định hình để tạo ra những hiệu ứng màu sắc tự nhiên và chiều sâu cho bề mặt sản phẩm.
              </p>
            </div>
          </motion.div>

          {/* Step 2 (More info could go here or more steps) */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="bg-stone-900 rounded-[3rem] p-12 md:p-20 flex flex-col justify-center text-white"
          >
            <div className="space-y-8">
              <span className="text-6xl font-serif italic text-stone-700">02</span>
              <h3 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                Lửa Và Sự <br /> <span className="italic text-stone-500">Biến Hóa</span>
              </h3>
              <p className="text-stone-400 text-xl font-sans font-light leading-relaxed">
                Nhiệt độ lò nung được kiểm soát nghiêm ngặt để đảm bảo độ bền và tính thẩm mỹ cao nhất cho từng tác phẩm.
              </p>
              <div className="pt-6">
                <Link 
                  href="/collections" 
                  className="inline-flex items-center gap-4 text-white font-bold group border-b border-white/20 pb-2 hover:border-white transition-all"
                >
                  Xem các bộ sưu tập
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeIn} className="max-w-2xl mx-auto space-y-10">
            <h3 className="text-4xl md:text-5xl font-serif font-bold">Gốm Không Chỉ Là Vật Dụng</h3>
            <p className="text-stone-500 text-xl font-sans font-light italic">
              &quot;Nó là nhịp cầu kết nối quá khứ với hiện tại, mang lại sự tĩnh lặng trong cuộc sống ồn ã.&quot;
            </p>
            <div className="flex justify-center gap-8">
              <Link href="/products" className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold hover:bg-stone-800 transition-all">
                Mua sắm ngay
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
