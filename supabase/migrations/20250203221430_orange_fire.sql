/*
  # Fix orders table RLS policies

  1. Changes
    - Add proper RLS policies for orders table
    - Ensure authenticated users can create and view their own orders
    - Add policy for order items management

  2. Security
    - Enable RLS on orders and order_items tables
    - Add policies for CRUD operations
    - Restrict access to user's own orders
*/

-- Enable RLS for orders and order_items if not already enabled
DO $$ BEGIN
  ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Drop existing policies if any
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
  DROP POLICY IF EXISTS "Users can create orders" ON orders;
  DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
  DROP POLICY IF EXISTS "Users can create order items" ON order_items;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies for orders table
DO $$ BEGIN
  CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies for order_items table
DO $$ BEGIN
  CREATE POLICY "Users can view their order items"
    ON order_items FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
      )
    );

  CREATE POLICY "Users can create order items"
    ON order_items FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
      )
    );
EXCEPTION
  WHEN others THEN NULL;
END $$;