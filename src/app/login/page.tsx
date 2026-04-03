'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-12 rounded-[2.5rem] premium-card-shadow space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Quản trị <span className="text-stone-400">POTTERY.</span>
          </h1>
          <p className="text-stone-500 font-sans text-sm tracking-widest uppercase">
            Đăng nhập để tiếp tục câu chuyện
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="admin@pottery.vn"
              className="rounded-2xl border-stone-200 focus:border-stone-900 focus:ring-stone-900 h-12 px-6"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-stone-600 text-xs uppercase tracking-widest ml-1 font-bold">Mật khẩu</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="rounded-2xl border-stone-200 focus:border-stone-900 focus:ring-stone-900 h-12 px-6"
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm p-3 bg-red-50 rounded-xl text-center"
            >
              {error}
            </motion.p>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>

        <div className="text-center pt-4">
          <p className="text-stone-400 text-xs uppercase tracking-widest">
            Hệ thống quản trị nội bộ an toàn
          </p>
        </div>
      </motion.div>
    </div>
  )
}
