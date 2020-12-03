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

  uploadFile(file: File){
    return new Promise(
      (resolve, reject) => {
        const uniqueID = Date.now().toString(); //technique provisoire d'avoir un id unique avec la date, pas top à modifier plus tard
        const fileName = uniqueID + file.name;
        const upload = firebase.storage().ref().child('images/properties/' + fileName).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,  //ça va écouter le storage de firebase, à chaque fois que l'état change
        () => {
          console.log('Chargement....');
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        () => {
          upload.snapshot.ref.getDownloadURL().then(
            (downloadUrl) => {
              resolve(downloadUrl);8
            }
          );
        }
        );
      }
    );
  }

  removeFile(fileLink: string){
    if(fileLink){ //s'il y a un url d'un fichier
      const storageRef = firebase.storage().refFromURL(fileLink); //on récupère le chemin dans la bdd du fichier
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.error(error);
        }
      )
    }
    /*return new Promise(
      (resolve, reject) => {
        console.log('File deleted');
        resolve();
      }
    )*/
  }

  getSingleProperties(id){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/properties/' + id).once('value').then( //.once car on veut récupérer qu'une seule fois
          (data) => {
            resolve(data.val());
          }
        ).catch(
          (error) => {
            reject(error);
          }
        );
      }
    );
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
