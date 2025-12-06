import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ride } from '../ride.model';
import { Booking, BookingStorageService } from '../services/booking-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  carCount = 0;
  bikeCount = 0;
  bookingCount = 0;
  private STORAGE_KEY = 'availableRides';

  constructor(private router: Router, private bookingStorage: BookingStorageService) {}

  ngOnInit() {
    this.loadRidesCounts();
    this.loadBookingCount();
  }

  loadRidesCounts() {
    const ridesData = localStorage.getItem(this.STORAGE_KEY);
    const rides: Ride[] = ridesData ? JSON.parse(ridesData) : [];
    
    this.carCount = rides.filter(ride => ride.vehicleType === 'Car' && ride.vacantSeats > 0).length;
    this.bikeCount = rides.filter(ride => ride.vehicleType === 'Bike' && ride.vacantSeats > 0).length;
  }

  loadBookingCount() {
    const bookings: Booking[] = this.bookingStorage.getAllBookings();
    this.bookingCount = bookings.length;
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}