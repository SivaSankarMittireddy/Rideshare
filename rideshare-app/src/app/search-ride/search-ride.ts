import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Ride, RidesStorageService } from '../services/rides-storage.service';
import { ToastService } from '../services/toast.service';
import { BookingStorageService } from '../services/booking-storage.service';

@Component({
  selector: 'app-search-rides',
  templateUrl: './search-ride.html',
  styleUrls: ['./search-ride.css']
})
export class SearchRidesComponent implements OnInit {

  @ViewChild('searchForm') searchFormRef!: NgForm;
  @Output() filterEvent = new EventEmitter<any>();
  @Output() employeeEvent = new EventEmitter<string>();

  searchResults: Ride[] = [];
  allRides: Ride[] = [];
  showResults = false;
  hasSearched = false;

  // Model object for template-driven forms
  searchData = {
    vehicleTypeFilter: 'All'
  };

  constructor(private ridesStorage: RidesStorageService, private toastService: ToastService, private router: Router, private bookingStorage: BookingStorageService) {}

  ngOnInit() {
    this.loadRides();
  }

  loadRides() {
    this.allRides = this.ridesStorage.getAllRides().filter(ride => ride.vacantSeats > 0);
  }

  onSearch() {
    this.loadRides();
    const filters = {
      vehicleType: this.searchData.vehicleTypeFilter === 'All' ? '' : this.searchData.vehicleTypeFilter
    };

    this.searchResults = this.ridesStorage.filterRides(filters).filter(ride => ride.vacantSeats > 0);
    this.showResults = true;
    this.hasSearched = true;
    this.filterEvent.emit(filters);
  }

  clearSearch() {
    this.searchFormRef.resetForm({
      vehicleTypeFilter: 'All'
    });
    this.searchData = {
      vehicleTypeFilter: 'All'
    };
    this.searchResults = [];
    this.showResults = false;
    this.hasSearched = false;
  }

  // Book a ride
  bookRide(ride: Ride): void {
    const employeeId = prompt('Please enter your Employee ID to book this ride:');
    
    if (!employeeId) {
      this.toastService.warning('Booking cancelled. Employee ID is required.');
      return;
    }

    // Check if employee already has any booking
    if (this.bookingStorage.hasEmployeeAnyBooking(employeeId)) {
      this.toastService.error('You have already booked a ride. You cannot book another ride.');
      return;
    }

    // Call the service to book the ride using unique rideId
    const result = this.ridesStorage.bookRide(ride.employeeId, employeeId);

    if (result.success) {
      // Save booking to session storage
      this.bookingStorage.addBooking(ride, employeeId);
      
      this.toastService.success(result.message);
      this.loadRides();
      this.onSearch();
      this.router.navigate(['/dashboard']);
    } else {
      this.toastService.error(result.message);
    }
  }
}