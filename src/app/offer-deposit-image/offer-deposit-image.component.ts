import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private dataService: DataService,private route: ActivatedRoute) { }

  ngOnInit() {
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
    this.selectedFile = event.target.files[0]
  }

  /**
   * adding an uploaded image to database
   */
  /*
  onUpload() {
    this.dataService.addImageToDb(this.offerIdOnUse,  this.selectedFile)
    .subscribe({
      error:err => {console.error(err);
                    this.message = "Erreur : image non enregistrée";},
      complete : () => this.message = "Image enregistrée!"});
  } */

  /**
   * adding an uploaded image to database and get offer 
   */
  onUpload() {
    this.dataService.addImageToDb(this.offerIdOnUse,  this.selectedFile)
    .subscribe({
      next : img => { console.log('next: post image')
                      this.offerInUseObs = this.dataService.getOfferDetail(this.offerIdOnUse)
                      /*.subscribe({
                          next : (offerS:Offer) => {console.log('next : retour get offerdetail');
                                            console.log(offerS);}, 
                          error: errget => console.log(errget),
                          complete: () => console.log('complete : get offerdetail')
                      });*/
          console.log('ici 1');
      },
      error:err => {console.error(err);
                    this.message = "Erreur : image non enregistrée";},
      complete : () => {console.log('complete: post image')
                        this.message = "Image enregistrée!"}
    });
  console.log('ici 2');
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
