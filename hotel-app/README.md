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

### Injecting the reservation services into form component 
- in reservation form component.ts  we want on submit reservation to get added
- call service in onsubmit, first we need to inject it in constructor
- import the reservation service in form component 
- grab the instance of the reservation srrvice, so in constructor inject reservatio service
- when we create form component angualr deendency injection will inject an instance
- iin on submit take the value of reservation added, put it in add reservation

### add local storage to store all our reservation 

- for adding deleteing updating info use setItem in serices function 

  // To add a new reservation
  addReservation(reservation: Reservations): void {
    this.reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(this.reservations));
  }

- for loading the info we use ngOnInit lifecycle hook
- create a constructor in services ts file 
- this contructor will be loaded before ng on init life cycle hook
  constructor() {
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      this.reservations = JSON.parse(savedReservations);
    }
  }

- for getting the info use getItem in srvices method


### Showing all the reservation list

- import oninit lifecycle hook, reservations services, reservation interface in this component
- create a constructure to grab instance of service


### ngTemplate and ngIF

- A template reference variable is created with a hash # in your HTML.
- It gives you a way to refer to a DOM element or an Angular directive/component inside the template.

``` html
<h2>Reservation List</h2>

<ul *ngIf="reservations.length > 0; else noReservations">
  <li *ngFor="let reservation of reservations">
    Guest: {{ reservation.guestName }} - Room: {{ reservation.roomNumber }}
  </li>
</ul>

<ng-template #noReservations>
  <p>No reservations found.</p>
</ng-template>

```

### Using the router navigate method to redirect the user

- once reservation is created, redirect user to list view 
- import router in form component ts file 
- after adding router we can call a method call navigate but before that we have to grab instance of router 
- declare instace of router in constructor
- use navigate on on submit function to navigate from form to list 

``` typescript
     // navigate to reservation list after adding
      this.router.navigate(['/list']);
```

### Deleting Reservations

- in reservation list add delete button to delete the reservation
- inlist component ts file create a function to delete the reservation 
``` typescript
  deleteReservation(id: string) {
    this.reservationService.deleteReservation(id);
    this.reservations = this.reservationService.getReservations(); // refresh the list
  }

```
- Now we can create,read and delete only updating is left 
- for updating we need to firdt read then edit 

### Update a Reservation 

- for updating reservation we need an id of particular reservation so that we can edit that reservation
- if we are using DB primary key will automatically get assigned as id
- in addReservation function under services 

``` typecript
    reservation.id = Date.now().toString(); 
```

### editing a reservation

- add a edit route path with parameter in app-routing.module.ts
- provide id (which reservation we want to edit) 
- later read the id from URL/Route and then use that to grab the item from service 
``` typescript
    const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'list', component:ReservationListComponent},
  {path: 'new', component:ReservationFormComponent},
  {path: 'edit/:id', component:ReservationFormComponent}
]
```

- add router module in reservation.module.ts
``` typescript
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
```

- In list component html add edit button eith routerLink attribute provide path for it 
- for this we need to import reouter module in reservation.module.ts
``` html
     <button [routerLink]="['./edit',reservation.id]">Edit</button>
```

- Now on cliking on edit it will redirect to forms module and in URL it will /edit/12344455(id)

### Editing Reservation

- now we have id fill the form based on that id then edit it 
- in form component ts import activated route and create instance by dependemcy injection in constructor 
- now in in ngonit we check if we get the id

``` typescript
let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      let reservation = this.reservationService.getReservation(id);
      if (reservation) {
        this.reservationForm.patchValue(reservation);
      }
    }
```
- now if I edit form it will create new reservation but we want to if id already existed then update that dont create new one
- on submit funxtion if there is id just use update reservation if not then add reservatio 
``` typescript
onSubmit() {
     if(this.reservationForm.valid){

      let reservation: Reservations  = this.reservationForm.value;

      let id = this.activatedRoute.snapshot.paramMap.get('id')

      if(id){
        // Update
        this.reservationService.updateReservation(id, reservation)
      } else {
        // New
        this.reservationService.addReservation(reservation)   

      }

      this.router.navigate(['/list'])
    }
  }
```

### Combining Components from different modules 
- now for navigation from one page to another we need t change the url 
- but we wnat it in such a way that home component should always be there for creating and viewing the reservation and form and list component change accroding to user changes 
- in reservation module we want have to use homw module so we need to import it and in order to use home module we need to export the home component in home module.ts so that other components can use it 




