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

  message:String;

  offerIdOnUse;
  offerInUseObs;

  selectedFile : File;
  imageName : any;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any;

  textButton : String;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    this.textButton = 'Je ne souhaite pas déposer de photo';

        /* routing - get the param Id of the offer from the url */ 
        this.route.paramMap
          .subscribe(params => {
            this.offerIdOnUse = params.get('offerId');
          })
  }

    /**
   * getting selected file chosen by the client
   * @param event ????
   */
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile);
    if (this.selectedFile != null){
      this.dataService.addImageToDb(this.offerIdOnUse,  this.selectedFile)
      .subscribe({
        next : img => { console.log('next: post image');
                        this.textButton = "Passer à l'étape suivante";
                        this.offerInUseObs = this.dataService.getOfferDetail(this.offerIdOnUse);
        },
        error:err => {console.error(err);
                      this.message = "Erreur : image non enregistrée";},
        complete : () => {console.log('complete: post image')
                          this.message = "Image enregistrée!"}
      }); 
    }
  }

  onClickNavigate(){

    this.router.navigate(['/offerDepositEquipment', this.offerIdOnUse]);
  }


  /**
   * retrieving an image from database, giving its name
   */
  getImage() {
    this.dataService.getImageFromDb(this.imageName)
    .subscribe(
      res => {
        this.retrieveResponse = res;
        this.base64Data = this.retrieveResponse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    );
  }

}

