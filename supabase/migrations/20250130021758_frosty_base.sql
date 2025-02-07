/*
  # Initial Schema Setup for JENDO E-commerce

  1. New Tables
    - `users`
      - Stores user account information
    - `products`
      - Stores JENDO product information
    - `orders`
      - Stores order information
    - `order_items`
      - Stores items within each order
    - `cart_items`
      - Stores items in user's shopping cart
    - `pre_orders`
      - Stores pre-order requests
    - `lab_partners`
      - Stores lab partner applications
    - `insurance_partners`
      - Stores insurance partner requests

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  category text NOT NULL,
  stock_quantity integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  status text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  payment_intent_id text,
  shipping_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price_at_time decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pre-orders Table
CREATE TABLE IF NOT EXISTS pre_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  package_type text NOT NULL,
  delivery_address text NOT NULL,
  payment_method text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Lab Partners Table
CREATE TABLE IF NOT EXISTS lab_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  lab_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Insurance Partners Table
CREATE TABLE IF NOT EXISTS insurance_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Insert initial products
INSERT INTO products (name, description, price, category, stock_quantity, image_url) VALUES
('JENDO Basic Device', 'Basic vascular monitoring device for home use', 999.00, 'starter', 100, 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg'),
('JENDO Pro Device', 'Professional vascular monitoring system for clinics', 1499.00, 'professional', 50, 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg'),
('JENDO Enterprise Package', 'Enterprise-level monitoring solution for hospitals', 2999.00, 'enterprise', 25, 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg');