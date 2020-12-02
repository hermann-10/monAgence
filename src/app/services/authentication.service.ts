import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }
  
  signInUser(email: string, password: string){
    return new Promise( //On retourne une promesse
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then( //Si tout s'est bien passé et qu'on s'est connecté
        (data) => {
          console.log('Connecté');
          resolve(data);
        }

        ).catch( //Sinon on reject l'erreur
          (error) => {
            reject(error);
          }
        );
      })
    }

    signOutUser(){
      firebase.auth().signOut();
    }


  
  /*signUpUser(email: string, password: string){
    return new Promise( //On retourne une promesse
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then( //Si tout s'est bien passé et qu'on s'est connecté
        () => {
          console.log('Connecté');
          resolve();
        }

        ).catch( //Sinon on reject l'erreur
          (error) => {
            reject(error);
          }
        );
      }
    );
  }*/
}
