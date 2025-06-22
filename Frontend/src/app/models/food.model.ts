export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages';
  type: 'veg' | 'non-veg';
  image?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
}

export interface FoodOrder {
  id: number;
  userId: string;
  foodItems: FoodOrderItem[];
  totalAmount: number;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  trainNumber?: string;
  seatNumber?: string;
  specialInstructions?: string;
}

export interface FoodOrderItem {
  foodItem: FoodItem;
  quantity: number;
  price: number;
} 