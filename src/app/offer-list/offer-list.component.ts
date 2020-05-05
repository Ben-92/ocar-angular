import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder,Validators  } from '@angular/forms';
import {map, tap} from 'rxjs/operators';

import { OfferPage } from '../offer-page';

import { Router } from '@angular/router'; 

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

  /*
offerListObs;
filteredOfferListObs; */

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
brandList  =this.dataService.brands;
modelList = this.dataService.models;
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
  highestPrice: ['', Validators.pattern('[0-9]*')],

})

  constructor(private dataService: DataService, 
              private formBuilder: FormBuilder,
              private router: Router
              ) { 
              }
   
  ngOnInit() {

    console.log('ngoninit')
    
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

    /*document.getElementById('offer-list').scrollIntoView();*/
    /*document.getElementById('offer-list').scrollTo();*/

  } 


/**
 * new page display after submitting criteria filter form
 * @param filteringValues filter form values
 */
  onFilter(filteringValues) {

    this.populateCriterias(filteringValues);

    this.pageToDisplay = 0;
    this.getFilteredPageOfOffers();

  }

  /**
   * retrieving a non filtered page of offers
   */
  getPageOfOffers(){


    this.dataService.getOfferPage(this.pageToDisplay, this.offersPerPage, this.sortCriteria, this.orderCriteria)
    .pipe(
      /* retrieving page informations before displaying it */
      tap ((value:OfferPage) => {
        this.actualPageNumber = value.number; 
        this.pageContent = value.content;
  
        this.isFirstPage = value.first;
        this.isLastPage = value.last;
        
        this.contentTotalPages = value.totalPages;
        this.contentTotalOffers = value.totalElements;

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
    this.gearboxFilter,
    this.lowestPriceFilter,
    this.highestPriceFilter,
    this.pageToDisplay, this.offersPerPage, this.sortCriteria, this.orderCriteria)
    .pipe(
      /* retrieving page informations before displaying it */
      tap ((value:OfferPage) => {
        this.actualPageNumber = value.number; 
        this.pageContent = value.content;
  
        this.isFirstPage = value.first;
        this.isLastPage = value.last;
        
        this.contentTotalPages = value.totalPages;
        this.contentTotalOffers = value.totalElements;

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
  
    if (filteringValues.dptCode > '' ){
      this.lowestPostCodeFilter = filteringValues.dptCode + '000';
      this.highestPostCodeFilter = filteringValues.dptCode + '999';
      this.isFilterRequested = true;
    } else {
      this.lowestPostCodeFilter = '00000';
      this.highestPostCodeFilter = '99999';
    }
  
    if (filteringValues.carBrand > '' ){
      this.lowestBrandFilter = filteringValues.carBrand;
      this.highestBrandFilter = filteringValues.carBrand;
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
  
    this.gearboxFilter = filteringValues.gearbox;
  
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
