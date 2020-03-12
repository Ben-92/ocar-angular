import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-offer-deposit',
  templateUrl: './offer-deposit.component.html',
  styleUrls: ['./offer-deposit.component.css']
})
export class OfferDepositComponent implements OnInit {

  brandList  =this.dataService.brands;
  modelList = this.dataService.models;

  message:String;
  selectedFile : File;
  imageName : any;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any;

  depositForm = this.formBuilder.group({
    postalCode: 0,
    carBrand: ' ',
    carModel: ' ',
    year:0,
    gearbox:' ',
    outerColor:' ',
    fourWheelDrive:' ',
    description:' ',
    price: 0
  })
  constructor(private dataService: DataService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  /**
   * adding an offer to a client
   * @param offerDeposit form value with data of the Offer model
   */
  onDeposit(offerDeposit) {
    this.dataService.addOfferToSeller(1, offerDeposit)
        .subscribe({
          next:savedOffer => console.log(savedOffer),
          error:err => {console.error(err);
                        this.message = "Erreur : annonce non enregistrée";},
          complete : () => this.message = "Annonce enregistrée!"});

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
