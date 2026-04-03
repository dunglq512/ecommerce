import { createClient } from '@/lib/supabase/server'
import { 
  Layers, 
  Trash2 
} from 'lucide-react'
import { CollectionForm } from './collection-form'

export default async function AdminCollectionsPage() {
  const supabase = await createClient()
  
  const { data: collections } = await supabase
    .from('collections')
    .select('*, products(count)')
    .order('title', { ascending: true })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* List Column */}
      <div className="lg:col-span-2 space-y-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-stone-900">Bộ sưu tập</h1>
          <p className="text-stone-500">Quản lý các chủ đề và câu chuyện gốm sứ của xưởng.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] premium-card-shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 italic bg-stone-50/50">
                <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm">Chủ đề</th>
                <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm text-center">Sản phẩm</th>
                <th className="px-8 py-6 text-stone-400 font-serif font-medium text-sm text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {collections?.map((col) => (
                <tr key={col.id} className="group hover:bg-stone-50/80 transition-colors">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="font-serif font-bold text-stone-900 text-lg">{col.title}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-sans font-bold italic line-clamp-1">{col.description}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-full text-xs font-sans font-medium">
                      {col.products?.[0]?.count || 0} tác phẩm
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 text-red-300 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm border border-stone-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!collections || collections.length === 0) && (
            <div className="p-24 text-center space-y-4">
              <Layers className="w-10 h-10 text-stone-200 mx-auto" />
              <p className="text-stone-400 font-serif italic text-lg italic">Chưa có chủ đề nào được ra mắt.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Add Form */}
      <div className="space-y-8">
        <CollectionForm />
      </div>
    </div>
  )
}
