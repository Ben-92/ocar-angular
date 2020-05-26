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
  equipmentList = this.dataService.equipments;

  constructor(private formBuilder: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) {

      this.equipmentForm = this.formBuilder.group({
        equipments: new FormArray([])
      });

    this.addCheckboxes();

     }


  /**
  * retrieve offer id
  */
  ngOnInit() {

    this.isDepositComplete = false;

    this.route.paramMap
    .subscribe(params => {
      this.offerIdOnUse = params.get('offerId');
    })
  }


  /**
   * each equipment correspond to one formcontrol, each formcontrol is an element of the formarray
   */
  private addCheckboxes() {
    this.equipmentList.forEach((equipmentItem, equipmentIndex) => {
      console.log(equipmentItem);
      const control = new FormControl();
      (this.equipmentForm.controls.equipments as FormArray).push(control); 
    });
  }

  /**
   * PUT equipment list and updating it to the offer in database
   * @param equipmentDeposit formarray of user choices (check or not check for each equipment item)
   */
  submit(equipmentDeposit) {
    /* retrieve equipments FormArray from equipmentForm: true (if checked) or null */
    const selectedEquipmentLabels = equipmentDeposit.equipments 
       .map((value, i) => value ? this.equipmentList[i] : null) /* new array : rapprochement between the checked boxes (at true) and the values of the data array*/                                                    
       .filter(value => value !== null); /*new array with all non null elements */


    /* http call is made only if at least one box is checked */
    if (selectedEquipmentLabels.length > 0) {

      /*this.dataService.addEquipmentToDb(this.offerIdOnUse,  selectedEquipmentLabels)*/
      this.dataService.updateEquipmentToDb(this.offerIdOnUse,  selectedEquipmentLabels)
      .subscribe({
        next : img => { console.log('next: post equipment') },
        error:err => {console.error(err);
                      this.message = "Erreur : equipement non enregistré";},
        complete : () => {console.log('complete: post equipment');
                          this.message = "Le dépôt d'annonce est terminé, merci !";
                          this.isDepositComplete = true;} 
      });
    } else {
      this.message = "Le dépôt d'annonce est terminé, merci !";
      this.isDepositComplete = true; 
    }
  }

  /**
   * navigate towards home at the end of the deposit process
   */
  onClickNavigate(){
    this.router.navigate(['']);
  }
}

