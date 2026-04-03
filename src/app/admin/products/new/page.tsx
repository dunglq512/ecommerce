'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { createProduct, getCollections } from '@/app/actions/products'
import { formatVND, parseVND } from '@/lib/format-utils'

export default function NewProductPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collections, setCollections] = useState<any[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  
  // Price formatting states
  const [formattedPrice, setFormattedPrice] = useState("")
  const [formattedOriginalPrice, setFormattedOriginalPrice] = useState("")

  useEffect(() => {
    async function fetchCollections() {
      const data = await getCollections()
      setCollections(data)
      setFetching(false)
    }
    fetchCollections()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    
    // Convert formatted currency back to raw numbers before submitting
    const rawPrice = parseVND(formattedPrice)
    const rawOriginalPrice = parseVND(formattedOriginalPrice)
    
    formData.set('price', rawPrice.toString())
    if (formattedOriginalPrice) {
      formData.set('original_price', rawOriginalPrice.toString())
    }

    const result = await createProduct(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <Link 
            href="/admin/products" 
            className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-xs uppercase tracking-widest font-bold mb-4"
          >
            <ArrowLeft className="w-3 h-3" /> Quay lại danh sách
          </Link>
          <h1 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Tạo tác <span className="text-stone-400">Mới.</span>
          </h1>
          <p className="text-stone-500 font-sans italic">Thêm một tác phẩm gốm sứ độc bản vào xưởng.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold italic">Tên tác phẩm</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Ví dụ: Hồn Đất Mộc" 
                  className="rounded-2xl border-stone-200 h-14 px-6 text-lg focus:ring-stone-900"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="collection_id" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold italic">Bộ sưu tập</Label>
                <Select name="collection_id" disabled={fetching}>
                  <SelectTrigger className="rounded-2xl border-stone-200 h-14 px-6 focus:ring-stone-900">
                    <SelectValue placeholder={fetching ? "Đang tải bộ sưu tập..." : "Chọn bộ sưu tập"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-stone-200">
                    {collections.map(col => (
                      <SelectItem key={col.id} value={col.id.toString()}>{col.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold italic">Câu chuyện tác phẩm</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Kể về nguồn cảm hứng hoặc kỹ thuật chế tác..." 
                  className="min-h-[200px] rounded-[2rem] border-stone-100 p-8 focus:ring-stone-900 leading-relaxed text-stone-600 outline-none transition-all focus:ring-2"
                  required
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label htmlFor="price" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold italic">Giá bán (VNĐ)</Label>
              <div className="relative">
                <Input 
                  id="price" 
                  name="price" 
                  type="text" 
                  value={formattedPrice}
                  onChange={(e) => setFormattedPrice(formatVND(e.target.value))}
                  placeholder="0"
                  className="rounded-2xl border-stone-200 h-14 px-6 focus:ring-stone-900 font-bold"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="original_price" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold italic">Giá gốc (nếu có)</Label>
              <Input 
                id="original_price" 
                name="original_price" 
                type="text" 
                value={formattedOriginalPrice}
                onChange={(e) => setFormattedOriginalPrice(formatVND(e.target.value))}
                placeholder="0"
                className="rounded-2xl border-stone-200 h-14 px-6 focus:ring-stone-900 text-stone-400"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="stock" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold italic">Số lượng tồn kho</Label>
              <Input 
                id="stock" 
                name="stock" 
                type="number" 
                defaultValue="5"
                className="rounded-2xl border-stone-200 h-14 px-6 focus:ring-stone-900"
                required
              />
            </div>
          </section>
        </div>

        {/* Right Column: Image & Actions */}
        <div className="space-y-8">
          <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-6">
            <Label className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold italic">Hình ảnh tác phẩm</Label>
            
            <div className="relative group aspect-square rounded-[2rem] overflow-hidden bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center transition-all hover:border-stone-400">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Thay đổi ảnh</p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <Upload className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest p-4 leading-relaxed">Kéo thả hoặc nhấp để tải ảnh lên</p>
                </div>
              )}
              <input 
                type="file" 
                name="image" 
                onChange={handleImageChange}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                required={!preview}
              />
            </div>
            <p className="text-[10px] text-stone-400 text-center italic">Định dạng hỗ trợ: JPG, PNG, WEBP. Tối đa 5MB.</p>
          </section>

          <section className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 text-red-500 rounded-2xl flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-20 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-3 italic">
                  <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Hoàn thiện Tác phẩm.
                </span>
              )}
            </Button>
            
            <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-bold">
              Đảm bảo mọi chi tiết đều hoàn mỹ.
            </p>
          </section>
        </div>
      </form>
    </div>
  )
}
