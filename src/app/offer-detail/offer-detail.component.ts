import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

import { ActivatedRoute } from '@angular/router';

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
              private route: ActivatedRoute) { }

  ngOnInit() {

    /* routing - get the param Id of the offer from the url */ 
    this.route.paramMap.subscribe(params => {
      this.offerIdDetail = params.get('offerId');

      /*get an observable containing the offer */
      this.offerDetailObs = this.dataService.getOfferDetail(this.offerIdDetail);

  });

  }

}
