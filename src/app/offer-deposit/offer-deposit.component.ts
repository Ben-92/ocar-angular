import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { FormBuilder, Validators } from '@angular/forms';

import { Offer } from '../offer';

import {map, tap} from 'rxjs/operators';
import { concat } from 'rxjs';

import { TokenStorageService } from '../_services/token-storage.service';

import { Router, ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-offer-deposit',
  templateUrl: './offer-deposit.component.html',
  styleUrls: ['./offer-deposit.component.css']
})
export class OfferDepositComponent implements OnInit {
  
  /* true if user is logged in */
  isLoggedIn = false;

  /* data lists retrieved from data service */
  brandList  =this.dataService.brands;
  modelList = this.dataService.models;
  yearList = this.dataService.years;

  /*informational/error message */
  message:String;

  /* true if form submitted */
  isSubmitted : boolean;


  /*Id of the Offer created by the http POST request creating an offer for a client*/
  offerIdCreated;

  /* user Object connected */
  currentUser: any;

 /*user Id retrieved from user Object connected */
  userIdCreatingOffer;


  /* deposit formgroup */ 
  depositForm = this.formBuilder.group({
    postalCode: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('[0-9]*')]],
    carBrand: ['',Validators.required],
    carModel: ['',Validators.required],
    year: ['',Validators.required],
    gearbox:'Manuelle',
    /*match from the beginning any of the character class : a toz, A to Z, whitespace, -, '*/
    outerColor:['',Validators.pattern('^[-a-zA-Z\\s\']*$')],
    fourWheelDrive:'false',
    description:'',
    price: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    date:''
  })
  constructor(private dataService: DataService,
              private formBuilder: FormBuilder,
              private tokenStorageService: TokenStorageService,
              private router: Router,
              /*private route: ActivatedRoute,*/
              ) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken(); 
    
        /*this.depositForm.get('postalcode').valueChanges
      .subscribe(pcEntered => {

      })*/
  }

  onLoginchoice(){

    /* route towards login form with return URL in parameter */
    this.router.navigate(['/login'], {queryParams : {sourceURL:'/deposit'}})
  }

  /**
   * adding an offer to a client and retrieving its id
   * when terminate ok --> route towards image deposit component
   * @param offerDeposit form value with data of the Offer model
   */
  onDeposit(offerDeposit) {

    this.isSubmitted = true;

    /*not going further if not all the input fields have succeeded the Validator controls */
    if (this.depositForm.invalid){
      this.message = "Veuillez vérifier les champs en erreur"
      return; 
    }

    /* retrieving User id*/
    this.currentUser = this.tokenStorageService.getUser();
    this.userIdCreatingOffer = this.currentUser.id;


    /*adding date time now of offer creation to the submitted offer */
    offerDeposit.date = new Date();

    /* POST new offer to user */
    this.dataService.addOfferToUser(this.userIdCreatingOffer, offerDeposit)
        .pipe(
          tap ((value:Offer) => {
          this.offerIdCreated = value.id;
          console.log(this.offerIdCreated)}) 
        )
        .subscribe( {
          next: savedOffer => {console.log(savedOffer);
                              this.router.navigate(['/offerDepositImage', this.offerIdCreated]);},
          error:err => {console.error(err);
                        this.message = "Erreur : annonce non enregistrée";}});
          /*complete : () => this.message = "Annonce " + this.offerIdCreated + " enregistrée!"});*/

  }

  isInvalid(field){
    if ((this.depositForm.get(field).errors && (this.depositForm.get(field).touched || this.depositForm.get(field).dirty))
             || (this.isSubmitted && this.depositForm.get(field).errors))
    {
      return true;
    }
  }


}
