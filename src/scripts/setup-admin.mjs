import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function setupAdmin() {
  const email = 'admin@gmail.com'
  const password = '12345678'

  console.log(`🚀 Bắt đầu khởi tạo tài khoản Admin: ${email}...`)

  // 1. Tạo user trong auth.users
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('ℹ️ Tài khoản Auth đã tồn tại, tiến hành cập nhật Profile...')
    } else {
      console.error('❌ Lỗi Auth:', authError.message)
      return
    }
  }

  const userId = authData.user?.id || (await supabase.from('users').select('id').eq('email', email).single()).data?.id

  if (!userId) {
    console.error('❌ Không tìm thấy User ID để gán quyền.')
    return
  }

  // 2. Gán quyền admin trong public.users
  const { error: profileError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      email,
      full_name: 'Quản trị viên POTTERY.',
      role: 'admin'
    })

  if (profileError) {
    console.error('❌ Lỗi Profile:', profileError.message)
  } else {
    console.log('✅ Chúc mừng! Tài khoản Quản trị đã sẵn sàng.')
  }
}

setupAdmin()
