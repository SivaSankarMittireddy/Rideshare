import { Injectable } from '@angular/core';
import { Ride } from './rides-storage.service';

export interface Booking {
  bookingId: string; // Unique booking ID
  bookingEmployeeId: string; // Employee who booked the ride
  rideOwnerId: string; // Employee who owns the ride
  vehicleType: string;
  vehicleNo: string;
  pickup: string;
  destination: string;
  time: string;
  bookingDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingStorageService {
  private storageKey = 'employeeBookings';

  constructor() {}

  /**
   * Get all bookings for the current employee from session storage
   */
  getAllBookings(): Booking[] {
    const stored = sessionStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const bookings = JSON.parse(stored);
        // Convert date strings back to Date objects
        return bookings.map((booking: any) => ({
          ...booking,
          bookingDate: new Date(booking.bookingDate)
        }));
      } catch (error) {
        console.error('Error parsing stored bookings:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * Get bookings for a specific employee
   */
  getBookingsByEmployeeId(employeeId: string): Booking[] {
    return this.getAllBookings().filter(booking => booking.bookingEmployeeId === employeeId);
  }

  /**
   * Check if an employee has already booked a specific ride
   */
  hasEmployeeBookedRide(employeeId: string, rideOwnerId: string): boolean {
    return this.getAllBookings().some(
      booking => booking.bookingEmployeeId === employeeId && booking.rideOwnerId === rideOwnerId
    );
  }

  /**
   * Check if an employee has any booking at all
   */
  hasEmployeeAnyBooking(employeeId: string): boolean {
    return this.getBookingsByEmployeeId(employeeId).length > 0;
  }

  /**
   * Add a new booking to session storage
   */
  addBooking(ride: Ride, bookingEmployeeId: string): Booking {
    const bookings = this.getAllBookings();
    
    const booking: Booking = {
      bookingId: this.generateBookingId(),
      bookingEmployeeId,
      rideOwnerId: ride.employeeId,
      vehicleType: ride.vehicleType,
      vehicleNo: ride.vehicleNo,
      pickup: ride.pickup,
      destination: ride.destination,
      time: ride.time,
      bookingDate: new Date()
    };

    bookings.push(booking);
    this.saveAllBookings(bookings);
    
    return booking;
  }

  /**
   * Remove a booking from session storage
   */
  removeBooking(bookingId: string): boolean {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.bookingId === bookingId);
    
    if (index > -1) {
      bookings.splice(index, 1);
      this.saveAllBookings(bookings);
      return true;
    }
    return false;
  }

  /**
   * Clear all bookings from session storage
   */
  clearAllBookings(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  /**
   * Save all bookings to session storage
   */
  private saveAllBookings(bookings: Booking[]): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(bookings));
  }

  /**
   * Generate unique booking ID
   */
  private generateBookingId(): string {
    return 'BOOKING_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}