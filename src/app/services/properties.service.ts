import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Property } from '../interfaces/property';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  properties: Property[] = [];

  propertiesSubject = new Subject<Property[]>();

  constructor() { }

  emitProperties(){ //transmission au composant
    this.propertiesSubject.next(this.properties)
  }

  saveProperties(){
    firebase.database().ref('/properties').set(this.properties); //applique les données à la base de données
  }

  createProperty(property: Property){
    this.properties.push(property);
    this.saveProperties();
    this.emitProperties();
  }

  deleteProperty(index){
    this.properties.splice(index, 1) //Supprimer qu'un seul élément à partir de l'index renseigné
    this.saveProperties();
    this.emitProperties(); //Pour émettre un tableau à jour
  }

  updateProperty(property: Property, index){
    /*this.properties[index] = property;
    this.saveProperties();
    this.emitProperties(); //Emettre les nouvelles données au composant*/
    firebase.database().ref('/properties/' + index).update(property).catch(
      (error) => {
        console.error(error); //être à l'affut de toutes les erreurs
      }
    );
  }

  getProperties(){
    firebase.database().ref('/properties').on('value', (data) => { //détecte qu'il y a une modif dans la bdd grâce au ".on"
      this.properties = data.val() ? data.val() : [] //on renseigne seulement si data.val() existe sinon on renseigne un tableau vide
      this.emitProperties(); //Emission des données aux composants
    })
  }
  
    /*
    getProperties(){
    return new Observable((observer) => {
      if(this.properties && this.properties.length > 0){
        observer.next(this.properties);
        observer.complete();
      }
      else{
        const error = new Error("Properties does not exist for is empty");
        observer.error(error);
      }
      
    })*/

    //Utilisation de promesse
  /*getProperties(){
    return new Promise(
      (resolve, reject) => {
        if(this.properties && this.properties.length > 0){
          resolve(this.properties)
        }
        else{
          const error = new Error("Properties does not exist for is empty");
          reject(error);
        }
      }
    );
  }
  }*/
}
