import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface Booking {
  date: string;
  train: string;
  status: string;
  origin: string;
  destination: string;
  seats: number;
  user: User;
  ticketId?: string; // Optional: for display
}

@Component({
  selector: 'app-view-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-tickets.component.html',
  styleUrl: './view-tickets.component.scss'
})
export class ViewTicketsComponent implements OnInit {
  tickets: Booking[] = [];
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTickets();
  }

  loadTickets() {
    const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
    console.log('All bookings from localStorage:', allBookings);
    console.log('Current user for filtering:', this.currentUser);

    // Filter bookings for the current user, by matching email
    if (this.currentUser) {
      this.tickets = allBookings.filter(booking => {
        const isMatch = booking.user?.email === this.currentUser?.email && booking.status !== 'Cancelled';
        console.log(
          `Comparing booking for ${booking.user?.email} with current user ${this.currentUser?.email}. Match: ${isMatch}`
        );
        return isMatch;
      });
    } else {
      console.log('No current user found. Cannot filter tickets.');
      this.tickets = [];
    }
  }

  cancelTicket(bookingToCancel: Booking) {
    if (confirm('Are you sure you want to cancel this ticket?')) {
      const allBookings: Booking[] = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      // Find the original booking and update its status
      const bookingIndex = allBookings.findIndex(b => 
        b.date === bookingToCancel.date && 
        b.train === bookingToCancel.train &&
        b.user.email === bookingToCancel.user.email
      );

      if (bookingIndex !== -1) {
        allBookings[bookingIndex].status = 'Cancelled';
        localStorage.setItem('bookings', JSON.stringify(allBookings));
        this.loadTickets(); // Refresh the view
      }
    }
  }
}
