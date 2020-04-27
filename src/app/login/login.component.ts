import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

/* getting params */
import { Router, ActivatedRoute, NavigationEnd, RoutesRecognized } from '@angular/router'; 

import { Location } from '@angular/common';

import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  /* Url to Redirect to */
  /*redirectUrl; */
  /*currentUrl;
  previousUrl; */
  sourceURL;
  autoDisplayLoginForm = false;

/* addding location to go back */
/*  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private location: Location) { } */
/* constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { } */
constructor(private authService: AuthService, 
            private tokenStorage: TokenStorageService, 
            private router: Router,
            private route: ActivatedRoute) {

              console.log('login constructor');
 }

  ngOnInit() {

    console.log('login component');
    /*console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.queryParams.redirect); */

    this.sourceURL = this.route.snapshot.queryParams.sourceURL;
    console.log(this.sourceURL);
    if (this.sourceURL > ''){
      this.autoDisplayLoginForm = true;
    }

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }

  }

  onSubmit() {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage(); 
        /*this.goBack();*/
        /* go back from where we arrive 
        this.location.back(); */
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    /*console.log(window.location);*/
    window.location.reload();
  }

  
  onGoBack() {
    console.log(this.sourceURL);
    this.router.navigate([this.sourceURL]);

  } 

  /*
  goBack() {

    setTimeout(function(){
      console.log('waiting...')},9000);

    console.log('goBack');
    console.log(this.sourceURL);
    this.router.navigate([this.sourceURL]); */

    /*setTimeout(function(){
      console.log('goBack');
      console.log(this.sourceURL);
      this.router.navigate([this.sourceURL])},4000)*/
 
    /*this.router.navigate([this.sourceURL]); 
  } */

}
