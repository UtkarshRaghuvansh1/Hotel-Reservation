import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService
  ) {
  }

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.reservationForm.value)
    if (this.reservationForm.valid) {
      let reservation = this.reservationForm.value; // get the value of the form
      this.reservationService.addReservation(reservation); // add reservation using service
      // to add new reservation
    } else {
      console.log("Form is invalid");
    }
  }
}
