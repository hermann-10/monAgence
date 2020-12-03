import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SinglePropertyComponent } from './single-property/single-property.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin/dashboard', canActivate: [AuthGuardService], component: AdminDashboardComponent }, // localhost:4200/admin/dashboard
  { path: 'login', component: SigninComponent },
  { path: 'property/:id', component: SinglePropertyComponent }, 

  { path: '', redirectTo: 'home', pathMatch: 'full' },  // pathMatch : Pour lui indiquer qu'il faut prendre en compte l'ensemble du chemin
  { path: '**', redirectTo: 'home' } //Tout et n'importe quoi, c autre ce qui existe déjà //Route inexistante, on redirige automatiquement l'utilisateur à home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
