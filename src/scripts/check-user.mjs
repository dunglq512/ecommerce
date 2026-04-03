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

async function checkAdmin() {
  const email = 'admin@gmail.com'
  console.log(`🔍 Kiểm tra tài khoản: ${email}...`)

  const { data: user, error: uError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (uError) {
    console.log('❌ Chưa tìm thấy cấu hình Profile admin.')
  } else {
    console.log('✅ Tài khoản Admin đã tồn tại:', user)
  }
}

checkAdmin()
