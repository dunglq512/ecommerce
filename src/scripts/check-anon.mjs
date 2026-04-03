import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkAnonAccess() {
  console.log('🕵️ Đang kiểm tra quyền truy cập vãng lai (Anon) cho dự án gốm sứ...')
  const { data, error } = await supabaseAnon.from('products').select('*')
  
  if (error) {
    console.error('❌ Lỗi Anon Access:', error.message)
    console.log('💡 Nguyên nhân: RLS đang chặn quyền SELECT của Anon Key.')
  } else {
    console.log('✅ Quyền Anon Access hợp lệ. Số sản phẩm đọc được:', data.length)
  }
}

checkAnonAccess()
