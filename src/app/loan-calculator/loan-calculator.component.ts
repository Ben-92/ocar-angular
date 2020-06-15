import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent implements OnInit {

  /* true if user is logged in */
  isLoggedIn = false;

    /*Id of the offer */
    offerIdDetail ;

      /* user Object connected */
  loggedUserBuyer: any;

  /*user Id retrieved from user Object connected */
    userIdBuyer;

  constructor(private router: Router,
              private tokenStorageService: TokenStorageService,
              private route: ActivatedRoute) { }

  /**
   * geting offer id in param route and getting user id from session storage
   */            
  ngOnInit() {

    this.isLoggedIn = !!this.tokenStorageService.getToken(); 

    this.route.paramMap
    .subscribe(params => {
     this.offerIdDetail = params.get('offerId');
     if (this.isLoggedIn){
      this.loggedUserBuyer = this.tokenStorageService.getUser();
      this.userIdBuyer = this.loggedUserBuyer.id;
     }})

  }

  /**
   * route towards login form with return URL in parameter
   */
  onLoginchoice(){
    this.router.navigate(['/login'], {queryParams : {sourceURL:'/loanCalculator'+'/'+this.offerIdDetail }})
  }

  /**
   * route towards personal finance loan simulation official page
   */
  onSimulate(){
    window.open("https://www.cetelem.fr/fr/credit/financement-vehicules-2-roues/credit-auto-neuve?co=LSG1B&cid=SEM__Conso__google__SEA_Conso_Marque+combinaisons__Cetelem_Cr%C3%A9dit+auto_Exact__cetelem%20auto__283144237671__e__mkw%7cIxUIV0MO__c&gclid=CjwKCAjwkun1BRAIEiwA2mJRWeJi-xVIcHO1GVUPm-G6vbAkKkcEK3vgShXELqwKHCgs8SuS1OHdpRoCdmQQAvD_BwE&gclsrc=aw.ds", "_blank");
  }

}
