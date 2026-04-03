import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const IMAGES = [
  {
    localPath: '/home/dungpc/.gemini/antigravity/brain/f7a5dcf2-7da9-418a-88c8-c81dd34a03f7/zen_vase_minimalist_1775116854521_1775117756265.png',
    title: 'Thiền Định Men Trắng',
    description: 'Bình gốm độc bản với những đường nét tối giản, gợi tả sự tĩnh lặng của không gian trà đạo.',
    price: 1200000,
    original_price: 1500000,
    collection_id: 1,
    slug: 'thien-dinh-men-trang'
  },
  {
    localPath: '/home/dungpc/.gemini/antigravity/brain/f7a5dcf2-7da9-418a-88c8-c81dd34a03f7/rustic_plate_handcrafted_1775116854521_1775117777396.png',
    title: 'Hồn Đất Mộc',
    description: 'Đĩa gốm thủ công với vân mây tự nhiên, lưu giữ hơi thở của đất sét tinh khiết.',
    price: 850000,
    original_price: 950000,
    collection_id: 2,
    slug: 'hon-dat-moc'
  },
  {
    localPath: '/home/dungpc/.gemini/antigravity/brain/f7a5dcf2-7da9-418a-88c8-c81dd34a03f7/modern_geometric_decor_1775116854521_1775117810382.png',
    title: 'Góc Phố Trừu Tượng',
    description: 'Tác phẩm decor hiện đại với những góc cạnh sắc sảo, phá vỡ mọi quy chuẩn gốm truyền thống.',
    price: 2400000,
    original_price: 2800000,
    collection_id: 3,
    slug: 'goc-pho-truu-tuong'
  }
]

async function seedPremium() {
  console.log('🏺 Bắt đầu nhào nặn dữ liệu và đưa tác phẩm lên kệ...')

  // 0. Đảm bảo Bucket tồn tại
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find(b => b.name === 'pottery')) {
    console.log('🏗️ Đang tạo kho lưu trữ "pottery"...')
    await supabase.storage.createBucket('pottery', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg'],
      fileSizeLimit: 5242880
    })
  }

  for (const item of IMAGES) {
    console.log(`📤 Đang tải ảnh cho: ${item.title}...`)
    
    // 1. Upload to Storage
    const fileBuffer = fs.readFileSync(item.localPath)
    const fileName = path.basename(item.localPath)
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('pottery')
      .upload(filePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      console.error(`❌ Lỗi tải ảnh ${item.title}:`, uploadError.message)
      continue
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pottery')
      .getPublicUrl(filePath)

    // 2. Insert into DB
    const { error: dbError } = await supabase
      .from('products')
      .insert([{
        title: item.title,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        collection_id: item.collection_id,
        slug: item.slug,
        image_url: publicUrl,
        stock: 5
      }])

    if (dbError) {
      console.error(`❌ Lỗi DB ${item.title}:`, dbError.message)
    } else {
      console.log(`✅ Thành công! ${item.title} đã sẵn sàng trưng bày.`)
    }
  }

  console.log('🚀 Chúc mừng! 3 tác phẩm gốm sứ độc bản đã hiện hữu trên hệ thống.')
}

seedPremium()
