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

/*offerListRetrieved;
offerPageRetrieved; */

pageContent;
contentTotalPages;
contentTotalOffers;
actualPageNumber;
isFirstPage;
isLastPage;

/*items : Array<any>; */

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

              /*
  ngOnInit() {

    this.dataService.getOfferList()
    .subscribe( {
      next: (offerList) => {console.log(offerList);
        this.offerListRetrieved = offerList;
     },
      error:err => {console.error(err);},        
      complete : () => console.log('complete')});  
  } */

   
  ngOnInit() {

    this.dataService.getOfferList(0, 4, "date", "DESC")
    .pipe(
      tap ((value:OfferPage) => {
        this.actualPageNumber = value.number;
        this.pageContent = value.content;

        this.isFirstPage = value.first;
        this.isLastPage = value.last;
        
        this.contentTotalPages = value.totalPages;
        this.contentTotalOffers = value.totalElements;

        /*console.log(this.offerPageRetrieved) */
        console.log(this.pageContent);
        console.log(value.totalElements);
        console.log(value.totalPages);
      }),
    )
    .subscribe( {
      next: (offerPage) => {
        console.log(offerPage);
        console.log('next');
     },
      error:err => {console.error(err);},        
      complete : () => console.log('complete')});  
  } 

  displayPage(pageToDisplay){

/*ici ajouter : si un filtre est saisi dans le formulaire de filtre, passer par le http Filter, sinon par le get 
0/d'abord modifier le form en désactivant par défaut un choix de radio button et créer une requète filter+page en incluant une clause radio between
1/tester si l'un des critères du formfilter est saisi (tester champ par champ, ce qui veut dire même le radio, ie il ne faut pas préchecker
  ie il faut modifier la requète en incluant le radio between)
2/ si modifié alors lanver la requète filter+page
3/ sinon lancer la requète page

autre option : lancer la requète filter+page dans tous les cas, même si pas de filtre, même en arrivant sur l'écran
je pense que c'est le mieux car de toute façon, les gens mettront un filtre nécessairement
et dans ce cas là, je laisse par défaut un radio coché (manuel par exemple...non je décoche et je modifie la requète)
*/


    this.dataService.getOfferList(pageToDisplay, 4, "date", "DESC")
    .pipe(
      tap ((value:OfferPage) => {
        this.actualPageNumber = value.number;
        this.pageContent = value.content;

        this.isFirstPage = value.first;
        this.isLastPage = value.last;
        
        this.contentTotalPages = value.totalPages;
        this.contentTotalOffers = value.totalElements;
      }),
    )
    .subscribe( {
      next: (offerPage) => {
        console.log(offerPage);
        console.log('next');
     },
      error:err => {console.error(err);},        
      complete : () => console.log('complete')});  
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

    /*this.offerListObs = this.dataService.getOfferList(); */
