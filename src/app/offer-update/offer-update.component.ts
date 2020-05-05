import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../data.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';

import {map, tap} from 'rxjs/operators';

import { Offer } from '../offer';

@Component({
  selector: 'app-offer-update',
  templateUrl: './offer-update.component.html',
  styleUrls: ['./offer-update.component.css']
})
export class OfferUpdateComponent implements OnInit {

  offerIdOnUse;
  offerToUpdate;
  offerToSendToBack : Offer;

  brandList  =this.dataService.brands;
  modelList = this.dataService.models;
  yearList = this.dataService.years;

  equipmentForm: FormGroup;
  equipmentList = this.dataService.equipments;

  offerEquipment;

  shoulBeChecked : Boolean;

  /*message : String;*/
  generalInfoMessage : String;
  imageMessage : String;
  equipmentMessage : String;

  isSubmitted : boolean;

  userId;

  selectedFile : File;


  depositForm = this.formBuilder.group({
    postalCode: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('[0-9]*')]],
    carBrand: ['',Validators.required],
    carModel: ['',Validators.required],
    year: ['',Validators.required],
    gearbox:'',
    /*match from the beginning any of the character class : a toz, A to Z, whitespace, -, ' */
    outerColor:['',Validators.pattern('^[-a-zA-Z\\s\']*$')],
    fourWheelDrive:'',
    description:'',
    price: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    date:''
  })

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService,
              private formBuilder: FormBuilder) { 


  }

  ngOnInit() {

      /* routing - get the param Id of the offer from the url */ 
      this.route.paramMap
      .subscribe(params => {
        this.offerIdOnUse = params.get('offerId');
      })
      this.reloadPage();
  } 


  private addCheckboxes() {

    this.equipmentList.forEach((equipmentItem, equipmentIndex) => {
      this.shoulBeChecked = false;
      this.offerEquipment.forEach((offerEquipmentItem, offerEquipmentIndex) => {

        if (equipmentItem.label == offerEquipmentItem.label ){
          const indexTrue = equipmentIndex;
          const control = new FormControl(equipmentIndex === indexTrue);
          (this.equipmentForm.controls.equipments as FormArray).push(control);
          this.shoulBeChecked = true;
        }
      })
      if (!this.shoulBeChecked){
        const control = new FormControl();
        (this.equipmentForm.controls.equipments as FormArray).push(control);

      }

    });
  }

  onUpdate(offerUpdated) {

    this.initializeMessages();

    this.isSubmitted = true;

    /*not going further if not all the input fields have succeeded the Validator controls */
    if (this.depositForm.invalid){
      this.generalInfoMessage = "Veuillez vérifier les champs en erreur"
      return; 
    }

    /* retrieving the offer to update (before any updates) including images and equipments */
    this.offerToSendToBack = this.offerToUpdate;
    
    /* updating offer with new values */
    this.offerToSendToBack.carBrand = offerUpdated.carBrand;
    this.offerToSendToBack.carModel = offerUpdated.carModel;
    this.offerToSendToBack.description = offerUpdated.description;
    this.offerToSendToBack.fourWheelDrive = offerUpdated.fourWheelDrive;
    this.offerToSendToBack.outerColor = offerUpdated.outerColor;
    this.offerToSendToBack.gearbox = offerUpdated.gearbox;
    this.offerToSendToBack.postalCode = offerUpdated.postalCode;
    this.offerToSendToBack.year = offerUpdated.year;
    this.offerToSendToBack.price = offerUpdated.price;

    /*adding date time to the submitted offer */
    /*this.offerToSendToBack.date = new Date();*/

    this.dataService.updateOffer(this.offerIdOnUse, this.offerToSendToBack)
        .subscribe( {
          next: savedOffer => {console.log(savedOffer);
                            this.generalInfoMessage = "Infos générales mises à jour";},
          error:err => {console.error(err);
                        this.generalInfoMessage = "Erreur : infos générales non mises à jour";},
          complete : () => {this.reloadPage();}});
  }


  onFileChanged(event) {

    this.initializeMessages();

    this.selectedFile = event.target.files[0];

    if (this.selectedFile != null){
      this.dataService.addImageToDb(this.offerIdOnUse,  this.selectedFile)
      .subscribe({
        next : img => { console.log('next: post image');},
        error:err => {console.error(err);
                      this.imageMessage = "Erreur : image non enregistrée";},
        complete : () => {this.imageMessage = "Image enregistrée!";
                          this.reloadPage();}});
    }
  }

  onDeleteImage(imageIdToDelete) {

    this.initializeMessages();

    this.dataService.deleteImage(imageIdToDelete)
    .subscribe( {
      next: savedImage => {console.log(savedImage);
                this.imageMessage = "photo supprimée";
                },
      error:err => {console.error(err);
                    this.imageMessage = "Erreur lors de la suppression de la photo";},
      complete : () => {this.reloadPage();}});

  }

  submit(equipmentDeposit) {

    this.initializeMessages();

    const selectedEquipmentLabels = equipmentDeposit.equipments /* retrieve equipments FormArray from equipmentForm: true (if checked) or null */
      .map((value, i) => value ? this.equipmentList[i] : null) /* nouveau tableau : rapprochement entre les checked (qui sont à true) et les valeurs du tableau de données*/                                                    
      .filter(value => value !== null); /*new array with all non null elements */


    this.dataService.updateEquipmentToDb(this.offerIdOnUse,  selectedEquipmentLabels)
    .subscribe({
      next : img => { console.log('next: put equipment') },
      error:err => {console.error(err);
                    this.equipmentMessage = "Erreur : equipement non mis à jour";},
      complete : () => {this.equipmentMessage = "Equipement mis à jour !";
                        this.reloadPage();} 
    });

  }

  reloadPage(){

    this.equipmentForm = this.formBuilder.group({
      equipments: new FormArray([])
    }); 

     /*get an observable containing the data of an offer */
     this.dataService.getOfferDetail(this.offerIdOnUse)
     .pipe(
       /* retrieving page informations before displaying it */
       tap ((value:Offer) => {
         

         /* this.depositForm.setValue(value);*/
         this.depositForm.get('postalCode').setValue(value.postalCode); 
         this.depositForm.get('carBrand').setValue(value.carBrand); 
         this.depositForm.get('carModel').setValue(value.carModel);
         this.depositForm.get('year').setValue(value.year);
         this.depositForm.get('gearbox').setValue(value.gearbox);
         this.depositForm.get('outerColor').setValue(value.outerColor);
         if (value.fourWheelDrive == true){
           this.depositForm.get('fourWheelDrive').setValue('true');
         } else {
           this.depositForm.get('fourWheelDrive').setValue('false');
         }
         this.depositForm.get('description').setValue(value.description);
         this.depositForm.get('price').setValue(value.price);

       }),
     )
     .subscribe( {
       next: (offer) => {
         this.userId = offer.user.id;
         this.offerToUpdate = offer;
         this.offerEquipment = offer.equipments;
       

         this.addCheckboxes();
      },
       error:err => {console.error(err);}});
  }

  initializeMessages(){
    this.generalInfoMessage = '';
    this.equipmentMessage = '';
    this.imageMessage = '';
  }

}
