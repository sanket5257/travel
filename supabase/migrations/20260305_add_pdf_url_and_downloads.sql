-- Add pdf_url column to tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS pdf_url text DEFAULT NULL;

-- Create pdf_downloads table to capture leads
CREATE TABLE IF NOT EXISTS pdf_downloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  tour_name text NOT NULL,
  tour_id uuid REFERENCES tours(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
