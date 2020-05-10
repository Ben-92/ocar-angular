import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

import {tap} from 'rxjs/operators';

import { Offer } from '../offer';

import { TokenStorageService } from '../_services/token-storage.service';

declare var paypal : any;

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit{

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

    test;


  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private router: Router,
              private tokenStorageService: TokenStorageService) { }

  ngOnInit() {

    this.test = 12;
    console.log('nginit sale');

    this.isLoggedIn = !!this.tokenStorageService.getToken(); 

    console.log(this.isLoggedIn);

    /* routing - get the param Id of the offer from the url */ 
    this.route.paramMap
      .subscribe(params => {
       console.log(params);
       this.offerIdDetail = params.get('offerId');
       if (this.isLoggedIn){
          /*get an observable containing the data of an offer */
        this.dataService.getOfferDetail(this.offerIdDetail)
            .pipe(
            /* retrieving price informations before displaying it */
                tap ((offer:Offer) => {
                  console.log('ici');
                  
                  this.carOfferPrice = offer.price;
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
        /*console.log('yo');
        console.log(this.carOfferPrice);
        console.log(amount);
        console.log(data);*/
        amount = document.getElementById('mirror-price').innerText
        console.log(amount);
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              /* value : 2100 */
              /*value: parseInt(this.carOfferPrice,10) */
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
  }

  onLoginchoice(){
    /* route towards login form with return URL in parameter */
    this.router.navigate(['/login'], {queryParams : {sourceURL:'/sale'+'/'+this.offerIdDetail }})
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
