import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PropertiesService } from 'src/app/services/properties.service';
import * as $ from 'jquery';
import { Property } from 'src/app/interfaces/property';

@Component({
  selector: 'app-admin-properties',
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent implements OnInit {

  propertiesForm: FormGroup;
  propertiesSubscription: Subscription;
  properties: Property[] = [];

  indexToRemove;
  indexToUpdate;
  editMode = false;

  photoUploading = false; //variable boolean qui va annoncer à la vue que le fichier est en cours de chargement
  photoUploaded = false;
  photosAdded: any[] = [];

  constructor(private formBuilder: FormBuilder, private propertiesService : PropertiesService) { }

  ngOnInit() {
    this.initPropertiesForm();
    this.propertiesService.propertiesSubject.subscribe( // on s'abonne aux données du subject
      (data : Property[]) => {
        console.log(data);
        this.properties = data;
      }
    );
    this.propertiesService.getProperties(); //on récupère les données 
    this.propertiesService.emitProperties(); //ensuite on emet les données aux composants
  }

  initPropertiesForm(){
    this.propertiesForm = this.formBuilder.group({
      title: ['', Validators.required],
      category:  ['', Validators.required],
      surface:  ['', Validators.required],
      rooms:  ['', Validators.required],
      description:  '',
      price:  ['', Validators.required],
      sold:  '',
    })
  }

  onSubmitPropertiesForm(){
    const newProperty : Property = this.propertiesForm.value;
    newProperty.sold = this.propertiesForm.get('sold').value ? this.propertiesForm.get('sold').value : false; //si cette valeur existe, sinon c'est égal à false
    newProperty.photos = this.photosAdded ? this.photosAdded : []; // c'est égal à this.photoAdded uniquement si elle existe sinon on met le tableau à vide
    if (this.editMode){
      this.propertiesService.updateProperty(newProperty, this.indexToUpdate)
    }
    else{
      this.propertiesService.createProperty(newProperty);
    }
    $('#propertiesFormModal').modal('hide');
  }

  resetForm(){
    this.editMode = false;
    this.propertiesForm.reset();
    this.photosAdded = []; // permet de reinitialiser la photo affiché, en l'enlevant
  }

  onDeleteProperty(index){
    $('#deleteModalProperty').modal('show');
    this.indexToRemove = index;
  }

  onConfirmDeleteProperty(){
    //if (this.properties[this.indexToRemove].photo && this.properties[this.indexToRemove].photo !== ''){ /* Si le bien correspondant à la photo n'est pas vide, et elle est défini alors on la supprime*/
      //this.propertiesService.removeFile(this.properties[this.indexToRemove].photo);
    //}
    this.properties[this.indexToRemove].photos.forEach( //Il parcourt le tableau de photo et il supprime chaque photo
      (photo) => {
        this.propertiesService.removeFile(photo);
      }
    );

    this.propertiesService.deleteProperty(this.indexToRemove);
    $('#deleteModalProperty').modal('hide');
  }

  onEditProperty(property : Property){
    this.editMode = true;
    $('#propertiesFormModal').modal('show');
    this.propertiesForm.get('title').setValue(property.title);
    this.propertiesForm.get('category').setValue(property.category);
    this.propertiesForm.get('surface').setValue(property.surface);
    this.propertiesForm.get('rooms').setValue(property.rooms);
    this.propertiesForm.get('description').setValue(property.description ? property.description : ''); //Si la description n'existe pas lors de la mise à jour, on met une chaîne de caractère vide
    this.propertiesForm.get('price').setValue(property.price);
    this.propertiesForm.get('sold').setValue(property.sold);
    this.photosAdded = property.photos ? property.photos : []; //Ajout du tableau contenant les url de la photo uniquement s'il est existant
    const index = this.properties.findIndex(
      (propertyEl) => {
        if (propertyEl === property)
        return true;
      }
    )
    this.indexToUpdate = index;
  }

  onUploadFile(event){
    this.photoUploading = true;
    this.propertiesService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        /*if(this.photoUrl && this.photoUrl !== ''){
          this.propertiesService.removeFile(this.photoUrl);
        }*/ 
        this.photosAdded.push(url);
        this.photoUploading = false;
        this.photoUploaded = true;
        setTimeout(() => { // j'ajoute un setTimeOut pour redefinir la variable à false une fois que la photo est chargée après 5 secondes
          this.photoUploaded = false;
        }, 5000);
      }
    )
  }

  onRemoveAddedPhoto(index){
    this.propertiesService.removeFile(this.photosAdded[index]);
    this.photosAdded.splice(index, 1); // Il va supprimer depuis le storage de firebase et il va supprimer le lien dans la liste
  }
}
