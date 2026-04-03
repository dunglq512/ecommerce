import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function inspectData() {
  console.log('🔍 Đang "soi" dữ liệu sản phẩm để tìm thẻ script...')
  
  const { data: products } = await supabase
    .from('products')
    .select('id, title, description')

  for (const p of products || []) {
    if (p.title.includes('<script') || p.description?.includes('<script')) {
      console.log(`⚠️ Phát hiện Script trong sản phẩm ID ${p.id}: ${p.title}`)
    }
  }
  
  console.log('✅ Hoàn tất kiểm tra dữ liệu.')
}

inspectData()
