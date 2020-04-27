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

  /*equipmentList  =this.dataService.equipments; */

  offerIdOnUse;

  message:String;

  isDepositComplete : Boolean;

  equipmentForm: FormGroup;
  equipmentList = this.dataService.equipments;
  /*   [
    { "type": "interior", "label": "Sièges cuir"},
    { "type": "interior", "label": "Volant Alcantara" },
    { "type": "exterior", "label": "Jantes Alu 17"   },
    { "type": "exterior", "label": "Peinture métallisée" },
    { "type": "Comfort", "label": "Suspensions adaptables"},
    { "type": "Comfort", "label": "Sièges chauffants" }
  ]; */

  /*
  isFirst : Boolean;
  text:String; */

  constructor(private formBuilder: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router) {

      this.equipmentForm = this.formBuilder.group({
        equipments: new FormArray([])
      });

    this.addCheckboxes();

     }

  ngOnInit() {

    /*this.isFirst = true;*/
    this.isDepositComplete = false;

    this.route.paramMap
    .subscribe(params => {
      this.offerIdOnUse = params.get('offerId');
    })
  }


  private addCheckboxes() {
    this.equipmentList.forEach((equipmentItem, equipmentIndex) => {
      console.log(equipmentItem);
      const control = new FormControl();
      /*const control = new FormControl(equipmentIndex === 0); */ // if first item set to true, else false
      /*console.log(control); */
      (this.equipmentForm.controls.equipments as FormArray).push(control); 
    });
  }

  submit(equipmentDeposit) {

    console.log(this.equipmentForm.value.equipments);
    const selectedEquipmentLabels = equipmentDeposit.equipments /* retrieve equipments FormArray from equipmentForm: true (if checked) or null */
      .map((value, i) => value ? this.equipmentList[i] : null) /* nouveau tableau : rapprochement entre les checked (qui sont à true) et les valeurs du tableau de données*/                                                    
      .filter(value => value !== null); /*new array with all non null elements */
    console.log(selectedEquipmentLabels);

    this.dataService.addEquipmentToDb(this.offerIdOnUse,  selectedEquipmentLabels)
    .subscribe({
      next : img => { console.log('next: post equipment') },
      error:err => {console.error(err);
                    this.message = "Erreur : equipement non enregistré";},
      complete : () => {console.log('complete: post equipment');
                        this.message = "Le dépôt d'annonce est terminé, merci !";
                        this.isDepositComplete = true;} 
    });

  }

  onClickNavigate(){

    this.router.navigate(['']);

  }

  /*
  shouldBeDisplay(textToDisplay) {
    console.log(textToDisplay);
    
    if ((textToDisplay == 'interior') && this.isFirst){
      this.text = 'Intérieur';
      this.isFirst = false;
      return true;
    } else {
      return false;
    }
  } */


}

/*  onDeposit(depositEquipmentForm){
    console.log(depositEquipmentForm);
    console.log(depositEquipmentForm.value);
  } */

  /*getOrders() {
    return 
      [
        {
          "type": "interior",
          "label": "Sièges cuir"
        },
        {
          "type": "interior",
          "label": "Volant Alcantara"
        },
        {
          "type": "exterior",
          "label": "Jantes Alu 17"
        },
        {
          "type": "exterior",
          "label": "Peinture métallisée"
        },
        {
          "type": "Comfort",
          "label": "Suspensions adaptables"
        },
        {
          "type": "Comfort",
          "label": "Sièges chauffants"
        }
      ];
  } */
