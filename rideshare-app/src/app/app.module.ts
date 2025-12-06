import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app';
import { DashboardComponent } from './dashboard/dashboard';
import { SearchRidesComponent } from './search-ride/search-ride';
import { AddRideComponent } from './add-ride/add-ride';
import { BookingsListComponent } from './bookings-list/bookings-list';
import { AppRoutingModule } from './app-routing.module';
import { ToastComponent } from './components/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SearchRidesComponent,
    AddRideComponent,
    ToastComponent,
    BookingsListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }