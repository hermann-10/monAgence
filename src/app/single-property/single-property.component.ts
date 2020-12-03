import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../interfaces/property';
import { PropertiesService } from '../services/properties.service';

@Component({
  selector: 'app-single-property',
  templateUrl: './single-property.component.html',
  styleUrls: ['./single-property.component.css']
})
export class SinglePropertyComponent implements OnInit {

  property: Property;

  constructor(
    private router: ActivatedRoute,
    private propertiesService: PropertiesService 
  ) { }

  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id');
    this.propertiesService.getSingleProperties(id).then(
      (property: Property) => {
        this.property = property;
      } 
    ).catch(
      (error) => {
        console.error(error);
      }
    )
  }
}
