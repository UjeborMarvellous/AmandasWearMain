/*
  # Update products schema and insert initial data

  1. Schema Changes
    - Rename existing size/color columns if they exist
    - Add sizes and colors columns if they don't exist
  
  2. Data Changes
    - Clear existing data
    - Insert Dresses category
    - Insert three products with sizes and colors
*/

-- First ensure the columns exist with correct names
DO $$ 
BEGIN
  -- Add sizes column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'sizes'
  ) THEN
    ALTER TABLE products ADD COLUMN sizes text[];
  END IF;

  -- Add colors column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'colors'
  ) THEN
    ALTER TABLE products ADD COLUMN colors text[];
  END IF;
END $$;

-- Clear existing data
TRUNCATE products CASCADE;
TRUNCATE categories CASCADE;

-- Insert Dresses category
INSERT INTO categories (name, description)
VALUES ('Dresses', 'Elegant dresses for every occasion');

-- Insert new products
DO $$ 
DECLARE
  dresses_id uuid;
BEGIN
  -- Get dresses category ID
  SELECT id INTO dresses_id FROM categories WHERE name = 'Dresses';

  -- Insert products
  INSERT INTO products (name, description, price, images, category_id, sizes, colors)
  VALUES
    ('Elegant Evening Gown', 'A stunning floor-length gown with lace details.', 120.99, 
     ARRAY['https://source.unsplash.com/600x400/?evening-dress'],
     dresses_id, 
     ARRAY['XS', 'S', 'M', 'L', 'XL'],
     ARRAY['Red', 'Black', 'Blue']),

    ('Casual Summer Dress', 'Lightweight and breezy for warm days.', 45.50,
     ARRAY['https://source.unsplash.com/600x400/?summer-dress'],
     dresses_id,
     ARRAY['S', 'M', 'L'],
     ARRAY['Yellow', 'White', 'Green']),

    ('Silk Blouse', 'Soft silk blouse perfect for office or casual wear.', 65.99,
     ARRAY['https://source.unsplash.com/600x400/?silk-blouse'],
     dresses_id,
     ARRAY['XS', 'S', 'M', 'L'],
     ARRAY['Beige', 'Pink', 'White']);
END $$;