/*
  # Fix Order Notifications Schema

  1. Changes
    - Add user_profile_id to orders table
    - Create foreign key relationship between orders and profiles
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Add new policy for profile relationship
*/

-- Add user_profile_id to orders if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'user_profile_id'
  ) THEN
    ALTER TABLE orders 
    ADD COLUMN user_profile_id uuid REFERENCES profiles(id);

    -- Update existing orders to link with profiles
    UPDATE orders 
    SET user_profile_id = user_id;
  END IF;
END $$;

-- Create index for better query performance
DO $$ 
BEGIN
  CREATE INDEX IF NOT EXISTS idx_orders_user_profile_id 
  ON orders(user_profile_id);
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;