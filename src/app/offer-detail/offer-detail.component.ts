import { Component, OnInit} from '@angular/core';
import { DataService } from '../data.service';

import { ActivatedRoute, Router } from '@angular/router';

declare var paypal : any;

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.css']
})
export class OfferDetailComponent implements OnInit {



  /*observable containing the offer */
  offerDetailObs;

  /*Id of the offer */
  offerIdDetail ;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) { 

              }
/*
  ngAfterViewInit() {
    paypal.Buttons({
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '5'
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

  ngOnInit() {

    /* routing - get the param Id of the offer from the url */ 
    this.route.paramMap.subscribe(params => {
      this.offerIdDetail = params.get('offerId');

      /*get an observable containing the offer */
      this.offerDetailObs = this.dataService.getOfferDetail(this.offerIdDetail);

  });

  }

  onBuy(offerId){
    this.router.navigate(['/sale', offerId]);
  }




  

}
