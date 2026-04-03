-- Migration: Add original_price column to products table
ALTER TABLE products ADD COLUMN original_price DECIMAL(12, 2);

-- Optional: Update existing products with original_price (if they were already at sale price)
-- UPDATE products SET original_price = price * 1.2 WHERE original_price IS NULL;
