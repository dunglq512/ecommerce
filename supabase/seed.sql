-- Seed Data for POTTERY. Project

-- 1. Insert Themes
INSERT INTO themes (name, config) VALUES 
('Zen', '{"colors": {"primary": "#556B2F", "secondary": "#FAF9F6"}, "font": "serif"}'),
('Rustic', '{"colors": {"primary": "#8B4513", "secondary": "#F5F5DC"}, "font": "serif"}'),
('Modern', '{"colors": {"primary": "#000000", "secondary": "#FFFFFF"}, "font": "sans"}')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Collections
INSERT INTO collections (title, slug, description, image_url) VALUES 
('Bình hoa Zen', 'vases-zen', 'Sự tĩnh lặng trong từng đường nét men lam tinh khiết.', '/images/col-vases.png'),
('Bát đĩa Rustic', 'tableware-rustic', 'Vẻ đẹp mộc mạc, gần gũi với hơi thở của đất.', '/images/col-tableware.png'),
('Decor Hiện đại', 'decor-modern', 'Phá cách và sang trọng cho không gian sống đương đại.', '/images/col-decor.png')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Products
-- Note: Assuming IDs for themes and collections are 1, 2, 3 based on order of insertion
INSERT INTO products (title, slug, description, price, original_price, stock, image_url, collection_id, theme_id) VALUES 
-- Zen Collection
('Bình Gốm Men Lam Dáng Cổ', 'binh-gom-men-lam-co', 'Thiết kế lấy cảm hứng từ gốm cổ truyền thống, men lam sâu thẳm.', 1250000, 1500000, 5, '/images/col-vases.png', 1, 1),
('Lọ Hoa Tròn Tối Giản', 'lo-hoa-tron-toi-gian', 'Dáng tròn hài hòa, phù hợp cho không gian trà đạo.', 850000, null, 10, '/images/col-vases.png', 1, 1),

-- Rustic Collection
('Bộ Đĩa Gốm Mộc Sần', 'bo-dia-gom-moc-san', 'Chế tác thủ công với bề mặt nhám tự nhiên, giữ trọn màu của đất.', 450000, 600000, 20, '/images/col-tableware.png', 2, 2),
('Tô Gốm Men Đốm Thủ Công', 'to-gom-men-dom', 'Được nung ở nhiệt độ cao, men đốm độc bản.', 320000, null, 15, '/images/col-tableware.png', 2, 2),

-- Modern Collection
('Tượng Gốm Trừu Tượng Black-Gold', 'tuong-gom-black-gold', 'Điêu khắc gốm hiện đại với điểm nhấn vàng 24k.', 3500000, 4200000, 3, '/images/col-decor.png', 3, 3),
('Đèn Gốm Decor Kiến Trúc', 'den-gom-kien-truc', 'Sử dụng ánh sáng để tôn vinh hình khối gốm sứ.', 2800000, null, 2, '/images/col-decor.png', 3, 3)
ON CONFLICT (slug) DO NOTHING;
