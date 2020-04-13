import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder,Validators  } from '@angular/forms';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

offerListObs;
filteredOfferListObs;

brandList  =this.dataService.brands;
modelList = this.dataService.models;
yearList = this.dataService.years;

lowestBrandFilter;
highestBrandFilter;
lowestModelFilter;
highestModelFilter;
lowestPostCodeFilter;
highestPostCodeFilter;
lowestYearFilter;
highestYearFilter;
gearboxFilter;
lowestPriceFilter;
highestPriceFilter;

filterForm = this.formBuilder.group({
  dptCode: ['',[Validators.minLength(2), Validators.maxLength(2), Validators.pattern('[0-9]*')]],
  carBrand: '',
  carModel: '',
  year: '',
  gearbox:'Manuelle',
  lowestPrice: ['', Validators.pattern('[0-9]*')],
  highestPrice: ['', Validators.pattern('[0-9]*')]
})

  constructor(private dataService: DataService, 
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.offerListObs = this.dataService.getOfferList();
  }


  onFilter(filteringValues) {

    if (filteringValues.dptCode > '' ){
      this.lowestPostCodeFilter = filteringValues.dptCode + '000';
      this.highestPostCodeFilter = filteringValues.dptCode + '999';
    } else {
      this.lowestPostCodeFilter = '00000';
      this.highestPostCodeFilter = '99999';
    }

    if (filteringValues.carBrand > '' ){
      this.lowestBrandFilter = filteringValues.carBrand;
      this.highestBrandFilter = filteringValues.carBrand;
    } else {
      this.lowestBrandFilter = '';
      this.highestBrandFilter = 'zzz';
    }

    if (filteringValues.carModel > '' ){
      this.lowestModelFilter = filteringValues.carModel;
      this.highestModelFilter = filteringValues.carModel;
    } else {
      this.lowestModelFilter = '';
      this.highestModelFilter = 'zzz';
    }

    if (filteringValues.year > '' ){
      this.lowestYearFilter = filteringValues.year;
      this.highestYearFilter = filteringValues.year;
    } else {
      this.lowestYearFilter = '0';
      this.highestYearFilter = '9999';
    }

    this.gearboxFilter = filteringValues.gearbox;

    if (filteringValues.lowestPrice > '' ){
      this.lowestPriceFilter = filteringValues.lowestPrice;
    } else {
      this.lowestPriceFilter = '0';
    }

    if (filteringValues.highestPrice > '' ){
      this.highestPriceFilter = filteringValues.highestPrice;
    } else {
      this.highestPriceFilter = '999999999';
    }

    this.offerListObs = this.dataService.getFilteredOfferList(
      this.lowestBrandFilter,
      this.highestBrandFilter,
      this.lowestModelFilter,
      this.highestModelFilter,
      this.lowestPostCodeFilter,
      this.highestPostCodeFilter,
      this.lowestYearFilter,
      this.highestYearFilter,
      this.gearboxFilter,
      this.lowestPriceFilter,
      this.highestPriceFilter);
  }

}
