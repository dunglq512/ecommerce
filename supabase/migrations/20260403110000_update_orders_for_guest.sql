-- 1. Cập nhật bảng orders để hỗ trợ Guest Checkout và thông tin giao hàng chi tiết
ALTER TABLE orders 
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN customer_email TEXT,
  ADD COLUMN customer_name TEXT,
  ADD COLUMN customer_phone TEXT,
  ADD COLUMN shipping_address TEXT,
  ADD COLUMN province TEXT,
  ADD COLUMN ward TEXT,
  ADD COLUMN note TEXT;

-- 2. Bật RLS cho bảng orders và order_items (nếu chưa bật)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 3. Policies cho phép INSERT dành cho cả Guest (anon) và Authenticated users
DROP POLICY IF EXISTS "Allow anyone to insert orders" ON orders;
CREATE POLICY "Allow anyone to insert orders" ON orders
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anyone to insert order items" ON order_items;
CREATE POLICY "Allow anyone to insert order items" ON order_items
FOR INSERT
WITH CHECK (true);

-- 4. Policies xem đơn hàng của chính mình (nếu đăng nhập) hoặc Admin xem tất cả
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_id AND 
    (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
  )
);
