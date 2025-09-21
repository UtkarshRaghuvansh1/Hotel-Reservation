import { Injectable } from '@angular/core';
import { Reservations } from '../models/reservations';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private reservations: Reservations[] = [];

  constructor() {
    let savedReservations = localStorage.getItem('reservations');
    this.reservations = savedReservations ? JSON.parse(savedReservations) : [];
  }

  // CRUD operations

  // Getting all the reservation
  getReservations(): Reservations[] {
    return this.reservations;
  }

  //find specific reservation by id
  getReservation(id: string): Reservations | undefined {
     return this.reservations.find(reservation => reservation.id === id);
  }

  // To add a new reservation
  addReservation(reservation: Reservations): void {

    reservation.id = Date.now().toString(); 
    
    this.reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(this.reservations));
  }

  // To delete a reservation
  deleteReservation(id: string): void {
    const indexToDelete = this.reservations.findIndex(reservation => reservation.id === id); // get index of reservation to be deleted
    if (indexToDelete !== -1)
      this.reservations.splice(indexToDelete, 1);// delete reservation at that index

    localStorage.setItem('reservations', JSON.stringify(this.reservations));
  }

  // To update a reservation
  updateReservation(updatedReservation: Reservations): void {
   const indexToUpdate = this.reservations.findIndex(reservation => reservation.id === updatedReservation.id);
   if (indexToUpdate !== -1)
     this.reservations[indexToUpdate] = updatedReservation;

   localStorage.setItem('reservations', JSON.stringify(this.reservations));
  }
}
