import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor(private router: Router) {
    this.initializeDefaultUsers();
    this.loadUserFromStorage();
  }

  private initializeDefaultUsers(): void {
    const existingUsers = this.getUsersFromStorage();
    
    // Only initialize if no users exist
    if (existingUsers.length === 0) {
      const defaultUsers: User[] = [
        {
          username: 'user',
          name: 'Default User',
          email: 'user@gmail.com',
          mobile: '9876543210',
          address: '123 Main Street, City, State 12345',
          aadhaar: '123456789012',
          role: 'customer',
          password: 'password'
        },
        {
          username: 'admin',
          name: 'Default Admin',
          email: 'admin@train.com',
          mobile: '9876543211',
          address: '456 Admin Avenue, City, State 12345',
          aadhaar: '123456789013',
          role: 'admin',
          password: 'Admin@123'
        }
      ];
      
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  private getUsersFromStorage(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private loadUserFromStorage(): void {
    const userStr = sessionStorage.getItem(this.CURRENT_USER_KEY);
    if (userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  login$(email: string, password: string): Observable<boolean> {
    const users = this.getUsersFromStorage();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Create a copy without password for session storage
      const userForSession: User = {
        username: user.username,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        aadhaar: user.aadhaar,
        role: user.role
      };
      
      sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userForSession));
      this.currentUserSubject.next(userForSession);
      
      // Navigate based on role
      if (user.role === 'admin') {
        this.router.navigate(['/admin/home']);
      } else {
        const pendingBooking = localStorage.getItem('selectedBooking');
        if (pendingBooking) {
          localStorage.removeItem('selectedBooking');
          this.router.navigate(['/customer/book-ticket']);
        } else {
          this.router.navigate(['/customer/home']);
        }
      }
      
      return of(true);
    } else {
      return of(false);
    }
  }

  register(user: User): Observable<boolean> {
    const users = this.getUsersFromStorage();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      return of(false);
    }
    
    // Add new user
    users.push(user);
    this.saveUsersToStorage(users);
    
    return of(true);
  }

  updateUser(updatedUser: User, passwordChanged: boolean = false): void {
    const users = this.getUsersFromStorage();
    const userIndex = users.findIndex(u => u.username === updatedUser.username);
    
    if (userIndex !== -1) {
      // Update user in localStorage
      users[userIndex] = {
        ...users[userIndex],
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        address: updatedUser.address,
        aadhaar: updatedUser.aadhaar
      };
      
      // Update password if changed
      if (passwordChanged && updatedUser.password) {
        users[userIndex].password = updatedUser.password;
      }
      
      this.saveUsersToStorage(users);
      
      // Update current user session
      const userForSession: User = {
        username: users[userIndex].username,
        name: users[userIndex].name,
        email: users[userIndex].email,
        mobile: users[userIndex].mobile,
        address: users[userIndex].address,
        aadhaar: users[userIndex].aadhaar,
        role: users[userIndex].role
      };
      
      sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userForSession));
      this.currentUserSubject.next(userForSession);
      
      if (passwordChanged) {
        this.logout();
        alert('Password changed successfully! Please log in again.');
      } else {
        alert('Details updated successfully!');
      }
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
  
  isCustomer(): boolean {
    return this.currentUserSubject.value?.role === 'customer';
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getUsername(): string | null {
    return this.currentUserSubject.value?.username || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Method to get user by username (for profile updates)
  getUserByUsername(username: string): User | null {
    const users = this.getUsersFromStorage();
    return users.find(u => u.username === username) || null;
  }

  // Method to check if email exists
  isEmailTaken(email: string): boolean {
    const users = this.getUsersFromStorage();
    return users.some(u => u.email === email);
  }

  // Method to check if username exists (for backward compatibility)
  isUsernameTaken(username: string): boolean {
    const users = this.getUsersFromStorage();
    return users.some(u => u.username === username);
  }

  // Method to reset users to default (for testing)
  resetToDefaultUsers(): void {
    localStorage.removeItem(this.USERS_KEY);
    this.initializeDefaultUsers();
  }
}
