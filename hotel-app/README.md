# Hotel Management 

## Initial set up 
1. Create a hotel angular app 
```bash
ng new hotel-app
```
2. Start the server to run the app 
```bash
ng serve
// to start the server on default browser 
ng serve -o
```

## Project Architecture 
1. Root module 
2. Router to navigate between pages 
3. Inside root we will have 2 modules 
    - home module
    - reservation module 
4. In home module we will have home component 
5. In reservation module we will have 2 components 
    - reservation-form component 
    - reservation-list component 
6. To handle these 2 components in reservation module we will have Reservation service 

### Home module
1. Create a home module 
```bash
ng g module home
```
2. Create component in home module 
```bash 
ng g component home --module=home
```
-  *Note: A component can only be decalre from a single module 
    eg-: home component can only be declared in home module and not the other module in the project* 

### Reservationn module 
1. Create Reservation Module 
```bash 
    ng g module reservation
```
2. Create reservation-list component in reservation module
```bash
    ng g component reservation-list --module=reservation
```
3. Create reservation-form component in reservation module
```bash
    ng g component reservation-form --module=reservation
```

### Reservation Services 
1. Create a reservation Services 
```bash 
    ng g service reservation/reservation
```
- This will help in handle data for reservation module

### Routing 
- Angular's Router allows us to display different components based on the URL path.
#### Steps
- Configure Routes in app-routing.module.ts
    - Start by importing necessary components:
    ``` javascript
        import { HomeComponent } from './home/home.component';
        import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
        import { ReservationFormComponent } from './reservation/reservation-form/reservation-form.component';
    ```
    - Then define the Routes array:
    ```javascript
        const routes: Routes = [
        // default route
        { path: '', component: HomeComponent }, 
        // reservation list
        { path: 'list', component: ReservationListComponent }, 
        // new reservation form
        { path: 'new', component: ReservationFormComponent }   
        ];

    ```
- path: Defines the URL segment the user navigates to.

- component: Specifies which component should be displayed for that path.

- Default route ('') will show HomeComponent when the app loads.

- We're following a feature-based architecture, meaning each major section of the app (like Home and Reservation) has its own dedicated Angular module.

- To make everything work:
    - These feature modules must be imported into the root module (AppModule), so that their components and routing can be used across the app.
    - Make sure to import RouterModule and add it to imports in @NgModule app.module.ts

```javascript
      imports: [
            BrowserModule,
            AppRoutingModule,
            HomeModule,
            ReservationModule
        ],
```

- To navigate between different pages, we use the routerLink directive in the HTML template.
```HTML
    <button [routerLink]="['/new']">Create a new Reservation</button>
    <button [routerLink]="['/list']">View all Reservation</button>
```
- routerLink is a directive provided by the RouterModule.
- Since we're using it inside the HomeComponent, and this component is declared inside the HomeModule, we need to import the RouterModule in the HomeModule as well.

- Ensure <router-outlet></router-outlet> is placed in app.component.html. This is where routed components are loaded.




### Reservation Interface 
- create reservation interface 
``` bash
 ng g interface models/reservation
```
```javascript
    export interface Reservation {
        id: string,
        checkInDate : Date,
        checkOutDate : Date,
        guestName : string,
        guestemail : string,
        roomNumber : number
    }
```







## Angular Form Module and Validation 
### Types of Forms in Angular
    - Angular provides two ways to handle forms:

        - Reactive Forms Validation

            - Validation is handled in the TypeScript class.

            - Form is explicitly created using FormBuilder and FormGroup.

            - Provides better control, testability, and scalability.

        - Template-driven Forms Validation

            - Validation is handled directly in the HTML template using directives.

            - Simpler and more suitable for basic forms.
### Setting Up the Forms Module
- In reservation.module.ts, add:
```typescript
    imports: [
        CommonModule,
        FormsModule,            // Required for template-driven forms
        ReactiveFormsModule     // Required for reactive forms
    ]

```
- This ensures both ReservationFormComponent and ReservationListComponent can use form functionalities.

### Reservation Form Component Setup

1. In reservation-form.component.ts, import the following:
```typescript
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
```
#### FormBuilder
 - A helper service that provides shorthand methods to create form controls, form groups, and form arrays.

#### FormGroup
- What is it?
    - A class that represents a group of form controls.
    - It's like a container for multiple fields in a form (e.g., name, email, password).

- Why use it?
    - It allows you to manage and validate multiple controls as a unit.
    - You can access and manage all form values and states using formGroup.

#### Validators
- What is it?
    - A built-in Angular class that provides validation functions for form controls.



2.  Declare FormGroup in Class
```typescript
    reservationForm: FormGroup = new FormGroup({});
```
- This initializes the structure that will hold all the form controls.

- Initially empty; it will be configured in ngOnInit.

3. Use Dependency Injection in Constructor

```javascript
constructor(private formBuilder: FormBuilder) { }

```
- Angular uses dependency injection to pass the FormBuilder when this component is created.
- This allows us to use the injected formBuilder service to build the form structure.

### Creating the Form Structure in ngOnInit

- In the ngOnInit lifecycle hook, we will define our form using formBuilder.group():

```javascript
    ngOnInit(): void {
  this.reservationForm = this.formBuilder.group({
        checkInDate: ['', Validators.required],
        checkOutDate: ['', Validators.required],
        guestName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
        numberOfGuests: ['', [Validators.required, Validators.min(1)]],
        specialRequests: ['']
    });
}

```
- Each field is defined using a key-value pair.

- The key is the name of the form field (used in formControlName in HTML).

- The value is an array:

    - First element: default value (usually an empty string).

    - Second element: validation rule(s) using Validators.

### Binding the Form in HTML

- In the component’s HTML file (reservation-form.component.html):
```html 
    <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()">
```
- This binds the reservationForm defined in the TS file to the form in HTML and listens for form submission.

### Add Input Fields with formControlName
- Each input field must be connected to the form group via formControlName.
```html 
    <label for="checkInDate">Check-In Date</label>
<input type="date" formControlName="checkInDate" id="checkInDate" />

```
- Repeat for other fields: checkOutDate, guestName, email, phoneNumber, numberOfGuests, and specialRequests.

### Submit Button Should Be Disabled When Form Is Invalid


- To dynamically enable/disable the submit button based on form validity:

```html
    <button type="submit" [disabled]="reservationForm.invalid">Submit</button>
```

- This ensures the user cannot submit the form until all required fields are valid.

### Handling Form Submission

- In the component class:

```javascript
    onSubmit() {
            if (this.reservationForm.valid) {
                alert("Form is valid! Submitting...");
                console.log(this.reservationForm.value); // Log submitted data
            } else {
                alert("Form is invalid! Please check the required fields.");
                this.reservationForm.markAllAsTouched(); // Show all validation messages
            }
    }

```

- reservationForm.valid: Checks if all validations pass.
- markAllAsTouched(): Ensures error messages are shown even for untouched fields.

### Show Validation Messages in HTML
- Use Angular’s *ngIf directive to show error messages conditionally.

```html
    <div *ngIf="reservationForm.get('checkInDate')?.invalid && reservationForm.get('checkInDate')?.touched">
    Check-In Date is required 
    </div>

```

- get('checkInDate'): Accesses the form control.

- .invalid: Field has failed validation.

- .touched: Field has been interacted with (focused and blurred).

- Combining both ensures error message appears only after user interaction.

## Creating reservation Services
### `ReservationService`

This service is responsible for managing reservation data. It provides methods for performing **CRUD** (Create, Read, Update, Delete) operations on a collection of `Reservations` objects.

---

## 🔑 Key Features

- **Data Management**: Handles all reservation data, ensuring a single source of truth for the application.
- **Dependency Injection**: Can be injected into any component or other service using Angular's dependency injection system, thanks to the `@Injectable` decorator.
- **CRUD Operations**: Exposes a clear API for interacting with reservation data.

---

## 📁 `Reservation` Model

The service operates on data structured according to the `Reservation` model.
```typescript
interface Reservation {
  id: string;
  // Other properties like name, dates, etc.
}


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

```


