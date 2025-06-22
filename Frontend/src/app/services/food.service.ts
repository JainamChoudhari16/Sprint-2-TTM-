import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FoodItem, FoodOrder, FoodOrderItem } from '../models/food.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly FOOD_ITEMS_KEY = 'foodItems';
  private readonly FOOD_ORDERS_KEY = 'foodOrders';

  constructor() {
    this.initializeFoodItems();
  }

  private initializeFoodItems(): void {
    const existingItems = this.getFoodItemsFromStorage();
    
    // Only initialize if no food items exist
    if (existingItems.length === 0) {
      const defaultFoodItems: FoodItem[] = [
        // Breakfast Items
        {
          id: 1,
          name: 'Masala Dosa',
          description: 'Crispy rice and lentil crepe with spiced potato filling',
          price: 120,
          category: 'breakfast',
          type: 'veg',
          isAvailable: true,
          preparationTime: 15
        },
        {
          id: 2,
          name: 'Idli Sambar',
          description: 'Steamed rice cakes served with lentil soup and chutney',
          price: 80,
          category: 'breakfast',
          type: 'veg',
          isAvailable: true,
          preparationTime: 10
        },
        {
          id: 3,
          name: 'Puri Bhaji',
          description: 'Deep-fried bread with spiced potato curry',
          price: 100,
          category: 'breakfast',
          type: 'veg',
          isAvailable: true,
          preparationTime: 12
        },
        {
          id: 4,
          name: 'Egg Bhurji',
          description: 'Scrambled eggs with onions, tomatoes, and spices',
          price: 90,
          category: 'breakfast',
          type: 'non-veg',
          isAvailable: true,
          preparationTime: 8
        },

        // Lunch Items
        {
          id: 5,
          name: 'Veg Thali',
          description: 'Complete meal with rice, dal, vegetables, roti, and dessert',
          price: 180,
          category: 'lunch',
          type: 'veg',
          isAvailable: true,
          preparationTime: 20
        },
        {
          id: 6,
          name: 'Chicken Curry',
          description: 'Spicy chicken curry with rice and roti',
          price: 220,
          category: 'lunch',
          type: 'non-veg',
          isAvailable: true,
          preparationTime: 25
        },
        {
          id: 7,
          name: 'Dal Khichdi',
          description: 'Comforting rice and lentil dish with ghee',
          price: 140,
          category: 'lunch',
          type: 'veg',
          isAvailable: true,
          preparationTime: 18
        },
        {
          id: 8,
          name: 'Fish Curry',
          description: 'Fresh fish curry with coconut milk and spices',
          price: 250,
          category: 'lunch',
          type: 'non-veg',
          isAvailable: true,
          preparationTime: 22
        },

        // Dinner Items
        {
          id: 9,
          name: 'Paneer Butter Masala',
          description: 'Cottage cheese in rich tomato and cream gravy',
          price: 200,
          category: 'dinner',
          type: 'veg',
          isAvailable: true,
          preparationTime: 20
        },
        {
          id: 10,
          name: 'Mutton Biryani',
          description: 'Aromatic rice dish with tender mutton pieces',
          price: 280,
          category: 'dinner',
          type: 'non-veg',
          isAvailable: true,
          preparationTime: 30
        },
        {
          id: 11,
          name: 'Mixed Vegetable Curry',
          description: 'Assorted vegetables in flavorful gravy',
          price: 160,
          category: 'dinner',
          type: 'veg',
          isAvailable: true,
          preparationTime: 18
        },
        {
          id: 12,
          name: 'Chicken Biryani',
          description: 'Fragrant rice with tender chicken and spices',
          price: 260,
          category: 'dinner',
          type: 'non-veg',
          isAvailable: true,
          preparationTime: 28
        },

        // Snacks
        {
          id: 13,
          name: 'Samosa',
          description: 'Crispy pastry filled with spiced potatoes and peas',
          price: 40,
          category: 'snacks',
          type: 'veg',
          isAvailable: true,
          preparationTime: 8
        },
        {
          id: 14,
          name: 'Vada Pav',
          description: 'Spicy potato fritter in bread with chutney',
          price: 35,
          category: 'snacks',
          type: 'veg',
          isAvailable: true,
          preparationTime: 6
        },
        {
          id: 15,
          name: 'Chicken Pakora',
          description: 'Crispy chicken fritters with spices',
          price: 80,
          category: 'snacks',
          type: 'non-veg',
          isAvailable: true,
          preparationTime: 10
        },
        {
          id: 16,
          name: 'Poha',
          description: 'Flattened rice with peanuts, onions, and spices',
          price: 60,
          category: 'snacks',
          type: 'veg',
          isAvailable: true,
          preparationTime: 12
        },

        // Beverages
        {
          id: 17,
          name: 'Masala Chai',
          description: 'Spiced Indian tea with milk and ginger',
          price: 25,
          category: 'beverages',
          type: 'veg',
          isAvailable: true,
          preparationTime: 5
        },
        {
          id: 18,
          name: 'Coffee',
          description: 'Hot coffee with milk and sugar',
          price: 30,
          category: 'beverages',
          type: 'veg',
          isAvailable: true,
          preparationTime: 4
        },
        {
          id: 19,
          name: 'Lassi',
          description: 'Sweet yogurt-based drink with cardamom',
          price: 45,
          category: 'beverages',
          type: 'veg',
          isAvailable: true,
          preparationTime: 6
        },
        {
          id: 20,
          name: 'Fresh Juice',
          description: 'Seasonal fruit juice (orange/apple/mango)',
          price: 50,
          category: 'beverages',
          type: 'veg',
          isAvailable: true,
          preparationTime: 3
        }
      ];
      
      localStorage.setItem(this.FOOD_ITEMS_KEY, JSON.stringify(defaultFoodItems));
    }
  }

  private getFoodItemsFromStorage(): FoodItem[] {
    const itemsStr = localStorage.getItem(this.FOOD_ITEMS_KEY);
    return itemsStr ? JSON.parse(itemsStr) : [];
  }

  private saveFoodItemsToStorage(items: FoodItem[]): void {
    localStorage.setItem(this.FOOD_ITEMS_KEY, JSON.stringify(items));
  }

  private getFoodOrdersFromStorage(): FoodOrder[] {
    const ordersStr = localStorage.getItem(this.FOOD_ORDERS_KEY);
    return ordersStr ? JSON.parse(ordersStr) : [];
  }

  private saveFoodOrdersToStorage(orders: FoodOrder[]): void {
    localStorage.setItem(this.FOOD_ORDERS_KEY, JSON.stringify(orders));
  }

  getFoodItems(): Observable<FoodItem[]> {
    return of(this.getFoodItemsFromStorage());
  }

  getFoodItemsByCategory(category: string): Observable<FoodItem[]> {
    const items = this.getFoodItemsFromStorage();
    return of(items.filter(item => item.category === category && item.isAvailable));
  }

  getFoodItemById(id: number): Observable<FoodItem | undefined> {
    const items = this.getFoodItemsFromStorage();
    return of(items.find(item => item.id === id));
  }

  placeOrder(bookingId: number, foodItems: FoodOrderItem[]): Observable<FoodOrder> {
    const orders = this.getFoodOrdersFromStorage();
    const newOrder: FoodOrder = {
      id: Date.now(), // Simple ID generation
      userId: 'current-user', // This should be replaced with actual user ID
      foodItems: foodItems,
      totalAmount: foodItems.reduce((total, item) => total + item.price, 0),
      orderDate: new Date(),
      status: 'pending',
      trainNumber: 'TRAIN-' + bookingId,
      seatNumber: 'SEAT-' + bookingId,
      specialInstructions: ''
    };
    
    orders.push(newOrder);
    this.saveFoodOrdersToStorage(orders);
    
    return of(newOrder);
  }

  getOrdersByUserId(userId: string): Observable<FoodOrder[]> {
    const orders = this.getFoodOrdersFromStorage();
    return of(orders.filter(order => order.userId === userId || order.userId === 'current-user'));
  }

  updateOrderStatus(orderId: number, status: FoodOrder['status']): Observable<FoodOrder | null> {
    const orders = this.getFoodOrdersFromStorage();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      this.saveFoodOrdersToStorage(orders);
      return of(orders[orderIndex]);
    }
    
    return of(null);
  }

  getOrderById(orderId: number): Observable<FoodOrder | undefined> {
    const orders = this.getFoodOrdersFromStorage();
    return of(orders.find(order => order.id === orderId));
  }

  // Method to reset food items to default (for testing)
  resetToDefaultFoodItems(): void {
    localStorage.removeItem(this.FOOD_ITEMS_KEY);
    this.initializeFoodItems();
  }

  // Method to get food items by type (veg/non-veg)
  getFoodItemsByType(type: 'veg' | 'non-veg'): Observable<FoodItem[]> {
    const items = this.getFoodItemsFromStorage();
    return of(items.filter(item => item.type === type && item.isAvailable));
  }
} 