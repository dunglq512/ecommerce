-- Bổ sung các RLS policies cho bảng products
-- Chỉ cho phép admin thực hiện các thao tác INSERT, UPDATE, DELETE

-- 1. INSERT: Chỉ Admin mới có quyền tạo sản phẩm
CREATE POLICY "Admins can insert products" ON products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- 2. UPDATE: Chỉ Admin mới có quyền sửa sản phẩm
CREATE POLICY "Admins can update products" ON products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- 3. DELETE: Chỉ Admin mới có quyền xóa sản phẩm
CREATE POLICY "Admins can delete products" ON products
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
