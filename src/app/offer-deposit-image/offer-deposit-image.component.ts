import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

@Component({
  selector: 'app-offer-deposit-image',
  templateUrl: './offer-deposit-image.component.html',
  styleUrls: ['./offer-deposit-image.component.css']
})
export class OfferDepositImageComponent implements OnInit {

  message:String;

  selectedFile : File;
  imageName : any;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
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
  onUpload() {
    this.dataService.addImageToDb(this.selectedFile)
    .subscribe({
      error:err => {console.error(err);
                    this.message = "Erreur : image non enregistrée";},
      complete : () => this.message = "Image enregistrée!"});
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
