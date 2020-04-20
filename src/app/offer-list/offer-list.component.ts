import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder,Validators  } from '@angular/forms';
import {map, tap} from 'rxjs/operators';

import { OfferPage } from '../offer-page';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {

offerListObs;
filteredOfferListObs;

pageContent;
contentTotalPages;
contentTotalOffers;
actualPageNumber;
isFirstPage;
isLastPage;

singularPluralChar;

offersPerPage;
sortCriteria;
orderCriteria;

pageToDisplayChoice;

/*test; */

isFilterRequested;


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
  highestPrice: ['', Validators.pattern('[0-9]*')],

})

  constructor(private dataService: DataService, 
              private formBuilder: FormBuilder) { 
              }
   
  ngOnInit() {

    console.log('onInit');
    
    this.pageToDisplayChoice = 0;
    this.offersPerPage = 3;
    this.sortCriteria = 'date';
    this.orderCriteria = 'DESC';

    this.getFullListOfOffers();

  } 

  onSortSelectChange(sortCriteriaSelected){

    console.log('onSortSelectChange');
    console.log('fiter: ' + this.isFilterRequested );

    this.determineSortAndOrder(sortCriteriaSelected);
    
    this.pageToDisplayChoice = 0;

    if (this.isFilterRequested){
      this.getFilteredListOfOffers();
    } else {
      this.getFullListOfOffers();
    }

  }

  onNbOffersPerPageChange(offersPerPageCriteria){

    console.log('onNbOffersPerPageChange');
    console.log('fiter: ' + this.isFilterRequested );

    this.offersPerPage = offersPerPageCriteria;
    
    this.pageToDisplayChoice = 0;

    if (this.isFilterRequested){
      this.getFilteredListOfOffers();
    } else {
      this.getFullListOfOffers();
    }

  }


  displayPage(pageToDisplay){

    console.log('displayPage');
    console.log('fiter: ' + this.isFilterRequested );

    this.pageToDisplayChoice = pageToDisplay;


    if (this.isFilterRequested){
      this.getFilteredListOfOffers();
    } else {
      this.getFullListOfOffers();
    }

  } 
    

/*displayPage
A/ ici ajouter : si un filtre est saisi dans le formulaire de filtre, passer par le http Filter, sinon par le get 
0/d'abord modifier le form en désactivant par défaut un choix de radio button et créer une requète filter+page en incluant une clause radio between
1/tester si l'un des critères du formfilter est saisi (tester champ par champ, ce qui veut dire même le radio, ie il ne faut pas préchecker
  ie il faut modifier la requète en incluant le radio between)
2/ si modifié alors lanver la requète filter+page
3/ sinon lancer la requète page

B/
autre option : lancer la requète filter+page dans tous les cas, même si pas de filtre, même en arrivant sur l'écran
je pense que c'est le mieux car de toute façon, les gens mettront un filtre nécessairement
et dans ce cas là, je laisse par défaut un radio coché (manuel par exemple...non je décoche et je modifie la requète)
commencer par l'option A/
*/


  onFilter(filteringValues) {

    console.log('onFilter');

    this.populateCriterias(filteringValues);

    this.pageToDisplayChoice = 0;
    this.getFilteredListOfOffers();

  }

  getFullListOfOffers(){

    console.log('getFullListOfOffers');
    console.log(this.pageToDisplayChoice);
    console.log(this.sortCriteria);
    console.log(this.orderCriteria);


    this.dataService.getOfferList(this.pageToDisplayChoice, this.offersPerPage, this.sortCriteria, this.orderCriteria)
    .pipe(
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
        /*console.log('next');*/
     },
      error:err => {console.error(err);}});        
      /*complete : () => console.log('complete')}); */ 
  }

  getFilteredListOfOffers(){

    console.log('getFilteredOffers'); 
    console.log(this.pageToDisplayChoice);
    console.log(this.sortCriteria);
    console.log(this.orderCriteria);

    this.dataService.getFilteredOfferList(
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
    this.pageToDisplayChoice, this.offersPerPage, this.sortCriteria, this.orderCriteria)
    .pipe(
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
        /*console.log('next');*/
     },
      error:err => {console.error(err);}});        
      /*complete : () => console.log('complete')});  */
  }

  populateCriterias(filteringValues){

    console.log('populateCriterias'); 
  
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

  determineSortAndOrder(sortCriteriaSelected){

    console.log('determineSortAndOrder'); 
    console.log(sortCriteriaSelected);

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
