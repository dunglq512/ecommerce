'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export interface OrderData {
  items: {
    product_id: number
    quantity: number
    price: number
  }[]
  total_amount: number
  payment_method: string
  customer_email: string
  customer_name: string
  customer_phone: string
  shipping_address: string
  province: string
  ward: string
  note: string
}

export async function createOrder(data: OrderData) {
  const supabase = await createServerClient()

  // 1. Kiểm tra session của user (nếu có đăng nhập thì gán user_id)
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id || null

  // 2. Tạo đơn hàng (Table: orders) - Hỗ trợ cả guest và auth user
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: data.total_amount,
      payment_method: data.payment_method,
      status: 'pending',
      customer_email: data.customer_email,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      shipping_address: data.shipping_address,
      province: data.province,
      ward: data.ward,
      note: data.note
    })
    .select()
    .single()

  if (orderError) {
    console.error('Lỗi tạo đơn hàng:', orderError)
    return { error: 'Không thể tạo đơn hàng. Vui lòng thử lại.' }
  }

  // 3. Tạo các chi tiết đơn hàng (Table: order_items)
  const orderItems = data.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Lỗi tạo chi tiết đơn hàng:', itemsError)
    // Thực tế có thể xoá order nếu chi tiết lỗi (Rollback giả lập nếu ko dùng RPC)
    return { error: 'Lỗi khi lưu chi tiết sản phẩm đơn hàng.' }
  }

  revalidatePath('/admin/orders')
  return { success: true, orderId: order.id }
}

export async function updateOrderStatus(orderId: string, status: string) {
  // Use Service Role for Admin Actions to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  console.log('🔄 Admin Cập nhật đơn hàng (Service Role):', { orderId, status })

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()

  if (error) {
    console.error('❌ Lỗi cập nhật trạng thái đơn hàng:', error)
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ Không tìm thấy đơn hàng sau khi cập nhật:', orderId)
    return { error: 'Không tìm thấy đơn hàng để cập nhật.' }
  }

  console.log('✅ Cập nhật thành công:', data[0])
  
  revalidatePath('/admin/orders')
  return { success: true }
}
