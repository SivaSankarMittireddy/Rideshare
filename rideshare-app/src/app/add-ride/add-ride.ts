import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RidesStorageService } from '../services/rides-storage.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-add-ride',
  templateUrl: './add-ride.html',
  styleUrls: ['./add-ride.css']
})
export class AddRideComponent implements OnInit {

  @ViewChild('rideForm') rideForm!: NgForm;

  feedback = '';
  todayDate = this.getTodayDateString();

  // Model object for template-driven forms
  rideData = {
    ownerEmployeeId: '',
    vehicleType: 'Bike',
    vehicleNo: '',
    vacantSeats: 1,
    time: '',
    pickupPoint: '',
    destination: ''
  };

  constructor(
    private ridesStorage: RidesStorageService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  // Generate unique ride ID
  generateRideId(): string {
    return 'ride_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get today's date in YYYY-MM-DD format for min/max attributes
  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  allRides: any = [];
  
  onAddRide() {
    this.feedback = '';
    const val = this.rideData;
    if (this.ridesStorage.isEmployeeOwnerPresent(val.ownerEmployeeId)) {
      this.toastService.error('Ride already exists for this employee.');
      return;
    }

    const newRide : any= {
      rideId: this.generateRideId(),
      employeeId: val.ownerEmployeeId,
      vehicleType: val.vehicleType,
      vehicleNo: val.vehicleNo,
      vacantSeats: Number(val.vacantSeats),
      time: new Date(val.time).toISOString(),
      pickup: val.pickupPoint,
      destination: val.destination,
      bookedEmployees: [] // Initialize empty array for booked employees
    };

    // Simple: just call service to add ride (handles get, add, save)
    this.ridesStorage.addRide(newRide);

    this.toastService.success('Ride added successfully!');
    this.router.navigate(['/dashboard']);
    this.rideForm.resetForm({
      ownerEmployeeId: '',
      vehicleType: 'Bike',
      vehicleNo: '',
      vacantSeats: 1,
      time: '',
      pickupPoint: '',
      destination: ''
    });
    this.rideData = {
      ownerEmployeeId: '',
      vehicleType: 'Bike',
      vehicleNo: '',
      vacantSeats: 1,
      time: '',
      pickupPoint: '',
      destination: ''
    };
  }
}