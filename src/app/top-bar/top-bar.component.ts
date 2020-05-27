import { Component, OnInit } from '@angular/core';

import { TokenStorageService } from '../_services/token-storage.service';

import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;

  constructor(private tokenStorageService: TokenStorageService,
              private authService: AuthService) {

      /*From the first construction of the component, it stays subscribed to the observable isLoggedObs containing the value true when user logged in*/
      this.authService.isLoggedObs.subscribe(value => {
        console.log('constructor top bar');
        if (value == true){
          
          this.getUserData();
          
          /*
          this.isLoggedIn = !!this.tokenStorageService.getToken();

          if (this.isLoggedIn) {
            const user = this.tokenStorageService.getUser();
            this.roles = user.roles;
      
            this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
            this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      
            this.username = user.username; 
          } */
        }
      })
   }

  ngOnInit() {

    console.log('ngoninit top-bar');

   this.getUserData();

   /*
   this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    } */ 
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  getUserData(){

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }

  }

}
