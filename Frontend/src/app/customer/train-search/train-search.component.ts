import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface Train {
  train: string;
  origin: string;
  destination: string;
  classes: { [key: string]: number };
}

@Component({
  selector: 'app-train-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './train-search.component.html',
  styleUrl: './train-search.component.scss'
})
export class TrainSearchComponent implements OnInit {
  searchForm: FormGroup;
  bookingForm: FormGroup;
  searchResults: Train[] = [];
  expandedDetails: { [key: number]: boolean } = {};
  minDate: string = '';
  searched: boolean = false;
  showBookingForm: boolean = false;
  selectedTrain: Train | null = null;
  selectedClass: string = '';

  // Dummy train data with seat classes
  private dummyTrains: Train[] = [
    { train: "Express A", origin: "Solapur", destination: "Mumbai", classes: { Sleeper: 120, AC: 50, First: 30 } },
    { train: "Superfast B", origin: "Ahmedabad", destination: "Surat", classes: { Sleeper: 80, AC: 40, First: 30 } },
    { train: "Local C", origin: "Gandhinagar", destination: "Mumbai", classes: { Sleeper: 60, AC: 40, First: 30 } },
    { train: "Express D", origin: "Mumbai", destination: "Ahmedabad", classes: { Sleeper: 70, AC: 20, First: 10 } },
    { train: "Superfast E", origin: "Surat", destination: "Solapur", classes: { Sleeper: 40, AC: 30, First: 10 } },
    { train: "Local F", origin: "Gandhinagar", destination: "Surat", classes: { Sleeper: 20, AC: 20, First: 10 } },
    { train: "Express G", origin: "Ahmedabad", destination: "Solapur", classes: { Sleeper: 60, AC: 40, First: 20 } },
    { train: "Superfast H", origin: "Mumbai", destination: "Gandhinagar", classes: { Sleeper: 30, AC: 40, First: 20 } },
    { train: "Local I", origin: "Surat", destination: "Ahmedabad", classes: { Sleeper: 20, AC: 30, First: 10 } },
    { train: "Express J", origin: "Solapur", destination: "Gandhinagar", classes: { Sleeper: 50, AC: 40, First: 20 } },
    { train: "Superfast K", origin: "Mumbai", destination: "Surat", classes: { Sleeper: 60, AC: 60, First: 20 } },
    { train: "Local L", origin: "Ahmedabad", destination: "Gandhinagar", classes: { Sleeper: 30, AC: 30, First: 10 } },
    { train: "Express M", origin: "Gandhinagar", destination: "Solapur", classes: { Sleeper: 80, AC: 60, First: 20 } },
    { train: "Superfast N", origin: "Surat", destination: "Mumbai", classes: { Sleeper: 90, AC: 70, First: 20 } },
    { train: "Local O", origin: "Ahmedabad", destination: "Mumbai", classes: { Sleeper: 60, AC: 60, First: 10 } },
    { train: "Express P", origin: "Solapur", destination: "Ahmedabad", classes: { Sleeper: 70, AC: 60, First: 10 } },
    { train: "Superfast Q", origin: "Mumbai", destination: "Gandhinagar", classes: { Sleeper: 60, AC: 50, First: 10 } },
    { train: "Local R", origin: "Surat", destination: "Gandhinagar", classes: { Sleeper: 30, AC: 40, First: 20 } },
    { train: "Express S", origin: "Ahmedabad", destination: "Solapur", classes: { Sleeper: 60, AC: 40, First: 10 } },
    { train: "Superfast T", origin: "Mumbai", destination: "Surat", classes: { Sleeper: 50, AC: 40, First: 10 } },
    { train: "Superfast O", origin: "Chennai", destination: "Ahmedabad", classes: { Sleeper: 50, AC: 40, First: 10 }}
  ];

  private allowedLocations = ["Solapur", "Ahmedabad", "Mumbai", "Gandhinagar", "Surat", "Chennai"];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]{2,}$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      numTickets: ['', [Validators.required, Validators.min(1), Validators.max(6)]],
      paymentMethod: ['', Validators.required],
      specialRequests: [''],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Save dummy data in localStorage if not already present
    if (!localStorage.getItem('trains')) {
      localStorage.setItem('trains', JSON.stringify(this.dummyTrains));
    }

    // Set minimum date to today
    this.minDate = new Date().toISOString().split("T")[0];
    this.searchForm.get('date')?.setValidators([
      Validators.required,
      this.minDateValidator(this.minDate)
    ]);
  }

  private toTitleCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private minDateValidator(minDate: string) {
    return (control: any) => {
      if (!control.value) return null;
      return control.value >= minDate ? null : { minDate: true };
    };
  }

  searchTrains(): void {
    if (this.searchForm.invalid) {
      return;
    }

    let origin = this.toTitleCase(this.searchForm.get('origin')?.value.trim());
    let destination = this.toTitleCase(this.searchForm.get('destination')?.value.trim());
    let travelDate = this.searchForm.get('date')?.value.trim();

    if (!this.allowedLocations.includes(origin) || !this.allowedLocations.includes(destination)) {
      alert("No Train for that route");
      this.searchResults = [];
      this.searched = true;
      return;
    }

    if (origin === destination) {
      alert("Origin and Destination cannot be the same!");
      this.searchResults = [];
      this.searched = true;
      return;
    }

    if (!travelDate) {
      alert("Please select a travel date.");
      this.searchResults = [];
      this.searched = true;
      return;
    }

    const trains = JSON.parse(localStorage.getItem('trains') || '[]');
    this.searchResults = trains.filter((t: Train) => 
      t.origin === origin && t.destination === destination
    );

    this.searched = true;

    if (this.searchResults.length === 0) {
      alert("No Train for that route");
      return;
    }

    // Reset expanded details
    this.expandedDetails = {};
  }

  toggleDetails(index: number): void {
    this.expandedDetails[index] = !this.expandedDetails[index];
  }

  getClassEntries(classes: { [key: string]: number }): [string, number][] {
    return Object.entries(classes);
  }

  getClassDescription(className: string): string {
    const descriptions: { [key: string]: string } = {
      'Sleeper': 'Economy class with sleeping berths',
      'AC': 'Air-conditioned comfort',
      'First': 'Premium first class experience'
    };
    return descriptions[className] || 'Standard class';
  }

  getClassPrice(className: string): number {
    const prices: { [key: string]: number } = {
      'Sleeper': 500,
      'AC': 1200,
      'First': 2500
    };
    return prices[className] || 500;
  }

  getSeatBadgeClass(seats: number): string {
    if (seats === 0) return 'bg-danger';
    if (seats <= 10) return 'bg-warning';
    return 'bg-success';
  }

  selectTrain(train: Train, className: string): void {
    if (!this.authService.isAuthenticated()) {
      alert('Please login first to book tickets');
      this.router.navigate(['/login']);
      return;
    }

    this.selectedTrain = train;
    this.selectedClass = className;
    this.showBookingForm = true;
    
    // Pre-fill form with user data if available
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.bookingForm.patchValue({
        name: currentUser.name,
        mobile: currentUser.mobile
      });
    }
  }

  closeBookingForm(): void {
    this.showBookingForm = false;
    this.selectedTrain = null;
    this.selectedClass = '';
    this.bookingForm.reset();
  }

  getTotalPrice(): number {
    const numTickets = this.bookingForm.get('numTickets')?.value || 0;
    return numTickets * this.getClassPrice(this.selectedClass);
  }

  getServiceCharges(): number {
    return 50; // Fixed service charge
  }

  getFinalTotal(): number {
    return this.getTotalPrice() + this.getServiceCharges();
  }

  confirmBooking(): void {
    if (this.bookingForm.invalid) {
      return;
    }

    const formValue = this.bookingForm.getRawValue();
    const ticketId = 'TK' + Math.floor(1000 + Math.random() * 9000);
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      alert('You must be logged in to book a ticket.');
      this.router.navigate(['/login']);
      return;
    }

    // Create new booking record
    const newBooking = {
      date: this.searchForm.get('date')?.value,
      train: this.selectedTrain?.train,
      status: 'Confirmed',
      origin: this.selectedTrain?.origin,
      destination: this.selectedTrain?.destination,
      seats: formValue.numTickets,
      class: this.selectedClass,
      user: currentUser,
      ticketId: ticketId,
      totalAmount: this.getFinalTotal()
    };

    // Add to booking history
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Update seat availability
    this.updateSeatAvailability();

    // Show success message
    alert(`Booking confirmed! Ticket ID: ${ticketId}\nTotal Amount: ₹${this.getFinalTotal()}`);
    
    // Close booking form and refresh search results
    this.closeBookingForm();
    this.searchTrains();
  }

  private updateSeatAvailability(): void {
    if (!this.selectedTrain || !this.selectedClass) return;

    const trains = JSON.parse(localStorage.getItem('trains') || '[]');
    const trainIndex = trains.findIndex((t: Train) => 
      t.train === this.selectedTrain?.train && 
      t.origin === this.selectedTrain?.origin && 
      t.destination === this.selectedTrain?.destination
    );

    if (trainIndex !== -1) {
      const numTickets = this.bookingForm.get('numTickets')?.value || 1;
      trains[trainIndex].classes[this.selectedClass] -= numTickets;
      localStorage.setItem('trains', JSON.stringify(trains));
    }
  }

  // Legacy method for backward compatibility
  bookNow(train: string, cls: string, origin: string, destination: string, date: string): void {
    // Save the intended booking details before checking for authentication
    localStorage.setItem('selectedBooking', JSON.stringify({
      train, cls, origin, destination, date
    }));

    if (!this.authService.isAuthenticated()) {
      alert('Please login first to book tickets');
      this.router.navigate(['/login']);
      return;
    }
    
    this.router.navigate(['/customer/book-ticket']);
  }

  private checkAuthForBooking(): boolean {
    if (!this.authService.isAuthenticated()) {
      alert('Please login first to book tickets');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
