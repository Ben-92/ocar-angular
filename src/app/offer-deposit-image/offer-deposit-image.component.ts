import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Offer } from '../offer';

@Component({
  selector: 'app-offer-deposit-image',
  templateUrl: './offer-deposit-image.component.html',
  styleUrls: ['./offer-deposit-image.component.css']
})
export class OfferDepositImageComponent implements OnInit {

  /*informational/error message */
  message:String;

  /*Id of the offer created on the first deposit page*/
  offerIdOnUse;

 /*observable of the offer the user want to upload image to */
  offerInUseObs;

  /*selected file on local storage user device */
  selectedFile : File;

  /*
  imageName : any;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any; */

  /*variable navigation text button */
  textButton : String;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) { }

  /**
   * retrieve offer id
   */
  ngOnInit() {
    this.textButton = 'Je ne souhaite pas déposer de photo';

        /* routing - get the param Id of the offer from the url */ 
        this.route.paramMap
          .subscribe(params => {
            this.offerIdOnUse = params.get('offerId');
          })
  }

    /**
   * getting selected file chosen by the client and POST it to the offer
   * retrieving an observable of the offer updated
   * @param event change event payload
   */
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile != null){
      this.dataService.addImageToDb(this.offerIdOnUse,  this.selectedFile)
      .subscribe({
        next : noValueBack => { this.textButton = "Passer à l'étape suivante";
                        this.offerInUseObs = this.dataService.getOfferDetail(this.offerIdOnUse);
        },
        error:err => {console.error(err);
                      this.message = "Erreur : image non enregistrée";},
        complete : () => {this.message = "Image enregistrée!"}
      }); 
    }
  }

  onClickNavigate(){
    this.router.navigate(['/offerDepositEquipment', this.offerIdOnUse]);
  }


/*
  getImage() {
    this.dataService.getImageFromDb(this.imageName)
    .subscribe(
      res => {
        this.retrieveResponse = res;
        this.base64Data = this.retrieveResponse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    );
  } */

}

