import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

interface BookingData {
  ticketId: string;
  train: string;
  origin: string;
  destination: string;
  date: string;
  name: string;
  category: string;
  numTickets: number;
}

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.scss'
})
export class BookTicketComponent implements OnInit {
  bookingForm: FormGroup;
  minDate: string = '';
  userId: string = '';
  showConfirmation: boolean = false;
  bookingData: BookingData | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]{2,}$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      date: ['', Validators.required],
      boarding: ['', Validators.required],
      destination: ['', Validators.required],
      category: ['', Validators.required],
      train: [{ value: '', disabled: true }],
      numTickets: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      paymentMethod: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    this.minDate = today;

    // Get user from auth service
    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.username || 'USER123'; // Fallback for safety

    // Pre-fill from localStorage if available
    const selected = JSON.parse(localStorage.getItem('selectedBooking') || 'null');
    if (selected) {
      this.bookingForm.patchValue({
        boarding: selected.origin,
        destination: selected.destination,
        category: selected.cls,
        date: selected.date,
        train: selected.train
      });
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.getRawValue();
      const ticketId = 'TK' + Math.floor(1000 + Math.random() * 9000);
      const currentUser = this.authService.getCurrentUser();

      // Ensure we have a valid user before proceeding
      if (!currentUser) {
        alert('You must be logged in to book a ticket.');
        this.router.navigate(['/login']);
        return;
      }

      // Create new booking record for history
      const newBooking = {
        date: formValue.date,
        train: formValue.train,
        status: 'Confirmed',
        origin: formValue.boarding,
        destination: formValue.destination,
        seats: formValue.numTickets,
        user: currentUser, // Save the entire current user object
      };

      // Add to booking history in localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      // Create booking data for confirmation display
      this.bookingData = {
        ticketId: ticketId,
        train: formValue.train,
        origin: formValue.boarding,
        destination: formValue.destination,
        date: formValue.date,
        name: formValue.name,
        category: formValue.category,
        numTickets: formValue.numTickets
      };
      
      // Clear the pending booking from search
      localStorage.removeItem('selectedBooking');

      // Show confirmation
      this.showConfirmation = true;
    }
  }

  downloadTicket() {
    if (!this.bookingData) {
      console.error('Booking data is not available.');
      alert('Could not download ticket. Booking data is missing.');
      return;
    }

    const { ticketId, train, origin, destination, date, name, category, numTickets } = this.bookingData;
    const currentUser = this.authService.getCurrentUser();
    const passengerName = name || currentUser?.name || 'N/A';
    const passengerMobile = currentUser?.mobile || 'N/A';

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
    doc.text(`Name: ${passengerName}`, 20, 85);
    doc.text(`Mobile: ${passengerMobile}`, 20, 95);
    doc.text(`Category: ${category}`, 20, 105);
    doc.text(`Number of Seats: ${numTickets}`, 20, 115);
    
    // Add journey details
    doc.setFontSize(14);
    doc.setTextColor(91, 155, 213);
    doc.text('JOURNEY DETAILS', 20, 140);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Train: ${train}`, 20, 155);
    doc.text(`From: ${origin}`, 20, 165);
    doc.text(`To: ${destination}`, 20, 175);
    doc.text(`Travel Date: ${date}`, 20, 185);
    
    // Add status
    doc.setFontSize(14);
    doc.setTextColor(91, 155, 213);
    doc.text('STATUS', 20, 210);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 128, 0); // Green color for confirmed
    doc.text('CONFIRMED', 20, 225);
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This is an electronic ticket. Please carry a valid ID proof.', 20, 270);
    doc.text('For any queries, contact our customer support.', 20, 275);
    
    // Save the PDF
    doc.save(`ticket-${ticketId}.pdf`);
  }

  bookAnotherTicket() {
    this.showConfirmation = false;
    this.bookingForm.reset();
    this.bookingData = null;
  }
}
