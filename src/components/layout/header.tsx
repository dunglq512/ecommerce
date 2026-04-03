'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { ShoppingBag, Search, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const isMounted = useMounted()
  const pathname = usePathname()
  
  // Zustand state
  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 transition-all duration-500 font-sans",
        isScrolled ? "py-4 bg-white/80 backdrop-blur-xl border-b border-stone-100 shadow-sm" : ""
      )}
    >
      <nav className={cn(
        "container mx-auto flex justify-between items-center px-8 py-4 rounded-full transition-all duration-500",
        isScrolled ? "bg-transparent shadow-none" : "glass-nav"
      )}>
        <NextLink href="/" className="text-2xl font-serif font-bold tracking-tighter text-stone-900 group">
          POTTERY<span className="text-stone-400 group-hover:text-stone-900 transition-colors">.</span>
        </NextLink>
        
        <div className="hidden md:flex gap-10 items-center">
          <NavLink href="/products" active={pathname === '/products'}>Cửa hàng</NavLink>
          <NavLink href="/collections" active={pathname === '/collections'}>Bộ sưu tập</NavLink>
          <NavLink href="/about" active={pathname === '/about'}>Câu chuyện</NavLink>
        </div>

        <div className="flex gap-6 items-center">
          <button className="text-stone-900 hover:scale-110 transition-transform cursor-pointer">
            <Search size={20} strokeWidth={1.5} />
          </button>
          
          <NextLink href="/cart" className="relative text-stone-900 hover:scale-110 transition-transform group">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className={cn(
              "absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300",
              isMounted && totalItems > 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}>
              {totalItems}
            </span>
          </NextLink>

          <button className="md:hidden text-stone-900">
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <NextLink 
      href={href} 
      className={cn(
        "text-stone-600 hover:text-stone-900 transition-all font-sans relative group",
        "text-[10px] uppercase tracking-widest font-bold",
        active ? "text-stone-900" : ""
      )}
    >
      {children}
      <span className={cn(
        "absolute -bottom-1 left-0 h-[1.5px] bg-stone-900 transition-all duration-300",
        active ? "w-full" : "w-0 group-hover:w-full"
      )} />
    </NextLink>
  )
}

// Custom hook to prevent hydration issues
function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
