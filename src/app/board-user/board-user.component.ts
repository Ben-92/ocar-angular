import { Component, OnInit } from '@angular/core';

import { UserService } from '../_services/user.service';

import { TokenStorageService } from '../_services/token-storage.service';

import { DataService } from '../data.service';
import { Router } from '@angular/router'; 

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

  /* param data form param file, to get the commissionRate */
  jsonParamData;
  commissionRateParam;

  content = '';

  currentUser: any;

  userId;

  userDetailObs;

  message:String;

  constructor(private userService: UserService,
              private tokenStorageService: TokenStorageService,
              private dataService: DataService,
              private router: Router,
              private httpClient: HttpClient) { }

  ngOnInit() {

    this.httpClient.get("../../assets/param.json")
    .subscribe(paramData => {this.jsonParamData = paramData;
      this.commissionRateParam = this.jsonParamData.commissionRate;
    });

     
  
  /* retrieving User id*/
  this.currentUser = this.tokenStorageService.getUser();
  this.userId = this.currentUser.id;


  /*get an observable containing the data of a user*/
  this.userDetailObs = this.dataService.getUserDetail(this.userId);
  } 

  /**
   * retrieving data from a specific offer
   * @param offerId id of the offer to retrieve
   */
  onConsult(offerId){
    this.router.navigate(['/offerDetail', offerId]);
  }


  /**
   * ipdating offer data 
   * @param offerId id of the offer to update
   */
  onUpdate(offerId){
    this.router.navigate(['/update', offerId]);
  }


  /**
   * delete an offer
   * @param offerIdToDelete id of the offer to delete
   */
  onDelete(offerIdToDelete){
    this.dataService.deleteOffer(offerIdToDelete)
    .subscribe( {
      next: savedOffer => {
                this.message = "Annonce supprimée";
                this.userDetailObs = this.dataService.getUserDetail(this.userId);},
      error:err => {console.error(err);
                    this.message = "Erreur lors de la suppression de l'annonce";}});
  }

  /**
   * calculate the money received by the seller, after site commission
   * @param finalPrice price after commission rate deduced
   * @param commissionRate commission rate parameter
   */
  priceReceivedBySeller(finalPrice, commissionRate){
    let commissionInEuros = (finalPrice * commissionRate)/100;
    let moneyToSeller = finalPrice - commissionInEuros ;
    return moneyToSeller;
  }

}
