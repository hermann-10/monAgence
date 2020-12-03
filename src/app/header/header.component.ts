import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'MH Reloc';
  isLoggedIn = false;
  isDisabled = true; //Liaison par la propriété , property binding, ngClass //à retirer
  //la liaison par un évenement, event binding 
  constructor(
    private authenticationService : AuthenticationService,
    private router : Router
  ) { }
 
  ngOnInit() {
    firebase.auth().onAuthStateChanged( //on écoute le statut d'authentification de l'utilisateur, au moment où il se connecte et qu'il se déconnecte, cette fonction va être executé
      (userSession) => {
        if(userSession){
          this.isLoggedIn = true;
          console.log(userSession);
        }
        else{
          this.isLoggedIn = false;
          console.log(userSession);
        }
      }
    )
  }

  onClick(){ //à retirer
    this.isDisabled = false;
  }

  onSignOut(){
    this.isLoggedIn = false;
    this.authenticationService.signOutUser();
    this.router.navigate(['/home']);
  }

}
