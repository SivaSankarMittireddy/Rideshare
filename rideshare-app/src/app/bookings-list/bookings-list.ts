import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, BookingStorageService } from '../services/booking-storage.service';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.html',
  styleUrls: ['./bookings-list.css']
})
export class BookingsListComponent implements OnInit {
  bookings: Booking[] = [];
  feedback = '';

  constructor(
    private bookingStorage: BookingStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  /**
   * Load all bookings from session storage
   */
  loadBookings() {
    this.bookings = this.bookingStorage.getAllBookings();
  }

  /**
   * Cancel a booking
   */
  cancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const removed = this.bookingStorage.removeBooking(bookingId);
      if (removed) {
        this.feedback = 'Booking cancelled successfully';
        this.loadBookings(); // Refresh the list
        setTimeout(() => {
          this.feedback = '';
        }, 3000);
      } else {
        this.feedback = 'Failed to cancel booking';
      }
    }
  }

  /**
   * Format ride time to readable format
   */
  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Format booking date to readable format
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Navigate back to dashboard
   */
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigate to search rides page
   */
  searchRides() {
    this.router.navigate(['/search-ride']);
  }
}