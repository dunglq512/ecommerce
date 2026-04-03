import { Header } from '@/components/layout/header'
import NextLink from 'next/link'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden pt-32">
        {children}
      </main>
      <footer className="border-t bg-stone-50 py-12 px-6 lg:px-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-800">POTTERY.</h3>
            <p className="text-sm text-stone-500 max-w-xs">
              Gìn giữ giá trị truyền thống qua từng đường nét gốm thủ công tinh xảo. 
              Mỗi sản phẩm là một câu chuyện.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-stone-800 mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><NextLink href="/products?cat=vases" className="hover:text-stone-800 transition-colors">Bình hoa</NextLink></li>
              <li><NextLink href="/products?cat=tableware" className="hover:text-stone-800 transition-colors">Bát đĩa</NextLink></li>
              <li><NextLink href="/products?cat=decor" className="hover:text-stone-800 transition-colors">Đồ decor</NextLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-800 mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><NextLink href="/faq" className="hover:text-stone-800 transition-colors">Câu hỏi thường gặp</NextLink></li>
              <li><NextLink href="/shipping" className="hover:text-stone-800 transition-colors">Chính sách vận chuyển</NextLink></li>
              <li><NextLink href="/return" className="hover:text-stone-800 transition-colors">Chính sách đổi trả</NextLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-800 mb-4">Liên hệ</h4>
            <p className="text-sm text-stone-500">123 Đường Nghệ Thuật, Quận 1, TP. HCM</p>
            <p className="text-sm text-stone-500">0987 654 321</p>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} POTTERY Architecture by Tueday. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
