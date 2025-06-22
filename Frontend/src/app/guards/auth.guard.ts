import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user is trying to access admin routes
  if (state.url.startsWith('/admin')) {
    if (!authService.isAdmin()) {
      router.navigate(['/login']);
      return false;
    }
  }

  // Check if user is trying to access customer routes
  if (state.url.startsWith('/customer')) {
    if (!authService.isCustomer()) {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
