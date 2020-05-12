import { Component, OnInit } from '@angular/core';

import { UserService } from '../_services/user.service';

import { TokenStorageService } from '../_services/token-storage.service';

import { DataService } from '../data.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

  content = '';

  currentUser: any;

  userId;

  userDetailObs;

  message:String;

  constructor(private userService: UserService,
              private tokenStorageService: TokenStorageService,
              private dataService: DataService,
              private router: Router) { }

  ngOnInit() {

    console.log('board user ngOnInit');

  /* retrieving User id*/
  this.currentUser = this.tokenStorageService.getUser();
  this.userId = this.currentUser.id;

  console.log(this.userId);

  /*get an observable containing the data of a user*/
  this.userDetailObs = this.dataService.getUserDetail(this.userId);
  } 

  onConsult(offerId){
    this.router.navigate(['/offerDetail', offerId]);
  }


  onUpdate(offerId){
    this.router.navigate(['/update', offerId]);
  }


  onDelete(offerIdToDelete){
    this.dataService.deleteOffer(offerIdToDelete)
    .subscribe( {
      next: savedOffer => {console.log(savedOffer);
                this.message = "Annonce supprimée";
                this.userDetailObs = this.dataService.getUserDetail(this.userId);},
      error:err => {console.error(err);
                    this.message = "Erreur lors de la suppression de l'annonce";}});
  }

}
