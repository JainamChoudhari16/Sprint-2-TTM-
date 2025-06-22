import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../services/food.service';
import { AuthService } from '../../services/auth.service';
import { FoodOrder } from '../../models/food.model';

@Component({
  selector: 'app-food-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-order-history.component.html',
  styleUrls: ['./food-order-history.component.scss']
})
export class FoodOrderHistoryComponent implements OnInit {
  orders: FoodOrder[] = [];
  loading = true;
  selectedOrder: FoodOrder | null = null;

  constructor(
    private foodService: FoodService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.foodService.getOrdersByUserId(currentUser.username).subscribe(orders => {
        this.orders = orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        this.loading = false;
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge bg-warning';
      case 'confirmed': return 'badge bg-info';
      case 'preparing': return 'badge bg-primary';
      case 'ready': return 'badge bg-success';
      case 'delivered': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewOrderDetails(order: FoodOrder): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getTotalItems(order: FoodOrder): number {
    return order.foodItems.reduce((total, item) => total + item.quantity, 0);
  }
} 