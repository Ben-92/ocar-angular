import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offer-deposit-equipment',
  templateUrl: './offer-deposit-equipment.component.html',
  styleUrls: ['./offer-deposit-equipment.component.css']
})
export class OfferDepositEquipmentComponent implements OnInit {

 /*Id of th offer created on the first deposit page*/
  offerIdOnUse;

  /*informational/error message */
  message:String;

  /* true if the form has been successfully upfated in database */
  isDepositComplete : Boolean;

  equipmentForm: FormGroup;

   /* equipment list retrieved from data service */
  equipmentList; /*= this.dataService.equipments;*/


  equipmentListTypeSaved ;

  constructor(private formBuilder: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) {

    console.log('deposit equipment constructor');  
      this.equipmentForm = this.formBuilder.group({
        equipmentsFormArray: new FormArray([])
      });

     }


  /**
  * getting equipments from database
  * retrieve offer id
  */
  ngOnInit() {

    console.log('deposit equipment ngOnInit'); 

    /*get an observable containing the equipments */
    this.dataService.getEquipmentList()
    .subscribe( {
      next: value  => {this.equipmentList = value;
                       console.log('equipmentList: ');
                      console.log(this.equipmentList)
                      this.addCheckboxes(); },
      error:err => {console.error(err); 
                    }});
     

    this.isDepositComplete = false;

    this.route.paramMap
    .subscribe(params => {
      this.offerIdOnUse = params.get('offerId');
    })
  }


  /**
   * each equipment correspond to one formcontrol, each formcontrol is an element of the formarray
   * here we link index of equipmentList with index of the formArray
   */
  private addCheckboxes() {

    this.equipmentList.forEach((equipmentItem, equipmentIndex) => {

      const control = new FormControl();
      (this.equipmentForm.controls.equipmentsFormArray as FormArray).push(control); 
    });

  }

  /**
   * PUT equipment list and updating it to the offer in database
   * @param equipmentFormDeposit formarray of user choices (check or not check for each equipment item)
   */
  submit(equipmentFormDeposit) {
    /* retrieve equipments FormArray from equipmentForm: true (if checked) */
    const selectedEquipmentObjectsArray = equipmentFormDeposit.equipmentsFormArray 
       .map((value, i) => value ? this.equipmentList[i] : null) /* new array : rapprochement between the checked boxes (at true) and the values of the data array*/                                                    
       .filter(value => value !== null); /*new array with all non null elements */


    /* http call is made only if at least one box is checked */
    if (selectedEquipmentObjectsArray.length > 0) {

      this.dataService.updateEquipmentToDb(this.offerIdOnUse,  selectedEquipmentObjectsArray)
      .subscribe({
        next : offer => { console.log('next: post equipment') },
        error:err => {
                      this.message = "Erreur : equipement non enregistré";},
        complete : () => {
                          this.message = "Le dépôt d'annonce est terminé, merci !";
                          this.isDepositComplete = true;} 
      });
    } else {
      this.message = "Le dépôt d'annonce est terminé, merci !";
      this.isDepositComplete = true; 
    }
  }

  /**
   * return info if template has to display the equipment type. typically, when its value changes
   * @param equipmentListType type of the equipment displayed
   */
  hasToDisplay(equipmentListType){
    if (equipmentListType != this.equipmentListTypeSaved){
      this.equipmentListTypeSaved = equipmentListType;
      return true;
    }
  }

  /**
   * navigate towards home at the end of the deposit process
   */
  onClickNavigate(){
    this.router.navigate(['']);
  }
}

