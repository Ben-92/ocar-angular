import { Component, OnInit} from '@angular/core';
import { DataService } from '../data.service';

import { ActivatedRoute, Router } from '@angular/router';


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

  /**
   * getting offer id from routing param and retrieving offer data
   */
  ngOnInit() {

    /* routing - get the param Id of the offer from the url */ 
    this.route.paramMap.subscribe(params => {
      this.offerIdDetail = params.get('offerId');

      /*get an observable containing the offer */
      this.offerDetailObs = this.dataService.getOfferDetail(this.offerIdDetail);

  });

  }

  /**
   * navigate to sale component
   * @param offerId Id of the offer the user wants to buy
   */
  onBuy(offerId){
    this.router.navigate(['/sale', offerId]);
  }

  /**
   * navigate to loan calculator component
   * @param offerId Id of the offer the user wants to make simulation to
   */
  onLoan(offerId){
    this.router.navigate(['/loanCalculator', offerId]);
  }

}
