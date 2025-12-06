import { Injectable } from '@angular/core';

export interface Ride {
  rideId: string; // Unique ride ID
  employeeId: string;
  vehicleType: string;
  vehicleNo: string;
  vacantSeats: number;
  time: string;
  pickup: string;
  destination: string;
  bookedEmployees: string[]; // Array of employee IDs who have booked this ride
}

@Injectable({
  providedIn: 'root'
})
export class RidesStorageService {
  private storageKey = 'availableRides';

  // Get all rides from localStorage
  getAllRides(): Ride[] {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored rides:', error);
        return [];
      }
    }
    return [];
  }

  // Save all rides to localStorage
  saveAllRides(rides: Ride[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(rides));
  }

  // Add a single ride
  addRide(ride: Ride): void {
    const rides = this.getAllRides();
    rides.push(ride);
    this.saveAllRides(rides);
  }

  // Check if ride exists for employee
  isEmployeeOwnerPresent(employeeId: string): boolean {
    const rides = this.getAllRides();
    return rides.some(ride => ride.employeeId === employeeId);
  }

  // Filter rides by criteria
  filterRides(filters: any): Ride[] {
    const rides = this.getAllRides();
    return rides.filter(ride => {
      // Pickup filter - must match if provided
      if (filters.pickup && filters.pickup.trim() !== '') {
        if (!ride.pickup.toLowerCase().includes(filters.pickup.toLowerCase())) {
          return false;
        }
      }
      
      // Destination filter - must match if provided
      if (filters.destination && filters.destination.trim() !== '') {
        if (!ride.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
          return false;
        }
      }
      
      // Vehicle type filter - must match if provided and not 'All'
      if (filters.vehicleType && filters.vehicleType !== '' && filters.vehicleType !== 'All') {
        if (ride.vehicleType !== filters.vehicleType) {
          return false;
        }
      }
      
      // Available seats filter - must have enough if provided
      if (filters.availableSeats && filters.availableSeats > 0) {
        if (ride.vacantSeats < filters.availableSeats) {
          return false;
        }
      }
      
      // Employee ID filter - must match if provided
      if (filters.employeeId && filters.employeeId.trim() !== '') {
        if (ride.employeeId !== filters.employeeId) {
          return false;
        }
      }
      
      // All filters matched
      return true;
    });
  }

  // Search rides by pickup and destination
  searchRides(pickup: string, destination: string): Ride[] {
    const rides = this.getAllRides();
    return rides.filter(ride => {
      const pickupMatch = ride.pickup.toLowerCase().includes(pickup.toLowerCase());
      const destinationMatch = ride.destination.toLowerCase().includes(destination.toLowerCase());
      return pickupMatch && destinationMatch;
    });
  }

  // Clear all rides
  clearAllRides(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Book a ride for an employee
  bookRide(rideId: any, employeeId: any) {
    const rides = this.getAllRides();
    
    const rideIndex = rides.findIndex(r => r.employeeId === rideId);
    const ride = rides[rideIndex];

    // Check 1: Employee cannot book their own ride
    if (ride.employeeId === employeeId) {
      return { success: false, message: 'You cannot book your own ride' };
    }

    // Check 2: Employee cannot book the same ride twice
    if (ride.bookedEmployees && ride.bookedEmployees.includes(employeeId)) {
      return { success: false, message: 'You have already booked this ride' };
    }

    // Check 3: Ensure there are vacant seats
    if (ride.vacantSeats <= 0) {
      return { success: false, message: 'No vacant seats available in this ride' };
    }

    // Update vacant seats
    ride.vacantSeats--;

    // Add employee to booked employees list
    if (!ride.bookedEmployees) {
      ride.bookedEmployees = [];
    }
    ride.bookedEmployees.push(employeeId);

    // Save updated rides
    this.saveAllRides(rides);

    return { success: true, message: 'Ride booked successfully' };
  }
}
