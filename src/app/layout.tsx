import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair' 
})

export const metadata: Metadata = {
  title: 'POTTERY. | Cửa hàng Gốm sứ Nghệ thuật',
  description: 'Nơi kết hợp giữa truyền thống và tinh hoa gốm sứ hiện đại. Tinh tế, thủ công và độc bản.',
  keywords: 'gốm sứ, đồ trang trí, thủ công, potter, ceramic, zen, rustic'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} font-sans antialiased text-stone-900 bg-[#FAF9F6]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
