-- Cho phép mọi người (kể cả khách anon) được phép xem danh sách sản phẩm
DROP POLICY IF EXISTS "Anyone can select products" ON products;
CREATE POLICY "Anyone can select products" ON products
FOR SELECT
USING (true);

-- Cho phép mọi người xem danh sách bộ sưu tập (collections)
DROP POLICY IF EXISTS "Anyone can select collections" ON collections;
CREATE POLICY "Anyone can select collections" ON collections
FOR SELECT
USING (true);

-- Cho phép mọi người xem danh sách chủ đề (themes)
DROP POLICY IF EXISTS "Anyone can select themes" ON themes;
CREATE POLICY "Anyone can select themes" ON themes
FOR SELECT
USING (true);
