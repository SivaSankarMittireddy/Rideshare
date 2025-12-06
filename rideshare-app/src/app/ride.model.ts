export interface Ride {
  rideId: any; // Unique ride ID
  employeeId: any; // Employee who is adding the ride
  vehicleType: any; // Only two types
  vehicleNo: any; // Vehicle number
  vacantSeats: any; // Available seats
  time: any; // Time in HH:MM format
  pickup: any; // Pick-up location
  destination: any; // Drop location
  bookedEmployees: string[]; // Employees who booked the ride
}