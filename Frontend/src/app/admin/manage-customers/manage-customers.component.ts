import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-manage-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-customers.component.html',
  styleUrl: './manage-customers.component.scss'
})
export class ManageCustomersComponent implements OnInit {
  customers: User[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    // Filter out admins to only show customers
    this.customers = allUsers.filter(user => user.role === 'customer');
  }

  deleteCustomer(customerToDelete: User): void {
    if (confirm(`Are you sure you want to delete the user "${customerToDelete.username}"? This action cannot be undone.`)) {
      let allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      allUsers = allUsers.filter(user => user.email !== customerToDelete.email);
      localStorage.setItem('users', JSON.stringify(allUsers));
      this.loadCustomers(); // Refresh the view
    }
  }
}
