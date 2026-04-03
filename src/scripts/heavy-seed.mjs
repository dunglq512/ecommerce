import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function heavySeed() {
  console.log('🚀 Bắt đầu nạp hàng loạt dữ liệu mẫu...')

  // 1. Lấy IDs cần thiết
  const { data: themes } = await supabase.from('themes').select('id, name')
  const { data: collections } = await supabase.from('collections').select('id, title')

  if (!themes || !collections) {
    console.error('❌ Không tìm thấy Themes hoặc Collections. Vui lòng chạy seed cơ bản trước.')
    return
  }

  // 2. Thêm nhiều sản phẩm mới
  const productData = [
    { title: 'Bình Men Rạn Hổ Phách', price: 1850000, stock: 12, collection_id: collections[0].id, theme_id: themes[0].id, slug: 'binh-men-ran-ho-phach' },
    { title: 'Bộ Trà Đạo Tĩnh Tâm', price: 950000, stock: 8, collection_id: collections[1].id, theme_id: themes[0].id, slug: 'bo-tra-dao-tinh-tam' },
    { title: 'Chậu Gốm Bonsai Cổ Thụ', price: 2200000, stock: 3, collection_id: collections[0].id, theme_id: themes[1].id, slug: 'chau-gom-bonsai' },
    { title: 'Lọ Hoa Men Ngọc Rêu', price: 1100000, stock: 15, collection_id: collections[0].id, theme_id: themes[0].id, slug: 'lo-hoa-men-ngoc' },
    { title: 'Đĩa Gốm Vẽ Tay Hoa Sen', price: 550000, stock: 25, collection_id: collections[1].id, theme_id: themes[1].id, slug: 'dia-gom-hoa-sen' },
    { title: 'Bình Decor Sắc Tím Modern', price: 3800000, stock: 2, collection_id: collections[2].id, theme_id: themes[2].id, slug: 'binh-decor-modern-tim' },
    { title: 'Bộ Cốc Gốm Nghệ Thuật', price: 150000, stock: 50, collection_id: collections[1].id, theme_id: themes[1].id, slug: 'bo-coc-gom-nt' },
  ]

  const { data: sProducts, error: pErr } = await supabase.from('products').upsert(productData, { onConflict: 'slug' }).select()
  if (pErr) console.error('Error seeding products:', pErr)
  console.log('✅ Đã nạp thêm sản phẩm.')

  // 3. Tạo hàng loạt đơn hàng trong 30 ngày qua
  const statuses = ['pending', 'paid', 'shipped']
  const names = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Quang Dũng', 'Phạm Minh Đức', 'Hoàng Thu Thảo', 'Vũ Anh Tuấn']
  const emails = ['an@example.com', 'binh@test.vn', 'dunglq512@gmail.com', 'duc@work.com', 'thao@art.vn', 'tuan@dev.io']
  
  const ordersToInsert = []
  const now = new Date()

  // Tạo khoảng 40 đơn hàng ngẫu nhiên trong 14 ngày gần nhất
  for (let i = 0; i < 40; i++) {
    const randomDayOffset = Math.floor(Math.random() * 14) // 0 đến 13 ngày trước
    const orderDate = new Date(now)
    orderDate.setDate(now.getDate() - randomDayOffset)
    orderDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    const total = Math.floor(Math.random() * 5000000) + 500000 // 500k to 5.5M
    const nameIndex = Math.floor(Math.random() * names.length)

    ordersToInsert.push({
      customer_name: names[nameIndex],
      customer_email: emails[nameIndex],
      customer_phone: '09' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
      total_amount: total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: orderDate.toISOString(),
      shipping_address: 'Số ' + (i + 1) + ' Đường Gốm Sứ',
      province: 'Hà Nội',
      ward: 'Bát Tràng',
      payment_method: 'bank_transfer'
    })
  }

  const { data: insertedOrders, error: oErr } = await supabase.from('orders').insert(ordersToInsert).select()
  if (oErr) {
     console.error('Error seeding orders:', oErr)
  } else {
    console.log(`✅ Đã nạp thành công ${insertedOrders.length} đơn hàng mẫu.`)
    
    // 4. Tạo Order Items cho các đơn hàng mới
    const orderItemsToInsert = []
    insertedOrders.forEach(order => {
       const itemCount = Math.floor(Math.random() * 3) + 1
       for(let j=0; j < itemCount; j++) {
          const randProd = sProducts[Math.floor(Math.random() * sProducts.length)]
          orderItemsToInsert.push({
             order_id: order.id,
             product_id: randProd.id,
             quantity: Math.floor(Math.random() * 2) + 1,
             price: randProd.price
          })
       }
    })
    
    const { error: oiErr } = await supabase.from('order_items').insert(orderItemsToInsert)
    if (oiErr) console.error('Error seeding order items:', oiErr)
    console.log('✅ Đã nạp chi tiết đơn hàng.')
  }

  console.log('🎉 Hoàn tất nạp dữ liệu thật!')
}

heavySeed()
