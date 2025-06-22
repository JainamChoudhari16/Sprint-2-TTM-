import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent as CustomerHomeComponent } from './customer/home/home.component';
import { BookTicketComponent } from './customer/book-ticket/book-ticket.component';
import { ViewTicketsComponent } from './customer/view-tickets/view-tickets.component';
import { BookingHistoryComponent } from './customer/booking-history/booking-history.component';
import { UpdateDetailsComponent } from './customer/update-details/update-details.component';
import { TrainSearchComponent } from './customer/train-search/train-search.component';
import { FoodOrderComponent } from './customer/food-order/food-order.component';
import { FoodOrderHistoryComponent } from './customer/food-order-history/food-order-history.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { HomeComponent as AdminHomeComponent } from './admin/home/home.component';
import { ProfileComponent as AdminProfileComponent } from './admin/profile/profile.component';
import { ManageTrainsComponent } from './admin/manage-trains/manage-trains.component';
import { ManageCustomersComponent } from './admin/manage-customers/manage-customers.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // General Pages
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Customer Pages - Protected by auth guard
  { path: 'customer/home', component: CustomerHomeComponent, canActivate: [authGuard] },
  { path: 'customer/train-search', component: TrainSearchComponent },
  { path: 'customer/book-ticket', component: BookTicketComponent, canActivate: [authGuard] },
  { path: 'customer/view-tickets', component: ViewTicketsComponent, canActivate: [authGuard] },
  { path: 'customer/booking-history', component: BookingHistoryComponent, canActivate: [authGuard] },
  { path: 'customer/update-details', component: UpdateDetailsComponent, canActivate: [authGuard] },
  { path: 'customer/food-order', component: FoodOrderComponent, canActivate: [authGuard] },
  { path: 'customer/food-order-history', component: FoodOrderHistoryComponent, canActivate: [authGuard] },

  // Admin Pages - Protected by auth guard
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/home', component: AdminHomeComponent, canActivate: [authGuard] },
  { path: 'admin/profile', component: AdminProfileComponent, canActivate: [authGuard] },
  { path: 'admin/manage-trains', component: ManageTrainsComponent, canActivate: [authGuard] },
  { path: 'admin/manage-customers', component: ManageCustomersComponent, canActivate: [authGuard] },

  // Redirect to home for any other route
  { path: '**', redirectTo: '' }
];
