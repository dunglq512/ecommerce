import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrencyVND } from '@/lib/format-utils'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*, collections(title)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-stone-900">Danh mục sản phẩm</h1>
          <p className="text-stone-500">Quản lý kho hàng và thông tin chi tiết các tác phẩm gốm sứ.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full hover:bg-stone-800 transition-all font-bold shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-6 rounded-[2rem] premium-card-shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="relative group flex-1 max-w-md">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-stone-400" />
          </div>
          <input 
            type="text" 
            placeholder="Tìm theo tên sản phẩm, mã SKU..." 
            className="w-full pl-12 pr-6 py-3 bg-stone-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-stone-900 transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl border-stone-200 text-stone-600 gap-2 px-6">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] premium-card-shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100 italic bg-stone-50/50">
              <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm">Sản phẩm</th>
              <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm">Bộ sưu tập</th>
              <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm">Giá bán</th>
              <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm">Kho hàng</th>
              <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products?.map((product) => (
              <tr key={product.id} className="group hover:bg-stone-50/80 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                      <Image 
                        src={product.image_url || '/images/hero.png'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif font-bold text-stone-900 text-lg">{product.title}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold">SKU: POT-{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-full text-xs font-sans font-medium">
                    {product.collections?.title || 'Chưa phân loại'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="font-sans font-bold text-stone-900">
                      {formatCurrencyVND(product.price)}
                    </p>
                    {product.original_price && (
                      <p className="text-xs text-stone-400 line-through">
                        {formatCurrencyVND(product.original_price)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className="text-stone-600 font-sans font-medium">{product.stock} sản phẩm</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/products/${product.slug}`} 
                      target="_blank"
                      className="p-3 text-stone-400 hover:text-stone-900 transition-colors bg-white rounded-xl shadow-sm border border-stone-100"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link 
                      href={`/admin/products/${product.id}/edit`}
                      className="p-3 text-stone-400 hover:text-stone-900 transition-colors bg-white rounded-xl shadow-sm border border-stone-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button className="p-3 text-red-300 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm border border-stone-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!products || products.length === 0) && (
          <div className="p-24 text-center space-y-4">
            <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-10 h-10 text-stone-300" />
            </div>
            <p className="text-stone-400 font-serif italic text-lg italic">Chưa có sản phẩm nào được tạo tác.</p>
          </div>
        )}
      </div>
    </div>
  )
}
