import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  title: string
  slug: string
  price: number
  image_url: string
  quantity: number
  collection_title?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (product: {
    id: number
    title: string
    slug: string
    price: number
    image_url: string
    collections?: { title: string } | null
  }, quantity: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === product.id)
        
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: product.id,
                title: product.title,
                slug: product.slug,
                price: product.price,
                image_url: product.image_url,
                quantity: quantity,
                collection_title: product.collections?.title,
              },
            ],
          })
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },
      
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'pottery-cart-storage',
    }
  )
)
