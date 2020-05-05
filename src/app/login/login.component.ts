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

  ngOnInit() {

    this.sourceURL = this.route.snapshot.queryParams.sourceURL;

    if (this.sourceURL > ''){
      this.autoDisplayLoginForm = true;
    }

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;

      this.username = this.tokenStorage.getUser().username;
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
        this.username = this.tokenStorage.getUser().username;
        this.reloadPage(); 
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
    console.log(this.sourceURL);
    this.router.navigate([this.sourceURL]);

  } 

}
