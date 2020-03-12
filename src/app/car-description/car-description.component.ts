import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car-description',
  templateUrl: './car-description.component.html',
  styleUrls: ['./car-description.component.css']
})
export class CarDescriptionComponent implements OnInit {


carIdToSearch;
carDescriptionObs;
carEquipmentObs;

  constructor(private dataService: DataService, 
              private route: ActivatedRoute) { }

  ngOnInit() {

    /* routing - get the param Id of the car from the url */ 
    this.route.paramMap.subscribe(params => {
      this.carIdToSearch = params.get('carId');

      /*get an observable containing the data of a car */
      /*this.carDescriptionObs = this.dataService.getCarDescription(this.carIdToSearch);*/

      /*
      get an observable containing the list of equipment of a car 
      this.carEquipmentObs = this.dataService.getAllEquipmentByCarId(this.carIdToSearch);
      */

  });

  }
  
}
