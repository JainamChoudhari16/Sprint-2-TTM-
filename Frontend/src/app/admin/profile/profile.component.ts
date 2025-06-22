import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  updateForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.updateForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: [{ value: '', disabled: true }],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^[a-zA-Z0-9\s\/,]+$/)]],
      changePassword: [false],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    // Subscribe to changes in the 'changePassword' checkbox
    this.updateForm.get('changePassword')?.valueChanges.subscribe(value => {
      const newPassword = this.updateForm.get('newPassword');
      const confirmPassword = this.updateForm.get('confirmPassword');
      if (value) {
        newPassword?.setValidators([Validators.required, Validators.minLength(6)]);
        confirmPassword?.setValidators([Validators.required]);
      } else {
        newPassword?.clearValidators();
        confirmPassword?.clearValidators();
        newPassword?.setValue('');
        confirmPassword?.setValue('');
      }
      newPassword?.updateValueAndValidity();
      confirmPassword?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        // Get full user data from localStorage
        const fullUser = this.authService.getUserByUsername(user.username);
        if (fullUser) {
          this.updateForm.patchValue({
            username: fullUser.username,
            name: fullUser.name,
            email: fullUser.email,
            mobile: fullUser.mobile,
            address: fullUser.address || ''
          });
        }
      }
    });
  }

  // Input restriction methods
  onMobileInput(event: any) {
    const input = event.target;
    const value = input.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    const limitedValue = numericValue.slice(0, 10);
    
    if (value !== limitedValue) {
      input.value = limitedValue;
      this.updateForm.patchValue({ mobile: limitedValue });
    }
  }

  onAddressInput(event: any) {
    const input = event.target;
    const value = input.value;
    const validValue = value.replace(/[^a-zA-Z0-9\s\/,]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.updateForm.patchValue({ address: validValue });
    }
  }

  onNameInput(event: any) {
    const input = event.target;
    const value = input.value;
    const validValue = value.replace(/[^a-zA-Z\s]/g, '');
    
    if (value !== validValue) {
      input.value = validValue;
      this.updateForm.patchValue({ name: validValue });
    }
  }

  // Validation helper methods
  getFieldError(fieldName: string): string {
    const field = this.updateForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field?.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
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
      mobile: 'Mobile Number',
      address: 'Address',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
  }

  getPatternErrorMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      name: 'Name should contain only letters and spaces',
      mobile: 'Mobile number must be exactly 10 digits',
      address: 'Address can contain letters, numbers, spaces, "/", and "," only'
    };
    return messages[fieldName] || 'Invalid format';
  }

  getMinLengthErrorMessage(fieldName: string, requiredLength: number): string {
    const messages: { [key: string]: string } = {
      name: `Name must be at least ${requiredLength} characters`,
      address: `Address must be at least ${requiredLength} characters`,
      newPassword: `Password must be at least ${requiredLength} characters`
    };
    return messages[fieldName] || `Must be at least ${requiredLength} characters`;
  }

  passwordMatchValidator(form: AbstractControl) {
    const changePassword = form.get('changePassword')?.value;
    if (!changePassword) {
      return null;
    }
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.updateForm.valid && this.currentUser) {
      const formValue = this.updateForm.getRawValue();

      // Create an updated user object
      const updatedUser: User = {
        ...this.currentUser,
        name: formValue.name,
        mobile: formValue.mobile,
        address: formValue.address,
        password: this.currentUser.password
      };
      let passwordChanged = false;

      // Handle password update if requested
      if (formValue.changePassword && formValue.newPassword) {
        updatedUser.password = formValue.newPassword;
        passwordChanged = true;
      }
      
      try {
        this.authService.updateUser(updatedUser, passwordChanged);
        alert('Profile updated successfully!');
        this.updateForm.get('changePassword')?.setValue(false);
        this.updateForm.get('newPassword')?.setValue('');
        this.updateForm.get('confirmPassword')?.setValue('');
      } catch (error) {
        alert('Failed to update profile. Please try again.');
        console.error('Update error:', error);
      }
    } else {
      alert('Please fill all required fields correctly.');
      // Mark all fields as touched to show validation errors
      Object.keys(this.updateForm.controls).forEach(key => {
        const control = this.updateForm.get(key);
        if (control && !control.disabled) {
          control.markAsTouched();
        }
      });
    }
  }
}
