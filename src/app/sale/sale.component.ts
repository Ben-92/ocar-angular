import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

import {tap} from 'rxjs/operators';

import { Offer } from '../offer';

import { TokenStorageService } from '../_services/token-storage.service';
import { Sale } from '../sale';

import { FormBuilder, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

declare var paypal : any;


@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit{

  /* param data form param file, to get the commissionRate */
  jsonParamData;

  /*Id of the offer */
   offerIdDetail ;

   /*car price as specified inthe offer */
   carOfferPrice ;

   /*sale offer */ 
   offerToBuy;

   /*Id of the user who deposit the offer */
   userIdSelling;

  /* true if user is logged in */
  isLoggedIn = false;

  /* user Object connected */
  loggedUserBuyer: any;

  /*user Id retrieved from user Object connected */
    userIdBuyer;

  /*Sale concluded */
  saleConcluded : Sale;

  /*Id of the sale concluded after being saved in db */
  saleIdCreated;

  /* indicates if final price has been validated by the buyer */
  isFinalPriceValidated : Boolean;

  /* indicates whether the buy form is submitted */
  isSubmitted : boolean;

    /*informational/error message */
    message:String;


    /*general informations formgroup */ 
    buyForm = this.formBuilder.group({
      finalPrice: ['', [Validators.required, Validators.pattern('[0-9]*')]]
    })

  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private router: Router,
              private tokenStorageService: TokenStorageService,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient) { }

  ngOnInit() {

    this.httpClient.get("../../assets/param.json")
      .subscribe(paramData => this.jsonParamData = paramData);

    console.log('nginit sale');
    this.isFinalPriceValidated = false;

    this.isLoggedIn = !!this.tokenStorageService.getToken(); 


    /* routing - get the param Id of the offer from the url */ 
    this.route.paramMap
      .subscribe(params => {
       this.offerIdDetail = params.get('offerId');
       if (this.isLoggedIn){

        this.loggedUserBuyer = this.tokenStorageService.getUser();
        this.userIdBuyer = this.loggedUserBuyer.id;
          /*get an observable containing the data of an offer */
        this.dataService.getOfferDetail(this.offerIdDetail)
            .pipe(
            /* retrieving price informations before displaying it */
                tap ((offer:Offer) => {
                  console.log('ici');
                  
                  this.carOfferPrice = offer.price;
                  this.buyForm.get('finalPrice').setValue(offer.price);
                  console.log(this.carOfferPrice);
                }),
            )
            .subscribe( {
              next: (offer) => {
                this.offerToBuy = offer;
                this.userIdSelling = offer.user.id;
              },
              error:err => {console.error(err);}});
       } 
      });
    

    paypal.Buttons({
      
      createOrder: function(data, actions) {
      
        let amount ;
        amount = document.getElementById('price');

        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value : amount.value
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          // This function shows a transaction success message to your buyer.
          alert('Merci pour votre achat ' + details.payer.name.given_name); 
        });
      }
    }).render('#paypal-button-container');
  }

  onLoginchoice(){
    /* route towards login form with return URL in parameter */
    this.router.navigate(['/login'], {queryParams : {sourceURL:'/sale'+'/'+this.offerIdDetail }})
  }

  onBuy(buyData) {

    this.isSubmitted = true;
    //this.buyForm.get('finalPrice').disable();

    /*test = buyData.finalPrice;*/
    let dateOfSale = new Date();

    let commissionRateParam = this.jsonParamData.commissionRate;

    let saleConcluded = {
      /*finalPrice : document.getElementById('mirror-price').innerText, */
      finalPrice : buyData.finalPrice,
      date : dateOfSale,
      commissionRate : commissionRateParam
    }    
        //POST new offer to user
        this.dataService.addSaleToUser(this.userIdBuyer, saleConcluded, this.offerIdDetail)
            .pipe(
              tap ((value:Sale) => {
              this.saleIdCreated = value.id;
              console.log(this.saleIdCreated)}) 
            )
            .subscribe( {
              next: savedSale => {console.log(savedSale);
                                  this.isFinalPriceValidated = true;
                                  this.message = "Veuillez choisir un mode de paiement pour cet achat de " + buyData.finalPrice + " euros";},
                               //   this.message = "Le montant de la transaction a été enregistré. Veuillez choisir un mode de paiement";},
              error:err => {console.error(err);
                            this.message = "Erreur lors de l'enregistrement du montant de la transaction";}});
  } 

  /*onSimulate(){
    window.open("https://www.cetelem.fr/fr/credit/financement-vehicules-2-roues/credit-auto-neuve?co=LSG1B&cid=SEM__Conso__google__SEA_Conso_Marque+combinaisons__Cetelem_Cr%C3%A9dit+auto_Exact__cetelem%20auto__283144237671__e__mkw%7cIxUIV0MO__c&gclid=CjwKCAjwkun1BRAIEiwA2mJRWeJi-xVIcHO1GVUPm-G6vbAkKkcEK3vgShXELqwKHCgs8SuS1OHdpRoCdmQQAvD_BwE&gclsrc=aw.ds", "_blank");
  } */

  onCash() {
    
  }


  /*
  ngAfterViewInit() {
    console.log('Afterviewinit sale');
    console.log(this.carOfferPrice);
    let amount = 10;
    paypal.Buttons({
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value : amount
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          // This function shows a transaction success message to your buyer.
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      }
    }).render('#paypal-button-container');
  } */

}
