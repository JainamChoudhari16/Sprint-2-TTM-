import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

declare var bootstrap: any;

interface Booking {
  date: string;
  train: string;
  status: string;
  origin: string;
  destination: string;
  seats: number;
  user: {
    name: string;
    mobile: string;
  };
  ticketId?: string; // Add ticket ID for PDF generation
}

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.scss'
})
export class BookingHistoryComponent implements OnInit {
  filterForm: FormGroup;
  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  selectedBooking: Booking | null = null;
  allowedLocations = ["Solapur", "Ahmedabad", "Mumbai", "Gandhinagar", "Surat"];
  private detailsModal: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      date: [''],
      train: [''],
      origin: [''],
      destination: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.loadBookings();
    this.filteredBookings = [...this.allBookings];
    this.detailsModal = new bootstrap.Modal(document.getElementById('bookingDetailsModal'));
  }

  loadBookings() {
    // Dummy data
    const dummyBookings: Booking[] = [
      {
        date: "2025-05-15",
        train: "Express A",
        status: "Confirmed",
        origin: "Solapur",
        destination: "Mumbai",
        seats: 2,
        user: { name: 'Anand', mobile: '9876543210' },
        ticketId: 'TK1234'
      },
      {
        date: "2025-05-10",
        train: "Superfast B",
        status: "Cancelled",
        origin: "Ahmedabad",
        destination: "Surat",
        seats: 1,
        user: { name: 'Anand', mobile: '9876543210' },
        ticketId: 'TK1235'
      },
      {
        date: "2025-05-20",
        train: "Local C",
        status: "Pending",
        origin: "Gandhinagar",
        destination: "Mumbai",
        seats: 4,
        user: { name: 'Anand', mobile: '9876543210' },
        ticketId: 'TK1236'
      }
    ];

    // Get user tickets from localStorage
    const tickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    tickets.forEach((ticket: any) => {
      const booking: Booking = {
        date: ticket.boardingTime,
        train: ticket.trainId,
        status: "Confirmed",
        origin: ticket.boarding,
        destination: ticket.destination,
        seats: ticket.seats,
        user: { name: 'Current User', mobile: '1234567890' }, // Placeholder user
        ticketId: ticket.ticketId || 'TK' + Math.floor(1000 + Math.random() * 9000)
      };
      dummyBookings.push(booking);
    });

    // Save to localStorage if not present
    if (!localStorage.getItem('bookings')) {
      localStorage.setItem('bookings', JSON.stringify(dummyBookings));
    }

    this.allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Ensure all bookings have ticket IDs
    this.allBookings = this.allBookings.map(booking => ({
      ...booking,
      ticketId: booking.ticketId || 'TK' + Math.floor(1000 + Math.random() * 9000)
    }));
    
    // Update localStorage with ticket IDs
    localStorage.setItem('bookings', JSON.stringify(this.allBookings));
    
    this.filterForm.reset({ date: '', train: '', origin: '', destination: '', status: '' });
    this.filteredBookings = [...this.allBookings];
  }

  filterBookings() {
    const filters = this.filterForm.value;
    const { date, train, status, origin, destination } = filters;

    // Validate locations
    if ((origin && !this.allowedLocations.includes(origin)) || 
        (destination && !this.allowedLocations.includes(destination))) {
      alert("No Train for that route");
      this.filteredBookings = [];
      return;
    }

    this.filteredBookings = this.allBookings.filter(booking => {
      const matchDate = !date || booking.date === date;
      const matchTrain = !train || booking.train.toLowerCase().includes(train.toLowerCase());
      const matchStatus = !status || booking.status === status;
      const matchOrigin = !origin || booking.origin === origin;
      const matchDestination = !destination || booking.destination === destination;
      
      return matchDate && matchTrain && matchStatus && matchOrigin && matchDestination;
    });

    // Show alert if no matches found for origin/destination
    if ((origin || destination) && this.filteredBookings.length === 0) {
      alert("No Train for that route");
    }
  }

  resetFilters() {
    this.filterForm.reset();
    this.filteredBookings = [...this.allBookings];
  }

  showDetails(booking: Booking): void {
    this.selectedBooking = booking;
    this.detailsModal.show();
  }

  downloadTicket(booking: Booking): void {
    // Generate ticket ID if not present
    const ticketId = booking.ticketId || 'TK' + Math.floor(1000 + Math.random() * 9000);
    
    // Create PDF
    const doc = new jsPDF.default();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(91, 155, 213); // Blue color
    doc.text('TRAIN E-TICKET', 105, 20, { align: 'center' });
    
    // Add ticket ID
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Ticket ID: ${ticketId}`, 20, 40);
    doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Add passenger details
    doc.setFontSize(14);
    doc.setTextColor(91, 155, 213);
    doc.text('PASSENGER DETAILS', 20, 70);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${booking.user.name}`, 20, 85);
    doc.text(`Mobile: ${booking.user.mobile}`, 20, 95);
    doc.text(`Number of Seats: ${booking.seats}`, 20, 105);
    
    // Add journey details
    doc.setFontSize(14);
    doc.setTextColor(91, 155, 213);
    doc.text('JOURNEY DETAILS', 20, 130);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Train: ${booking.train}`, 20, 145);
    doc.text(`From: ${booking.origin}`, 20, 155);
    doc.text(`To: ${booking.destination}`, 20, 165);
    doc.text(`Travel Date: ${booking.date}`, 20, 175);
    
    // Add status
    doc.setFontSize(14);
    doc.setTextColor(91, 155, 213);
    doc.text('STATUS', 20, 200);
    
    doc.setFontSize(10);
    if (booking.status === 'Confirmed') {
      doc.setTextColor(0, 128, 0); // Green color for confirmed
      doc.text('CONFIRMED', 20, 215);
    } else if (booking.status === 'Cancelled') {
      doc.setTextColor(220, 53, 69); // Red color for cancelled
      doc.text('CANCELLED', 20, 215);
    } else {
      doc.setTextColor(255, 193, 7); // Yellow color for pending
      doc.text('PENDING', 20, 215);
    }
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This is an electronic ticket. Please carry a valid ID proof.', 20, 270);
    doc.text('For any queries, contact our customer support.', 20, 275);
    
    // Save the PDF
    doc.save(`ticket-${ticketId}.pdf`);
  }
}
