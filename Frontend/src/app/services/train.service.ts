import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Train {
  id: number;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  fare: number;
}

@Injectable({ providedIn: 'root' })
export class TrainService {
  private readonly API_URL = '/api/trains';
  constructor(private http: HttpClient) {}

  searchTrains(source: string, destination: string, date: string): Observable<Train[]> {
    return this.http.get<Train[]>(`${this.API_URL}/search`, {
      params: { source, destination, date }
    });
  }
} 