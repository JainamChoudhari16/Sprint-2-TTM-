import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingRequest {
  trainId: number;
  journeyDate: string;
  passengers: { name: string; age: number; gender: string }[];
}

export interface Booking {
  id: number;
  userId: number;
  username: string;
  train: any;
  journeyDate: string;
  seatsBooked: number;
  totalFare: number;
  passengers: { name: string; age: number; gender: string }[];
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly API_URL = '/api/bookings';
  constructor(private http: HttpClient) {}

  bookTicket(request: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.API_URL, request);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.API_URL);
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
} 