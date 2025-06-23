import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
    
    if (this.adminLoginForm.valid) {
      const { email, password } = this.adminLoginForm.value;
      
      this.authService.login$(email, password).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser && currentUser.role === 'admin') {
              // Admin login successful, navigation handled by auth service
            } else {
              this.errorMessage = 'Access denied. Admin privileges required.';
              this.authService.logout();
            }
          } else {
            this.errorMessage = 'Invalid credentials. Please try again.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.errorMessage = 'Login failed. Please try again.';
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
