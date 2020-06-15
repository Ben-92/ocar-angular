import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

import { Router, ActivatedRoute} from '@angular/router'; 

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
  username : String;


  sourceURL;
  autoDisplayLoginForm = false;

constructor(private authService: AuthService, 
            private tokenStorage: TokenStorageService, 
            private router: Router,
            private route: ActivatedRoute) {
 }

 /**
  * retrieving url of the calling component
  * retrieving user name in session token
  */
  ngOnInit() {

    console.log('ngoninit login');

    this.sourceURL = this.route.snapshot.queryParams.sourceURL;

    console.log(this.sourceURL);

    if (this.sourceURL > ''){
      this.autoDisplayLoginForm = true;
    }

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;

      this.username = this.tokenStorage.getUser().username;
    }

  }

  /**
   * send authentication request
   * emit Eventemitter Subject for nav bar data to reload
   */
  onSubmit() {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.username = this.tokenStorage.getUser().username;

        /*emit the observable isLoggedObs containing the value true if user is logged in*/
        this.authService.emitSubject();
   
        this.onGoBack();

      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }
  
  onGoBack() {
    if (this.sourceURL > '') {
      console.log(this.sourceURL);
      this.router.navigate([this.sourceURL]);
    } else {
      this.router.navigate(['']); 
    }

  } 

}
