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

async function checkData() {
  console.log('🔍 Kiểm tra bảng Products...')
  const { data: products, error: pError } = await supabase.from('products').select('count', { count: 'exact' })
  console.log('📦 Tổng số sản phẩm:', products?.[0]?.count || 0)
  if (pError) console.error('❌ Lỗi Products:', pError)

  console.log('🔍 Kiểm tra bảng Collections...')
  const { data: cols, error: cError } = await supabase.from('collections').select('id, title')
  console.log('📋 Danh sách bộ sưu tập:', cols)
  if (cError) console.error('❌ Lỗi Collections:', cError)
}

checkData()
