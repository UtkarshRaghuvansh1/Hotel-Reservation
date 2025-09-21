import { Injectable } from '@angular/core';
import { Reservations } from '../models/reservations';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private reservations: Reservations[] = [];

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
    this.reservations.push(reservation);
  }

  // To delete a reservation
  deleteReservation(id: string): void {
    const indexToDelete = this.reservations.findIndex(reservation => reservation.id === id); // get index of reservation to be deleted
    if (indexToDelete !== -1)
      this.reservations.splice(indexToDelete, 1);// delete reservation at that index
  }

  // To update a reservation
  updateReservation(updatedReservation: Reservations): void {
   const indexToUpdate = this.reservations.findIndex(reservation => reservation.id === updatedReservation.id);
   if (indexToUpdate !== -1)
     this.reservations[indexToUpdate] = updatedReservation;
  }
}
