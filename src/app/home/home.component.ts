import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PropertiesService } from '../services/properties.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  properties = []
  propertiesSubscription: Subscription;

  constructor(
    private propertiesService : PropertiesService,
    private router : Router
  ) { }

  ngOnInit() {
    this.propertiesSubscription = this.propertiesService.propertiesSubject.subscribe(
      (data: any) => {
        this.properties = data;
      }
    );
    this.propertiesService.getProperties(); //on récupère les données 
    console.log('données ?', this.propertiesService.getProperties());
    this.propertiesService.emitProperties();

    console.log('données emis ?',   this.propertiesService.emitProperties())
    
    /*this.propertiesService.getProperties().then(
      (data: any) => {
        console.log(data);
        this.properties = data;
      }
    ).catch(
      (error) => {
        console.error(error);
      }
    )*/
  }

  getSoldValue(index){
    if(this.properties[index].sold){
      return 'red';
    }
    else{
      return 'green';
    }
  }

  /*onGoToSingleProperty(i){
    console.log('onSinglePropprty');
    this.router.navigate([])
  }*/

  ngOnDestroy(){
    this.propertiesSubscription.unsubscribe();
  }
}
