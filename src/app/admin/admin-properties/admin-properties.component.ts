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
  }

  onDeleteProperty(index){
    $('#deleteModalProperty').modal('show');
    this.indexToRemove = index;
  }

  onConfirmDeleteProperty(){
    this.propertiesService.deleteProperty(this.indexToRemove);
    $('#deleteModalProperty').modal('hide');
  }

  onEditProperty(property : Property){
    console.log('Coucou on edit');
    this.editMode = true;
    $('#propertiesFormModal').modal('show');
    this.propertiesForm.get('title').setValue(property.title);
    this.propertiesForm.get('category').setValue(property.category);
    this.propertiesForm.get('surface').setValue(property.surface);
    this.propertiesForm.get('rooms').setValue(property.rooms);
    this.propertiesForm.get('description').setValue(property.description);
    this.propertiesForm.get('price').setValue(property.price);
    this.propertiesForm.get('sold').setValue(property.sold);
    const index = this.properties.findIndex(
      (propertyEl) => {
        if (propertyEl === property)
        return true;
      }
    )
    this.indexToUpdate = index;
  }
}
