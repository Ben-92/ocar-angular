import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';

import { Router, ActivatedRoute} from '@angular/router'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  sourceURL;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.sourceURL = this.route.snapshot.queryParams.sourceURL;
    console.log(this.sourceURL);
  }

  /**
   * send register request
   */
  onSubmit() {
    this.authService.register(this.form).subscribe(
      data => {

        this.isSuccessful = true;
        this.isSignUpFailed = false;
        /*this.router.navigate(['']); */

        this.onGoBack();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  onGoBack() {
    console.log('onGoBack');

    if (this.sourceURL > '') {
      this.router.navigate([this.sourceURL]);
    } else {
      this.router.navigate(['']); 
    }

  } 

}
