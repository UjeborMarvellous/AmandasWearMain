/*
  # E-commerce Schema Setup

  1. New Tables
    - categories (product categories)
    - products (main product information)
    - reviews (product reviews)
    - orders (customer orders)
    - order_items (items in each order)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to products, categories, and reviews
    - Add policies for authenticated users to create reviews and manage orders

  3. Relationships
    - Products belong to categories
    - Reviews belong to products and users
    - Orders belong to users
    - Order items belong to orders and products
*/

-- Create categories table first since products reference it
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create products table with category reference
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    price decimal(10,2) NOT NULL,
    images text[] NOT NULL,
    category_id uuid REFERENCES categories(id),
    sizes text[] NOT NULL,
    colors text[] NOT NULL,
    in_stock boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create reviews table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id),
    user_id uuid REFERENCES auth.users(id),
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create orders table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    status text NOT NULL,
    total_amount decimal(10,2) NOT NULL,
    shipping_address jsonb NOT NULL,
    payment_intent_id text UNIQUE,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create order items table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id),
    product_id uuid REFERENCES products(id),
    quantity integer NOT NULL,
    size text NOT NULL,
    color text NOT NULL,
    price_at_time decimal(10,2) NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
  ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies safely
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
  CREATE POLICY "Anyone can view categories"
    ON categories FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view products" ON products;
  CREATE POLICY "Anyone can view products"
    ON products FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
  CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
  CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
  CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create orders" ON orders;
  CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Add indexes for better query performance
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;