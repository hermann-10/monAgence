import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {  //On va retourner soit un observable soit une promise ou soit un boolean
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged( //Si l'utilisateur est connecté
          (userSession) => {
            if (userSession) { //si l'utilisateur est connecté, il aura accès à la rue
              resolve(true); //On renvoit vrai
            }
            else{
              this.router.navigate(['/home']);
              resolve(false);
            }
          }
        )
      }
    );
  }
}
