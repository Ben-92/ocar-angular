import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { FormBuilder } from '@angular/forms';

import { Offer } from '../offer';

import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-offer-deposit',
  templateUrl: './offer-deposit.component.html',
  styleUrls: ['./offer-deposit.component.css']
})
export class OfferDepositComponent implements OnInit {

  brandList  =this.dataService.brands;
  modelList = this.dataService.models;

  message:String;


  /*Id of the Offer created by the http POST request creating an offer for a client*/
  offerIdCreated;


  depositForm = this.formBuilder.group({
    postalCode: 0,
    carBrand: ' ',
    carModel: ' ',
    year:0,
    gearbox:' ',
    outerColor:' ',
    fourWheelDrive:' ',
    description:' ',
    price: 0
  })
  constructor(private dataService: DataService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  /**
   * adding an offer to a client and retrieving its id
   * @param offerDeposit form value with data of the Offer model
   */
  onDeposit(offerDeposit) {
    this.dataService.addOfferToSeller(1, offerDeposit)
        .pipe(
          tap ((value:Offer) => {
          this.offerIdCreated = value.id;
          console.log(this.offerIdCreated)}) 
        )
        .subscribe( {
          next: savedOffer => console.log(savedOffer),
          error:err => {console.error(err);
                        this.message = "Erreur : annonce non enregistrée";},
          complete : () => this.message = "Annonce " + this.offerIdCreated + " enregistrée!"});

  }




}
