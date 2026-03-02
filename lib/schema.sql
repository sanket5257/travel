-- ══════════════════════════════════════
-- Travel Site Database Schema
-- ══════════════════════════════════════

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL DEFAULT '',
  gallery TEXT[] DEFAULT '{}',
  duration TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  price_display TEXT NOT NULL DEFAULT '',
  date TEXT,
  inclusions TEXT[] DEFAULT '{}',
  itinerary_title TEXT,
  itinerary_days JSONB DEFAULT '[]',
  itinerary_sections JSONB DEFAULT '[]',
  qr_image TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  tag TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  read_time TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  tour_name TEXT NOT NULL DEFAULT '',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  emergency_contact TEXT,
  num_travelers INTEGER NOT NULL DEFAULT 1,
  address TEXT,
  total_amount INTEGER NOT NULL DEFAULT 0,
  payment_screenshot_url TEXT,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS tours_updated_at ON tours;
CREATE TRIGGER tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS blogs_updated_at ON blogs;
CREATE TRIGGER blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
