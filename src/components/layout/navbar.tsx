'use client'

import * as React from 'react'
import Link from 'next/link'
import { Flower2, ShoppingBag, User, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-6 lg:px-12 mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-stone-600" />
            <span className="text-2xl font-serif font-bold tracking-tight text-stone-800">POTTERY.</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sản phẩm
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/collections" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Bộ sưu tập
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Câu chuyện
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-stone-100 rounded-full px-4 py-2 text-stone-500">
            <Search className="h-4 w-4 mr-2" />
            <span className="text-sm">Tìm sản phẩm gốm...</span>
          </div>
          <Button variant="ghost" size="icon" className="text-stone-600">
            <User className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-stone-600">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-stone-800 rounded-full ring-2 ring-white" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
