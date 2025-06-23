import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^[a-zA-Z0-9\s\/,]+$/)]],
      aadhaar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  getFieldError(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors?.['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (control.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors?.['pattern']) {
        return this.getPatternErrorMessage(fieldName);
      }
    }
    return '';
  }

  onNameInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Allow only letters and spaces
    const validValue = value.replace(/[^a-zA-Z\s]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.registerForm.patchValue({ name: validValue });
    }
  }

  onUsernameInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Allow only letters, numbers, and underscore
    const validValue = value.replace(/[^a-zA-Z0-9_]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.registerForm.patchValue({ username: validValue });
    }
  }

  onMobileInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Allow only numbers
    const validValue = value.replace(/[^0-9]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.registerForm.patchValue({ mobile: validValue });
    }
  }

  onAddressInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Allow letters, numbers, spaces, "/", and ","
    const validValue = value.replace(/[^a-zA-Z0-9\s\/,]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.registerForm.patchValue({ address: validValue });
    }
  }

  onAadhaarInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Allow only numbers
    const validValue = value.replace(/[^0-9]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.registerForm.patchValue({ aadhaar: validValue });
    }
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Full Name',
      username: 'Username',
      email: 'Email',
      mobile: 'Mobile Number',
      address: 'Address',
      aadhaar: 'Aadhaar Number',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
  }

  getPatternErrorMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      name: 'Name should contain only letters and spaces',
      username: 'Username should contain only letters, numbers, and underscore',
      mobile: 'Mobile number must be exactly 10 digits',
      address: 'Address can contain letters, numbers, spaces, "/", and "," only',
      aadhaar: 'Aadhaar number must be exactly 12 digits'
    };
    return messages[fieldName] || 'Invalid format';
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
    
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      const userToRegister = { ...userData, role: 'customer' };

      // Check if email already exists
      if (this.authService.isEmailTaken(userToRegister.email)) {
        this.errorMessage = 'Email already exists. Please use a different email address.';
        this.isLoading = false;
        return;
      }

      // Check if username already exists
      if (this.authService.isUsernameTaken(userToRegister.username)) {
        this.errorMessage = 'Username already exists. Please choose a different username.';
        this.isLoading = false;
        return;
      }

      this.authService.register(userToRegister).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            alert('Registration successful! Please login with your email address.');
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
    } else {
      this.isLoading = false;
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
