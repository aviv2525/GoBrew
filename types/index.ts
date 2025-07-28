export interface User {
  id: string;
  email: string;
  displayName: string;
  userType: 'seller' | 'buyer';
  createdAt: Date;
}

export interface Seller extends User {
  userType: 'seller';
  businessName: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}