/*
  # AAC App Database Schema
  
  Hệ thống cơ sở dữ liệu cho ứng dụng AAC giúp trẻ tự kỷ/chậm nói giao tiếp qua hình ảnh
  
  1. New Tables
    - `categories`
      - `id` (uuid, primary key) - ID danh mục
      - `name` (text) - Tên danh mục (Ăn, Uống, Cảm xúc, v.v.)
      - `icon` (text) - Icon đại diện cho danh mục
      - `color` (text) - Màu sắc nhận diện
      - `order_index` (integer) - Thứ tự hiển thị
      - `created_at` (timestamptz) - Thời gian tạo
      
    - `cards`
      - `id` (uuid, primary key) - ID thẻ
      - `category_id` (uuid, foreign key) - Liên kết đến danh mục
      - `title` (text) - Tiêu đề thẻ (ví dụ: "Uống sữa")
      - `image_url` (text) - URL hình ảnh (có thể là URL Pexels hoặc custom upload)
      - `audio_url` (text, nullable) - URL file ghi âm tùy chỉnh của phụ huynh
      - `is_custom` (boolean) - Đánh dấu thẻ do người dùng tự tạo
      - `order_index` (integer) - Thứ tự trong danh mục
      - `created_at` (timestamptz) - Thời gian tạo
      - `updated_at` (timestamptz) - Thời gian cập nhật
      
    - `usage_logs`
      - `id` (uuid, primary key) - ID log
      - `card_id` (uuid, foreign key) - Thẻ được sử dụng
      - `used_at` (timestamptz) - Thời gian sử dụng
      - `session_id` (uuid, nullable) - ID phiên giao tiếp (để nhóm các thẻ trong 1 câu)
      
  2. Security
    - Enable RLS on all tables
    - Public read access for categories and cards (ứng dụng local, không cần auth phức tạp)
    - Public write access for usage logs
    
  3. Indexes
    - Index on category_id for cards table
    - Index on card_id for usage_logs table
    - Index on used_at for statistics queries
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT '📂',
  color text NOT NULL DEFAULT '#4A90E2',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  image_url text NOT NULL,
  audio_url text,
  is_custom boolean DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usage_logs table for tracking
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  used_at timestamptz DEFAULT now(),
  session_id uuid
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cards_category ON cards(category_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_card ON usage_logs(card_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_used_at ON usage_logs(used_at);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public access for this local-first app
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view cards"
  ON cards FOR SELECT
  USING (true);

CREATE POLICY "Anyone can manage cards"
  ON cards FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view usage logs"
  ON usage_logs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert usage logs"
  ON usage_logs FOR INSERT
  WITH CHECK (true);

-- Insert default Vietnamese categories
INSERT INTO categories (name, icon, color, order_index) VALUES
  ('Nhu cầu cơ bản', '🍽️', '#FF6B6B', 0),
  ('Cảm xúc', '😊', '#4ECDC4', 1),
  ('Hoạt động', '⚽', '#95E1D3', 2),
  ('Người thân', '👨‍👩‍👧', '#F38181', 3),
  ('Địa điểm', '🏠', '#AA96DA', 4),
  ('Đồ vật', '🧸', '#FCBAD3', 5)
ON CONFLICT DO NOTHING;

-- Insert sample cards for "Nhu cầu cơ bản" category (Vietnamese culturally appropriate images)
INSERT INTO cards (category_id, title, image_url, order_index)
SELECT
  c.id,
  v.title,
  v.image_url,
  v.order_index
FROM categories c
CROSS JOIN (
  VALUES
    ('Ăn', 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400', 0),
    ('Uống', 'https://images.pexels.com/photos/296308/pexels-photo-296308.jpeg?auto=compress&cs=tinysrgb&w=400', 1),
    ('Ngủ', 'https://images.pexels.com/photos/1912868/pexels-photo-1912868.jpeg?auto=compress&cs=tinysrgb&w=400', 2),
    ('Đi vệ sinh', 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=400', 3)
) AS v(title, image_url, order_index)
WHERE c.name = 'Nhu cầu cơ bản'
ON CONFLICT DO NOTHING;

-- Insert sample cards for "Cảm xúc" category (Asian children showing emotions)
INSERT INTO cards (category_id, title, image_url, order_index)
SELECT
  c.id,
  v.title,
  v.image_url,
  v.order_index
FROM categories c
CROSS JOIN (
  VALUES
    ('Vui', 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400', 0),
    ('Buồn', 'https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=400', 1),
    ('Giận', 'https://images.pexels.com/photos/4473864/pexels-photo-4473864.jpeg?auto=compress&cs=tinysrgb&w=400', 2),
    ('Sợ', 'https://images.pexels.com/photos/4596090/pexels-photo-4596090.jpeg?auto=compress&cs=tinysrgb&w=400', 3)
) AS v(title, image_url, order_index)
WHERE c.name = 'Cảm xúc'
ON CONFLICT DO NOTHING;