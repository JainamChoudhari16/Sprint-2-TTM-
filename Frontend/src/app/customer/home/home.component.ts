import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FoodService } from '../../services/food.service';

interface Booking {
  date: string;
  train: string;
  status: string;
  origin: string;
  destination: string;
  seats: number;
  user: any;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  totalFoodOrders: number = 0;

  constructor(
    private authService: AuthService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.foodService.getOrdersByUserId(currentUser.username).subscribe(orders => {
        this.totalFoodOrders = orders.length;
      });
    }
  }

  getCurrentUserName(): string {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.name || 'Traveler';
  }

  getRecentBookings(): Booking[] {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Return last 3 bookings
    return bookings.slice(-3).reverse();
  }

  getTotalBookings(): number {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return bookings.length;
  }

  getTotalFoodOrders(): number {
    return this.totalFoodOrders;
  }

  getUpcomingJourneys(): number {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const today = new Date();
    return bookings.filter((booking: Booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= today;
    }).length;
  }

  getLoyaltyPoints(): number {
    // Calculate loyalty points based on bookings
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return bookings.length * 50; // 50 points per booking
  }
}
