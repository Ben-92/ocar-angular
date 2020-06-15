import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';

import { Router} from '@angular/router'; 

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

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  /**
   * send register request
   */
  onSubmit() {
    this.authService.register(this.form).subscribe(
      data => {

        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['']); 
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

}
