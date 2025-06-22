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

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Input restriction methods
  onMobileInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    const limitedValue = numericValue.slice(0, 10);
    
    if (value !== limitedValue) {
      input.value = limitedValue;
      this.registerForm.patchValue({ mobile: limitedValue });
    }
  }

  onAadhaarInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Limit to 12 digits
    const limitedValue = numericValue.slice(0, 12);
    
    if (value !== limitedValue) {
      input.value = limitedValue;
      this.registerForm.patchValue({ aadhaar: limitedValue });
    }
  }

  onAddressInput(event: any) {
    const input = event.target;
    const value = input.value;
    // Allow only letters, numbers, spaces, "/", and ","
    const validValue = value.replace(/[^a-zA-Z0-9\s\/,]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.registerForm.patchValue({ address: validValue });
    }
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

  // Validation helper methods
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field?.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field?.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field?.errors?.['pattern']) {
        return this.getPatternErrorMessage(fieldName);
      }
      if (field?.errors?.['minlength']) {
        return this.getMinLengthErrorMessage(fieldName, field.errors['minlength'].requiredLength);
      }
    }
    return '';
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

  getMinLengthErrorMessage(fieldName: string, requiredLength: number): string {
    const messages: { [key: string]: string } = {
      name: `Name must be at least ${requiredLength} characters`,
      username: `Username must be at least ${requiredLength} characters`,
      address: `Address must be at least ${requiredLength} characters`,
      password: `Password must be at least ${requiredLength} characters`
    };
    return messages[fieldName] || `Must be at least ${requiredLength} characters`;
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
    
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      const userToRegister = { ...userData, role: 'customer' };

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
            alert('Registration successful! Please login.');
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
