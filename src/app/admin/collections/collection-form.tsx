'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCollection } from '@/app/actions/collections'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export function CollectionForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)
    setSuccess(false)
    
    try {
      const result = await createCollection(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Reset form
        const form = document.getElementById('collection-form') as HTMLFormElement
        form?.reset()
      }
    } catch (err: any) {
      // Re-throw if it's a redirect (Next.js handles this)
      if (err.message === 'NEXT_REDIRECT') throw err
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-stone-900 p-10 rounded-[3rem] text-white space-y-8 sticky top-32 shadow-2xl transition-all">
      <div className="space-y-2">
        <h3 className="text-2xl font-serif font-bold">Thêm chủ đề mới</h3>
        <p className="text-stone-400 text-xs uppercase tracking-widest leading-loose">Mỗi bộ sưu tập là một chương mới trong hành trình sáng tạo của POTTERY.</p>
      </div>

      <form id="collection-form" action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold ml-1">Tên bộ sưu tập</label>
          <Input 
            name="title" 
            required 
            placeholder="Ví dụ: Men Gốm Cổ"
            className="bg-stone-800 border-none rounded-xl h-12 px-6 focus:ring-yellow-500/50 text-white placeholder:text-stone-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold ml-1">Mô tả ngắn</label>
          <textarea 
            name="description" 
            rows={4}
            required
            placeholder="Câu chuyện đằng sau các tác phẩm..."
            className="w-full bg-stone-800 border-none rounded-2xl p-6 focus:ring-2 focus:ring-yellow-500/50 outline-none text-sm transition-all placeholder:text-stone-600"
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>Bộ sưu tập đã được phát hành thành công!</p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-14 rounded-full bg-white text-stone-900 hover:bg-stone-100 font-bold transition-all shadow-xl flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Đang xử lý...' : 'Phát hành Bộ sưu tập'}
        </Button>
      </form>
    </div>
  )
}
