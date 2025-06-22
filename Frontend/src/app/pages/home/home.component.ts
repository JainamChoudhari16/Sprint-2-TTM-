import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  isCustomer: boolean = false;
  isAdmin: boolean = false;
  username: string = '';

  constructor(
    private authService: AuthService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.updateAuthStatus();
    
    // Subscribe to authentication changes
    this.authService.currentUser$.subscribe(user => {
      this.updateAuthStatus();
    });
  }

  private updateAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isCustomer = this.authService.isCustomer();
    this.isAdmin = this.authService.isAdmin();
    this.username = this.authService.getUsername() || '';
  }

  logout(): void {
    this.authService.logout();
  }

  // Debug method to show current users (remove in production)
  showUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Current users in localStorage:', users);
    alert(`Current users: ${users.length}\n${users.map((u: any) => `${u.username} (${u.role})`).join('\n')}`);
  }

  // Debug method to reset to default users
  resetUsers() {
    this.authService.resetToDefaultUsers();
    alert('Users reset to default!');
  }

  // Debug method to reset food items to default
  resetFoodItems() {
    this.foodService.resetToDefaultFoodItems();
    alert('Food items reset to default!');
  }

  // Debug method to show food items
  showFoodItems() {
    const foodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
    console.log('Current food items in localStorage:', foodItems);
    alert(`Current food items: ${foodItems.length}\nCategories: ${[...new Set(foodItems.map((f: any) => f.category))].join(', ')}`);
  }
}
