'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createOrder } from '@/app/actions/orders'
import { useCartStore, type CartItem } from '@/lib/store/cart-store'
import { CreditCard, Truck, CheckCircle2, ArrowLeft, Copy, Check, Loader2, MapPin } from 'lucide-react'
import { formatCurrencyVND } from '@/lib/format-utils'

interface Province {
  code: number
  name: string
  districts: {
    name: string
    wards: {
      name: string
      code: number
    }[]
  }[]
}

interface Ward {
  code: number
  name: string
}

export default function CheckoutPage() {
  const isMounted = useMounted()
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  
  const [isOrdered, setIsOrdered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [orderCode, setOrderCode] = useState('')

  // Location selection states
  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    ward: '',
    note: ''
  })

  useEffect(() => {
    if (isMounted && items.length === 0 && !isOrdered) {
      router.push('/cart')
    }
  }, [isMounted, items.length, isOrdered, router])

  useEffect(() => {
    if (isMounted && !orderCode) {
      setOrderCode(Math.floor(Math.random() * 100000).toString())
    }
  }, [isMounted, orderCode])

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingLocations(true)
      try {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=3')
        const data = await res.json()
        setProvinces(data)
      } catch (err) {
        console.error('Lỗi lấy danh sách tỉnh thành:', err)
      } finally {
        setLoadingLocations(false)
      }
    }
    if (isMounted) fetchProvinces()
  }, [isMounted])

  const handleProvinceChange = (provinceName: string) => {
    const province = provinces.find(p => p.name === provinceName)
    if (province) {
      // Flatten all wards from all districts in this province
      const allWards: Ward[] = province.districts.flatMap(d => d.wards)
      setWards(allWards)
      setFormData(prev => ({ ...prev, province: provinceName, ward: '' }))
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const orderData = {
      items: items.map((item: CartItem) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: getTotalPrice(),
      payment_method: 'Bank Transfer',
      customer_email: formData.email,
      customer_name: formData.name,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      province: formData.province,
      ward: formData.ward,
      note: formData.note
    }

    try {
      const result = await createOrder(orderData)
      if (result.success) {
        setIsOrdered(true)
        clearCart()
      } else {
        setError(result.error || 'Lỗi khi tạo đơn hàng.')
      }
    } catch (err) {
      console.error(err)
      setError('Đã có lỗi hệ thống xảy ra.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isOrdered) {
    return (
      <div className="container mx-auto px-6 lg:px-12 py-32 text-center max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-[4rem] shadow-2xl border border-stone-100 space-y-10"
        >
          <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
              Cảm ơn bạn đã <br /> đặt niềm tin!
            </h1>
            <p className="text-stone-500 font-sans font-light text-xl max-w-lg mx-auto">
              Đơn hàng của bạn đã được tiếp nhận. 
              Vui lòng hoàn tất thanh toán để chúng tôi bắt đầu giao hàng.
            </p>
          </div>

          {/* Payment Instructions */}
          <div className="bg-stone-50 p-10 rounded-[2.5rem] border border-stone-100 text-left space-y-6">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-4">Thông tin chuyển khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div className="space-y-1">
                <p className="text-xs text-stone-400 uppercase tracking-widest">Ngân hàng</p>
                <p className="font-bold">Vietcombank - Chi nhánh HCM</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-stone-400 uppercase tracking-widest">Chủ tài khoản</p>
                <p className="font-bold uppercase">NGUYEN VAN A</p>
              </div>
              <div className="space-y-1 relative group">
                <p className="text-xs text-stone-400 uppercase tracking-widest">Số tài khoản</p>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-2xl tracking-tighter">1234 5678 9999</p>
                  <button 
                    onClick={() => handleCopy('123456789999')}
                    className="p-2 hover:bg-stone-200 rounded-full transition-all text-stone-400 hover:text-stone-900 active:scale-90"
                  >
                    {copiedAccount ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-stone-400 uppercase tracking-widest">Số tiền</p>
                <p className="font-bold text-2xl text-emerald-600 font-sans">{formatCurrencyVND(getTotalPrice())}</p>
              </div>
            </div>
            <div className="bg-stone-900 text-stone-400 p-6 rounded-2xl text-sm italic font-light leading-relaxed font-sans">
              Nội dung chuyển khoản: <span className="text-white font-bold tracking-widest">POTTERY {orderCode}</span>
            </div>
          </div>

          <div className="pt-8">
            <NextLink 
              href="/" 
              className="inline-block bg-stone-900 text-white px-12 py-5 rounded-full font-bold hover:bg-stone-800 transition-all shadow-xl active:scale-95"
            >
              Quay lại trang chủ
            </NextLink>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-4">
          <NextLink href="/cart" className="p-4 bg-white rounded-full text-stone-400 hover:text-stone-900 shadow-sm border border-stone-100 hover:shadow-md transition-all">
            <ArrowLeft size={20} />
          </NextLink>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">Thanh toán</h1>
            <p className="text-stone-400 font-sans text-xs uppercase tracking-[0.3em]">Đặt hàng nhanh trong vài giây</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-sm space-y-10">
              <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
                <div className="bg-stone-900 text-white p-3 rounded-2xl">
                  <Truck size={24} />
                </div>
                <h3 className="text-2xl font-serif font-bold italic">Thông tin nhận hàng</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup 
                  label="Họ và tên" 
                  placeholder="VD: Nguyễn Văn A" 
                  required 
                  value={formData.name}
                  onChange={v => setFormData(p => ({ ...p, name: v }))}
                />
                <InputGroup 
                  label="Email (nhận thông tin đơn hàng)" 
                  placeholder="name@example.com" 
                  required 
                  type="email"
                  value={formData.email}
                  onChange={v => setFormData(p => ({ ...p, email: v }))}
                />
                <InputGroup 
                  label="Số điện thoại" 
                  placeholder="09xx.xxx.xxx" 
                  required 
                  type="tel"
                  value={formData.phone}
                  onChange={v => setFormData(p => ({ ...p, phone: v }))}
                />
                
                <div className="md:col-span-2">
                  <InputGroup 
                    label="Địa chỉ cụ thể (Số nhà, tên đường...)" 
                    placeholder="VD: 123 Đường ABC..." 
                    required
                    value={formData.address}
                    onChange={v => setFormData(p => ({ ...p, address: v }))}
                  />
                </div>

                {/* Province & Ward selects */}
                <div className="space-y-3">
                  <label className="text-xs text-stone-400 uppercase tracking-widest font-bold block">Tỉnh / Thành phố *</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-100 rounded-full h-16 px-8 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-sans font-light disabled:opacity-50"
                      disabled={loadingLocations}
                    >
                      <option value="">{loadingLocations ? 'Đang tải...' : 'Chọn Tỉnh/Thành'}</option>
                      {provinces.map(p => (
                        <option key={p.code} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-stone-400 uppercase tracking-widest font-bold block">Phường / Xã *</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.ward}
                      onChange={(e) => setFormData(p => ({ ...p, ward: e.target.value }))}
                      className="w-full bg-stone-50 border border-stone-100 rounded-full h-16 px-8 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-sans font-light disabled:opacity-50"
                      disabled={!formData.province}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map((w, idx) => (
                        <option key={`${w.code}-${idx}`} value={w.name}>{w.name}</option>
                      ))}
                    </select>
                    <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-3 block">Ghi chú thêm</label>
                  <textarea 
                    className="w-full bg-stone-50 border border-stone-100 rounded-3xl p-6 h-32 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-sans font-light placeholder:text-stone-300"
                    placeholder="VD: Giao giờ hành chính, gọi điện trước khi đến..."
                    value={formData.note}
                    onChange={e => setFormData(p => ({ ...p, note: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
                <div className="bg-stone-900 text-white p-3 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-2xl font-serif font-bold italic">Phương thức thanh toán</h3>
              </div>
              
              <div className="p-8 bg-stone-50 border-2 border-stone-900 rounded-[2rem] flex items-center gap-6 group">
                <div className="w-8 h-8 rounded-full border-4 border-stone-900 flex items-center justify-center p-1 bg-white">
                  <div className="w-full h-full bg-stone-900 rounded-full" />
                </div>
                <div className="space-y-1 font-sans">
                  <p className="font-bold font-serif text-lg italic">Chuyển khoản Ngân hàng</p>
                  <p className="text-xs text-stone-400 font-sans font-light italic">Vui lòng chuyển khoản sau khi nhấn &quot;Đặt hàng ngay&quot;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Snapshot */}
          <div className="space-y-8 sticky top-32">
            <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-100 space-y-8">
              <h3 className="text-xl font-serif font-bold uppercase tracking-widest text-stone-900 border-b border-stone-200 pb-6">
                Tóm tắt đơn hàng
              </h3>
              
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-white border border-stone-100 shadow-sm">
                      <Image src={item.image_url || '/images/hero.png'} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-stone-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-stone-400 font-sans">SL: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-sans font-semibold text-stone-900">
                      {formatCurrencyVND(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-stone-200 space-y-6">
                <div className="flex justify-between items-center text-stone-400 font-sans text-sm">
                  <span>Tạm tính</span>
                  <span className="text-stone-900 font-medium">{formatCurrencyVND(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between items-center text-stone-400 font-sans text-sm">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600 font-medium italic underline decoration-emerald-100">Miễn phí</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-stone-400 text-xs uppercase tracking-[0.2em] font-sans font-bold">Tổng cộng</span>
                  <span className="text-3xl font-sans font-bold text-stone-900">{formatCurrencyVND(getTotalPrice())}</span>
                </div>
                
                {error && (
                  <p className="text-red-500 text-xs font-sans text-center bg-red-50 py-3 rounded-xl border border-red-100">
                    {error}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 text-white h-16 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-xl active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đặt hàng ngay
                      <CheckCircle2 size={20} className="group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function InputGroup({ label, placeholder, required = false, type = "text", value, onChange }: { 
  label: string, 
  placeholder: string, 
  required?: boolean, 
  type?: string,
  value?: string,
  onChange?: (v: string) => void
}) {
  return (
    <div className="space-y-3">
      <label className="text-xs text-stone-400 uppercase tracking-widest font-bold block">{label} {required && "*"}</label>
      <input 
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full bg-stone-50 border border-stone-100 rounded-full h-16 px-8 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-sans font-light placeholder:text-stone-300"
      />
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
