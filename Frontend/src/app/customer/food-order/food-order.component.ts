import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { AuthService } from '../../services/auth.service';
import { FoodItem, FoodOrderItem } from '../../models/food.model';

@Component({
  selector: 'app-food-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './food-order.component.html',
  styleUrls: ['./food-order.component.scss']
})
export class FoodOrderComponent implements OnInit {
  allFoodItems: FoodItem[] = [];
  filteredFoodItems: FoodItem[] = [];
  cart: FoodOrderItem[] = [];
  
  selectedFoodType: 'veg' | 'non-veg' = 'veg';
  selectedCategory: string = 'all';
  
  categories = [
    { value: 'all', label: 'All Items' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'beverages', label: 'Beverages' }
  ];

  showOrderForm = false;
  orderDetails = {
    trainNumber: '',
    seatNumber: '',
    specialInstructions: ''
  };

  constructor(
    private foodService: FoodService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartFromStorage();
    this.foodService.getFoodItems().subscribe(items => {
      this.allFoodItems = items;
      this.filterFoodItems();
    });
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('foodCart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('foodCart', JSON.stringify(this.cart));
  }

  filterFoodItems(): void {
    let items = this.allFoodItems.filter(item => item.type === this.selectedFoodType);

    if (this.selectedCategory !== 'all') {
      items = items.filter(item => item.category === this.selectedCategory);
    }
    
    this.filteredFoodItems = items;
  }

  onFoodTypeChange(type: 'veg' | 'non-veg'): void {
    this.selectedFoodType = type;
    this.filterFoodItems();
  }
  
  onCategoryChange(): void {
    this.filterFoodItems();
  }

  addToCart(foodItem: FoodItem): void {
    const existingItem = this.cart.find(item => item.foodItem.id === foodItem.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.price = existingItem.foodItem.price * existingItem.quantity;
    } else {
      this.cart.push({
        foodItem: foodItem,
        quantity: 1,
        price: foodItem.price
      });
    }
    this.saveCartToStorage();
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.saveCartToStorage();
  }

  updateQuantity(index: number, change: number): void {
    const item = this.cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity > 0) {
      item.quantity = newQuantity;
      item.price = item.foodItem.price * newQuantity;
    } else {
      this.removeFromCart(index);
    }
    this.saveCartToStorage();
  }

  getTotalAmount(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }

  getCartItemCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  proceedToOrder(): void {
    if (this.cart.length === 0) {
      alert('Please add items to your cart first.');
      return;
    }
    this.showOrderForm = true;
  }

  placeOrder(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Please login to place an order.');
      this.router.navigate(['/login']);
      return;
    }

    // Get booking ID from localStorage or use a default value
    const selectedBooking = localStorage.getItem('selectedBooking');
    const bookingId = selectedBooking ? JSON.parse(selectedBooking).id : 1; // Default to 1 if no booking

    this.foodService.placeOrder(bookingId, this.cart).subscribe(newOrder => {
      alert(`Order placed successfully! Order ID: ${newOrder.id}`);
      this.cart = [];
      this.saveCartToStorage();
      this.showOrderForm = false;
      this.orderDetails = {
        trainNumber: '',
        seatNumber: '',
        specialInstructions: ''
      };
    }, error => {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    });
  }

  cancelOrder(): void {
    this.showOrderForm = false;
    this.orderDetails = {
      trainNumber: '',
      seatNumber: '',
      specialInstructions: ''
    };
  }

  clearCart(): void {
    this.cart = [];
    this.saveCartToStorage();
  }
} 