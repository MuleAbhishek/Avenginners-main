import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';  // Use map for transformation
import { Ancillary, Flight } from 'src/app/Models/booking.model';  // Adjust path
import { SeatType as Seat } from 'src/app/Models/booking.model';  // Alias for SeatType
import { TransportMode } from 'src/app/Models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';  // Backend URL

  constructor(private http: HttpClient) {}

  /**
   * Search flights by from, to, and date (with mock fallback).
   */
  
  searchFlights(from: string, to: string, date: string): Observable<Flight[]> {
    const params = { from, to, date };
    console.log('API Call: Searching flights from', from, 'to', to, 'on', date);

    return this.http.get<Flight[]>(`${this.apiUrl}/flights/search`, { params }).pipe(
      map(response => {
        console.log('API Response:', response);
        // Fallback: If empty or null, return mocks (all paths return Flight[])
        if (!response || response.length === 0) {
          console.warn('No flights from backend—using mock data');
          return this.getMockFlights(from, to, date);
        }
        return response;
      }),
      catchError(this.handleError('searchFlights', []))
    );
  }

  /**
   * Get available seats for a flight (mock for now).
   * @param flightId Flight ID
   * @returns Observable<Seat[]>
   */
  getSeats(flightId: number): Observable<Seat[]> {
    console.log('API Call: Getting seats for flight', flightId);
    // Mock: Simulate backend call; replace with http.get later
    return of(this.getMockSeats(flightId)).pipe(
      catchError(this.handleError('getSeats', []))
    );
  }

  /**
   * Get transport modes for pre/post-flight (mock for now).
   * @param type 'pre' or 'post'
   * @param address User address
   * @param airportCode Airport code (e.g., 'DEL')
   * @returns Observable<TransportMode[]>
   */
  getTransportModes(type: 'pre' | 'post', address: string, airportCode: string): Observable<TransportMode[]> {
    console.log('API Call: Getting transport modes for', type, 'at', airportCode, 'from', address);
    // Mock: Simulate backend; replace with http.get later
    return of(this.getMockTransportModes(type, address, airportCode)).pipe(
      catchError(this.handleError('getTransportModes', []))
    );
  }

  // Private mock methods (expand as needed)
  // private getMockFlights(from: string, to: string, date: string): Flight[] {
  //   return [
  //     {
  //       id: 1, flightNumber: 'AI-101', fromAirport: `${from} (DEL)`, toAirport: `${to} (BOM)`,
  //       departureTime: '08:00 AM', arrivalTime: '10:30 AM', duration: '2h 30m', price: 4500,
  //       seatsAvailable: 120, airline: 'AIRO', date: `${date} 10/5/2025`
  //     },
  //     {
  //       id: 2, flightNumber: 'AI-102', fromAirport: `${from} (DEL)`, toAirport: `${to} (BOM)`,
  //       departureTime: '12:00 PM', arrivalTime: '02:30 PM', duration: '2h 30m', price: 5200,
  //       seatsAvailable: 80, airline: 'Airline XYZ', date
  //     },
  //     {
  //       id: 3, flightNumber: 'AI-103', fromAirport: `${from} (DEL)`, toAirport: `${to} (BOM)`,
  //       departureTime: '06:00 PM', arrivalTime: '08:30 PM', duration: '2h 30m', price: 3800,
  //       seatsAvailable: 150, airline: 'Airline XYZ', date
  //     }
  //   ];
  // }
   private getMockFlights(from: string, to: string, date: string): Flight[] {
      return [
        {
          id: 1, 
          flightNumber: 'AI-101', 
          fromAirport: `${from} (DEL)`, 
          toAirport: `${to} (BOM)`,
          departureTime: '08:00 AM', 
          arrivalTime: '10:30 PM', 
          duration: '2h 30m', 
          price: 4500,
          seatsAvailable: 120, 
          airline: 'Air India',  // FIXED: Corrected from 'AIRO'
          date: date  // FIXED: Use input date (e.g., '2024-10-01')
        },
        {
           id: 2, 
          flightNumber: 'AI-102', 
          fromAirport: `${from} (DEL)`, 
          toAirport: `${to} (BOM)`,
          departureTime: '12:00 PM', 
          arrivalTime: '02:30 PM', 
          duration: '2h 30m', 
          price: 5200,
          seatsAvailable: 80, 
          airline: 'Air India', 
          date: date  // FIXED: Added missing date: date
        },
        {
          id: 3, 
          flightNumber: 'AI-103', 
          fromAirport: `${from} (DEL)`, 
          toAirport: `${to} (BOM)`,
          departureTime: '06:00 PM', 
          arrivalTime: '08:30 PM', 
          duration: '2h 30m', 
          price: 3800,
          seatsAvailable: 150, 
          airline: 'Air India', 
          date: date  // FIXED: Added missing date: date
        }
      ];
    }

  private getMockSeats(flightId: number): Seat[] {
    // Mock seats based on SeatType interface
    return [
      {
          type: 'Economy', price: 0, seatsAvailable: 100, selected: false,
          id: 123
      },
      {
          type: 'Business', price: 2000, seatsAvailable: 20, selected: false,
          id: 124
      },
      {
          type: 'First', price: 5000, seatsAvailable: 5, selected: false,
          id: 125
      }
    ];
  }

  private getMockTransportModes(type: 'pre' | 'post', address: string, airportCode: string): TransportMode[] {
    const baseModes: TransportMode[] = [
      { id: 1, name: 'Taxi', description: 'Door-to-door service', price: 500, estimatedTime: '20-30 mins', available: true, modeType: type },
      { id: 2, name: 'Metro', description: 'Public transport to airport', price: 50, estimatedTime: '45-60 mins', available: true, modeType: type },
      { id: 3, name: 'Shuttle', description: 'Shared airport shuttle', price: 200, estimatedTime: '30-45 mins', available: true, modeType: type }
    ];
    console.log('Mock transport modes loaded for', type);
    return baseModes;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error.message);
      if (error.error instanceof ErrorEvent) {
        console.error('Client error:', error.error.message);
      } else {
        console.error(`Server error: ${error.status} - ${error.message}`);
      }
      return of(result as T);
    };
  }

  // Other methods (e.g., createBooking)
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData).pipe(
      catchError(this.handleError('createBooking'))
    );
  }

  getAncillaries(): Observable<Ancillary[]> {
  console.log('API Call: Getting ancillaries');
  // Mock: Simulate backend; replace with http.get later
  return of(this.getMockAncillaries()).pipe(
    catchError(this.handleError('getAncillaries', []))
  );
}
// NEW: Mock ancillaries based on Ancillary interface
private getMockAncillaries(): Ancillary[] {
  return [
    { id: 1, name: 'Extra Baggage (20kg)', description: 'Additional checked baggage', price: 800, category: 'baggage', selected: false },
    { id: 2, name: 'Veg Meal', description: 'Vegetarian in-flight meal', price: 300, category: 'meal', selected: false },
    { id: 3, name: 'Window Seat', description: 'Preferred window seat selection', price: 500, category: 'seat', selected: false },
    { id: 4, name: 'Priority Boarding', description: 'Fast-track boarding', price: 400, category: 'other', selected: false },
    { id: 5, name: 'Travel Insurance', description: 'Basic trip protection', price: 600, category: 'other', selected: false }
  ];
}
}