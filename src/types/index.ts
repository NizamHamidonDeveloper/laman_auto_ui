export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'dealer' | 'user';
}

export interface Vehicle {
  id: string;
  model_name: string;
  brand_id: string;
  base_price: number;
  main_image_url: string;
}

export interface Brand {
  id: string;
  name: string;
} 