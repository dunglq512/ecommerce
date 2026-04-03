import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Thiếu URL hoặc Service Key trong .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🚀 Đang bắt đầu nạp dữ liệu mẫu (Seeding)...')

  // 1. Seed Themes
  const { data: themes, error: themeError } = await supabase
    .from('themes')
    .upsert([
      { name: 'Zen', config: { colors: { primary: "#556B2F", secondary: "#FAF9F6" }, font: "serif" } },
      { name: 'Rustic', config: { colors: { primary: "#8B4513", secondary: "#F5F5DC" }, font: "serif" } },
      { name: 'Modern', config: { colors: { primary: "#000000", secondary: "#FFFFFF" }, font: "sans" } }
    ], { onConflict: 'name' })
    .select()

  if (themeError) return console.error('❌ Lỗi Theme:', themeError)
  console.log('✅ Đã nạp Themes')

  // 2. Seed Collections
  const { data: collections, error: colError } = await supabase
    .from('collections')
    .upsert([
      { title: 'Bình hoa Zen', slug: 'vases-zen', description: 'Sự tĩnh lặng trong từng đường nét men lam tinh khiết.', image_url: '/images/col-vases.png' },
      { title: 'Bát đĩa Rustic', slug: 'tableware-rustic', description: 'Vẻ đẹp mộc mạc, gần gũi với hơi thở của đất.', image_url: '/images/col-tableware.png' },
      { title: 'Decor Hiện đại', slug: 'decor-modern', description: 'Phá cách và sang trọng cho không gian sống đương đại.', image_url: '/images/col-decor.png' }
    ], { onConflict: 'slug' })
    .select()

  if (colError) return console.error('❌ Lỗi Collections:', colError)
  console.log('✅ Đã nạp Collections')

  // 3. Seed Products
  const { error: prodError } = await supabase
    .from('products')
    .upsert([
      { title: 'Bình Gốm Men Lam Dáng Cổ', slug: 'binh-gom-men-lam-co', price: 1250000, stock: 5, image_url: '/images/col-vases.png', collection_id: collections[0].id, theme_id: themes[0].id },
      { title: 'Lọ Hoa Tròn Tối Giản', slug: 'lo-hoa-tron-toi-gian', price: 850000, stock: 10, image_url: '/images/col-vases.png', collection_id: collections[0].id, theme_id: themes[0].id },
      { title: 'Bộ Đĩa Gốm Mộc Sần', slug: 'bo-dia-gom-moc-san', price: 450000, stock: 20, image_url: '/images/col-tableware.png', collection_id: collections[1].id, theme_id: themes[1].id },
      { title: 'Tượng Gốm Trừu Tượng Black-Gold', slug: 'tuong-gom-black-gold', price: 3500000, stock: 3, image_url: '/images/col-decor.png', collection_id: collections[2].id, theme_id: themes[2].id }
    ], { onConflict: 'slug' })

  if (prodError) return console.error('❌ Lỗi Products:', prodError)
  console.log('✅ Đã nạp Products')

  console.log('🎉 Hoàn tất quá trình nạp dữ liệu mẫu!')
}

seed()
