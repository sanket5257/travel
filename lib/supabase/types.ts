export interface DbTour {
  id: string;
  name: string;
  slug: string;
  image: string;
  gallery: string[];
  duration: string;
  description: string;
  price: number;
  price_display: string;
  date: string | null;
  inclusions: string[];
  itinerary_title: string | null;
  itinerary_days: { title: string; items: string[] }[] | null;
  itinerary_sections: { title: string; items: string[] }[] | null;
  qr_image: string | null;
  trip_info: Record<string, string> | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbBlog {
  id: string;
  title: string;
  image: string;
  tag: string;
  category: string;
  date: string;
  read_time: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbBooking {
  id: string;
  tour_id: string | null;
  tour_name: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_contact: string | null;
  num_travelers: number;
  address: string | null;
  total_amount: number;
  payment_screenshot_url: string | null;
  transaction_id: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface DbAdminUser {
  id: string;
  username: string;
  password_hash: string;
}
