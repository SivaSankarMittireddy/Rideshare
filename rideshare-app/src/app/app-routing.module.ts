import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AddRideComponent } from './add-ride/add-ride';
import { SearchRidesComponent } from './search-ride/search-ride';
import { BookingsListComponent } from './bookings-list/bookings-list';
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-ride', component: AddRideComponent },
  { path: 'search-ride', component: SearchRidesComponent },
  { path: 'my-bookings', component: BookingsListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }