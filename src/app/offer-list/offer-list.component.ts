import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder,Validators  } from '@angular/forms';
import {tap} from 'rxjs/operators';

import { OfferPage } from '../offer-page';

import { Router } from '@angular/router'; 

import { ModelApi } from '../model-api';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {



brandCodigoSelected;

brandNomeSelected;


/* true if form submitted */
isSubmitted : boolean;

/* full data content of one Offer Page */  
pageContent;
/* total number of pages retrieved */
contentTotalPages;
/* total number of offers retrieved */
contentTotalOffers;

/* the actual page index displayed */
actualPageNumber;

/* indicates if it's the first page displayed */
isFirstPage;
/* indicates if it's the last page displayed */
isLastPage;

/* last character which indicates plural or singular */ 
singularPluralChar;

/* actual nb offers per page at instant i */
offersPerPage;
/* actual sort criteria at instant i */
sortCriteria;
/* actual order criteria at instant i */
orderCriteria;
/* actual page to display */
pageToDisplay;

/* indicates if a filter criteria is selected in the filter form */
isFilterRequested;

/* retrieving service data : list of brands, models, years */
/*brandList  =this.dataService.brands;*/
brandListAPI ;
/*modelList = this.dataService.models;*/
modelListAPI;
yearList = this.dataService.years;

/* list of possible filter boundaries */
lowestBrandFilter;
highestBrandFilter;
lowestModelFilter;
highestModelFilter;
lowestPostCodeFilter;
highestPostCodeFilter;
lowestYearFilter;
highestYearFilter;
/*gearboxFilter; */
lowestGearboxFilter;
highestGearboxFilter;
lowestPriceFilter;
highestPriceFilter;




/* formgroup with all filter fields formcontrol */
filterForm = this.formBuilder.group({
  dptCode: ['',[Validators.minLength(2), Validators.maxLength(3), Validators.pattern('[0-9]*')]],
  carBrand: '',
  carModel: '',
  year: '',
  gearbox:'',
  lowestPrice: ['', Validators.pattern('[0-9]*')],
  highestPrice: ['', Validators.pattern('[0-9]*')],

})

  constructor(private dataService: DataService, 
              private formBuilder: FormBuilder,
              private router: Router
              ) { 
              }
  
  /**
   * initialize display parameters and criterias, and display first page of all offers
   */
  ngOnInit() {

    /*disable selct car model when car brand is not selected */
    this.filterForm.get('carModel').disable();

    console.log('ngoninit offer-list');

    this.dataService.retrieveBrands()
    .subscribe( {
      next: listOfBrandsAPI  => { 
                          /*retrieving array of brands*/
                          this.brandListAPI = listOfBrandsAPI;
                        },
      error:err => {console.error(err);
                    }});

    /*window.location.reload(); */  /* ça boucle si je fais ça */
    
    /* initialize the paging and sort criteria for the first time display */
    this.pageToDisplay = 0;
    this.offersPerPage = 3;
    this.sortCriteria = 'date';
    this.orderCriteria = 'DESC';

    this.getPageOfOffers();

  } 

  /**
   * new page display after sort criteria change 
   * @param sortCriteriaSelected form value with sort criteria selected by user
   */
  onSortSelectChange(sortCriteriaSelected){

    this.determineSortAndOrder(sortCriteriaSelected);
    
    this.pageToDisplay = 0;

    if (this.isFilterRequested){
      this.getFilteredPageOfOffers();
    } else {
      this.getPageOfOffers();
    }

  }

/**
 * route towards offer detail component
 * @param offerId id of the offer the user has clicked on
 */
  onConsult(offerId){
    this.router.navigate(['/offerDetail', offerId]);
  }

  /**
   * new page display after nb of offer per page change
   * @param offersPerPageCriteria number of offers per parge choice
   */
  onNbOffersPerPageChange(offersPerPageCriteria){

    this.offersPerPage = offersPerPageCriteria;
    
    this.pageToDisplay = 0;

    if (this.isFilterRequested){
      this.getFilteredPageOfOffers();
    } else {
      this.getPageOfOffers();
    }

  }

/**
 * new page display after click on pagination choice
 * @param pageToDisplayChoice number of the page to display
 */
  displayPaginationPage(pageToDisplayChoice){

    this.pageToDisplay = pageToDisplayChoice;


    if (this.isFilterRequested){
      this.getFilteredPageOfOffers();
    } else {
      this.getPageOfOffers();
    }


  } 

  isInvalid(field){
    if ((this.filterForm.get(field).errors && (this.filterForm.get(field).touched || this.filterForm.get(field).dirty))
             || (this.isSubmitted && this.filterForm.get(field).errors))
    {
      return true;
    } 

  }

/**
 * new page display after submitting criteria filter form
 * @param filteringValues filter form values
 */
  onFilter(filteringValues) {

    this.isSubmitted = true;

    this.populateCriterias(filteringValues);

    this.pageToDisplay = 0;
    this.getFilteredPageOfOffers();

  }

  onCarBrandChange(carBrandOptionValue){

    /*enable selct car model when car brand is selected */
    this.filterForm.get('carModel').enable();

    const optionValue = carBrandOptionValue.target.value;

    /* retrieving car brand code and car brand name from the form*/
    const optionValueArray = optionValue.split(';');

    /*saving car brand code for http request for car models */
    this.brandCodigoSelected = optionValueArray[0];

    /*saving car brand name*/
    this.brandNomeSelected = optionValueArray[1];
  
    this.dataService.retrieveModels(this.brandCodigoSelected)
    .pipe(
      /*retrieving array of models*/
        tap ((ModelListVehicleApi:ModelApi) => {
          this.modelListAPI = ModelListVehicleApi.modelos; 
        }),
      ) 
    .subscribe( {
      next: listOfModelsAPI  => { 
                          console.log(listOfModelsAPI);
                        },
      error:err => {console.error(err);
                    }});

  }

  /**
   * retrieving a non filtered page of offers
   */
  getPageOfOffers(){


    this.dataService.getOfferPage(this.pageToDisplay, this.offersPerPage, this.sortCriteria, this.orderCriteria)
    .pipe(
      /* retrieving page informations before displaying it */
      tap ((offerPage:OfferPage) => {
        this.actualPageNumber = offerPage.number; 
        this.pageContent = offerPage.content;
  
        this.isFirstPage = offerPage.first;
        this.isLastPage = offerPage.last;
        
        this.contentTotalPages = offerPage.totalPages;
        this.contentTotalOffers = offerPage.totalElements;

        if (this.contentTotalOffers > 1) {
          this.singularPluralChar = 's';
        } else {
          this.singularPluralChar = '';
        }
      }),
    )
    .subscribe( {
      next: (offerPage) => {
        console.log(offerPage);
     },
      error:err => {console.error(err);}});        
      /*complete : () => console.log('complete')}); */ 
  }

  /**
   * retrieving a filtered page of offers
   */
  getFilteredPageOfOffers(){

    this.dataService.getFilteredOfferPage(
    this.lowestBrandFilter,
    this.highestBrandFilter,
    this.lowestModelFilter,
    this.highestModelFilter,
    this.lowestPostCodeFilter,
    this.highestPostCodeFilter,
    this.lowestYearFilter,
    this.highestYearFilter,
    /*this.gearboxFilter,*/
    this.lowestGearboxFilter,
    this.highestGearboxFilter,
    this.lowestPriceFilter,
    this.highestPriceFilter,
    this.pageToDisplay, this.offersPerPage, this.sortCriteria, this.orderCriteria)
    .pipe(
      /* retrieving page informations before displaying it */
      tap ((offerPage:OfferPage) => {
        this.actualPageNumber = offerPage.number; 
        this.pageContent = offerPage.content;
  
        this.isFirstPage = offerPage.first;
        this.isLastPage = offerPage.last;
        
        this.contentTotalPages = offerPage.totalPages;
        this.contentTotalOffers = offerPage.totalElements;

        if (this.contentTotalOffers > 1) {
          this.singularPluralChar = 's';
        } else {
          this.singularPluralChar = '';
        }
      }),
    )
    .subscribe( {
      next: (offerPage) => {
        console.log(offerPage);

     },
      error:err => {console.error(err);}});        
      /*complete : () => console.log('complete')});  */
  }

  /**
   * populating criterias for the http GET filtered request, from the filter form values
   * @param filteringValues filter form values
   */
  populateCriterias(filteringValues){
 
    this.isFilterRequested = false;
    // metropolitan and DOM TOM post codes
    if (filteringValues.dptCode > '' ){
      if ((filteringValues.dptCode > 970 && filteringValues.dptCode < 977) || (filteringValues.dptCode > 983 && filteringValues.dptCode < 989)){
        this.lowestPostCodeFilter = filteringValues.dptCode + '00';
        this.highestPostCodeFilter = filteringValues.dptCode + '99';
      } else {  
        this.lowestPostCodeFilter = filteringValues.dptCode + '000';
        this.highestPostCodeFilter = filteringValues.dptCode + '999';
      }
    this.isFilterRequested = true;
    } else {
      this.lowestPostCodeFilter = '00000';
      this.highestPostCodeFilter = '99999';
    }

  
    if (filteringValues.carBrand > '' ){

      this.lowestBrandFilter = this.brandNomeSelected;
      this.highestBrandFilter = this.brandNomeSelected;

      this.isFilterRequested = true;
    } else {
      this.lowestBrandFilter = '';
      this.highestBrandFilter = 'zzz';
    }
  
    if (filteringValues.carModel > '' ){
      this.lowestModelFilter = filteringValues.carModel;
      this.highestModelFilter = filteringValues.carModel;
      this.isFilterRequested = true;
    } else {
      this.lowestModelFilter = '';
      this.highestModelFilter = 'zzz';
    }
  
    if (filteringValues.year > '' ){
      this.lowestYearFilter = filteringValues.year;
      this.highestYearFilter = filteringValues.year;
      this.isFilterRequested = true;
    } else {
      this.lowestYearFilter = '0';
      this.highestYearFilter = '9999';
    }
  
    /*this.gearboxFilter = filteringValues.gearbox; */
    if (filteringValues.gearbox > '' ){
      this.lowestGearboxFilter = filteringValues.gearbox;
      this.highestGearboxFilter = filteringValues.gearbox;
      this.isFilterRequested = true;
    } else {
      this.lowestGearboxFilter = '';
      this.highestGearboxFilter = 'zzz';
    }
  
    if (filteringValues.lowestPrice > '' ){
      this.lowestPriceFilter = filteringValues.lowestPrice;
      this.isFilterRequested = true;
    } else {
      this.lowestPriceFilter = '0'; 
    }
  
    if (filteringValues.highestPrice > '' ){
      this.highestPriceFilter = filteringValues.highestPrice;
      this.isFilterRequested = true;
    } else {
      this.highestPriceFilter = '999999999';
    } 
  
  }

  /**
   * determining sort criteria and order criteria from template field selected
   * @param sortCriteriaSelected 
   */
  determineSortAndOrder(sortCriteriaSelected){

    switch (sortCriteriaSelected){
      case 'dateDESC':
          this.sortCriteria = 'date';
          this.orderCriteria = 'DESC';
          break;
      case 'dateASC':
          this.sortCriteria = 'date';
          this.orderCriteria = 'ASC';
          break;
      case 'priceDESC':
          this.sortCriteria = 'price';
          this.orderCriteria = 'DESC';
          break;
      case 'priceASC':
          this.sortCriteria = 'price';
          this.orderCriteria = 'ASC';
          break;
      case 'yearDESC':
          this.sortCriteria = 'year';
          this.orderCriteria = 'DESC';
          break;
      case 'yearASC':
          this.sortCriteria = 'year';
          this.orderCriteria = 'ASC';
          break;
    }
  }

}
