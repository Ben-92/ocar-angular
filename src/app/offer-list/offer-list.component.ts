import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

offerListObs;
filteredOfferListObs;

filterForm = this.formBuilder.group({
  brand:' ',
  lowestPrice: 0,
  highestPrice: 5
})

  constructor(private dataService: DataService, 
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.offerListObs = this.dataService.getOfferList();
  }

  onFilter(filteringValues) {
    this.offerListObs = this.dataService.getFilteredOfferList(filteringValues.brand,
                                                              filteringValues.lowestPrice, 
                                                              filteringValues.highestPrice);
  }

}
