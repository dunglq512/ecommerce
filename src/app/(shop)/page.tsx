import { Hero } from '@/components/home/hero'
import { FeaturedCollections } from '@/components/home/featured-collections'
import { FeaturedProducts } from '@/components/home/featured-products'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col gap-0 overflow-hidden bg-white selection:bg-stone-200 selection:text-stone-900">
      <Hero />
      
      {/* Brand Values / Philosophy Strip */}
      <section className="py-16 bg-[#FAF9F6] border-y border-stone-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-between items-center gap-12 group">
            <div className="flex-1 min-w-[250px] text-center md:text-left space-y-2">
              <h4 className="text-stone-400 uppercase tracking-widest text-xs font-sans">Triết lý</h4>
              <p className="text-stone-700 italic font-serif text-xl">&quot;Đất nung hồn cốt Việt, tinh hoa gốm sứ hiện đại.&quot;</p>
            </div>
            <div className="h-px w-full md:w-px md:h-12 bg-stone-200" />
            <div className="flex-1 min-w-[250px] text-center md:text-left space-y-2">
              <h4 className="text-stone-400 uppercase tracking-widest text-xs font-sans">Kỹ thuật</h4>
              <p className="text-stone-700 italic font-serif text-xl">&quot;Nghệ thuật thủ công tinh xảo, hơi thở của thời đại.&quot;</p>
            </div>
            <div className="h-px w-full md:w-px md:h-12 bg-stone-200" />
            <div className="flex-1 min-w-[250px] text-center md:text-left space-y-2">
              <h4 className="text-stone-400 uppercase tracking-widest text-xs font-sans">Cam kết</h4>
              <p className="text-stone-700 italic font-serif text-xl">&quot;Mỗi sản phẩm là một tác phẩm nghệ thuật độc bản.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedCollections />

      {/* Story Section - Enhanced UI */}
      <section className="py-32 px-6 lg:px-12 bg-stone-50 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden border-[16px] border-white shadow-2xl scale-95 group-hover:scale-100 transition-all duration-1000">
                <Image 
                  src="/images/hero.png" 
                  alt="Artisan at work" 
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
                />
              </div>
              {/* Decorative Floating Element */}
              <div className="absolute -bottom-8 -right-8 bg-stone-800 text-white p-12 rounded-full shadow-2xl hidden md:block">
                <p className="font-serif italic text-2xl leading-tight">Est. 1998</p>
              </div>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-stone-400 uppercase tracking-[0.4em] text-sm font-sans">Câu chuyện thương hiệu</h4>
                <h3 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 leading-[1.1]">
                  Tâm Huyết Trân <br /> <span className="italic text-stone-500 font-light">Từng Khối</span> Đất
                </h3>
              </div>
              
              <div className="space-y-6 text-stone-600 text-xl leading-relaxed font-sans font-light">
                <p>
                  Tại <span className="font-bold text-stone-900">POTTERY.</span>, chúng tôi không chỉ tạo ra đồ gốm. 
                  Chúng tôi thổi hồn vào đất, kết hợp kỹ thuật truyền thống hàng thế kỷ với tư duy thẩm mỹ đương đại.
                </p>
                <p>
                  Mỗi tác phẩm là một hành trình hội tụ của Lửa, Đất và Bàn tay Nghệ nhân. 
                  Chúng tôi tin rằng cái đẹp nằm ở sự không hoàn hảo mang tính bản sắc.
                </p>
              </div>

              <div className="pt-6">
                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-4 bg-stone-900 text-white px-10 py-5 rounded-full font-bold hover:bg-stone-800 transition-all group"
                >
                  Tìm hiểu thêm
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* Newsletter - Enhanced Visuals */}
      <section className="py-32 px-6 lg:px-12 bg-white text-center">
        <div className="container mx-auto max-w-4xl bg-stone-900 text-white p-16 md:p-32 rounded-[4rem] relative overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-800/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 space-y-8">
            <h4 className="text-stone-400 uppercase tracking-widest text-sm font-sans">Tham gia cùng chúng tôi</h4>
            <h3 className="text-4xl md:text-6xl font-serif font-bold mb-8">
              Nhận Ưu đãi Đặc biệt & <br /> <span className="italic text-stone-400 font-light">Bộ Sưu Tập Mới</span>
            </h3>
            <p className="text-stone-400 text-lg max-w-lg mx-auto mb-12 font-sans font-light">
              Đăng ký để nhận thông tin sớm nhất về các tác phẩm giới hạn 
              và bí quyết chăm sóc đồ gốm từ chuyên gia.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto shadow-2xl rounded-full overflow-hidden bg-white/10 p-2 backdrop-blur-sm">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="flex-1 px-8 py-5 rounded-full bg-transparent border-none text-white focus:outline-none placeholder:text-stone-500"
                required
              />
              <button type="submit" className="bg-white text-stone-900 px-10 py-5 rounded-full font-bold hover:bg-stone-200 transition-all active:scale-95">
                Đăng ký ngay
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
