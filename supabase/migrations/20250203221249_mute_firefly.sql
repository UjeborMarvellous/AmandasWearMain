/*
  # Fix reviews and profiles relationship

  1. Changes
    - Drop and recreate reviews table with correct foreign key relationships
    - Create profiles table for user information
    - Set up proper RLS policies
    - Add necessary indexes
    - Create trigger for automatic profile creation

  2. Security
    - Enable RLS on all tables
    - Add policies for viewing and managing reviews
    - Add policies for viewing and managing profiles
*/

-- First, drop existing reviews table if it exists
DROP TABLE IF EXISTS reviews CASCADE;

-- Create profiles table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create reviews table with correct relationships
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Safely create policies for profiles
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
  CREATE POLICY "Anyone can view profiles"
    ON profiles FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Safely create policies for reviews
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
  CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
  CREATE POLICY "Authenticated users can create reviews"
    ON reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
  CREATE POLICY "Users can update their own reviews"
    ON reviews FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
  CREATE POLICY "Users can delete their own reviews"
    ON reviews FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add indexes for better performance
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up the trigger
DO $$ BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION
  WHEN others THEN NULL;
END $$;