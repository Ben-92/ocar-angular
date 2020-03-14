import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
/*
import { AdListComponent } from './ad-list/ad-list.component';
*/

import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

import { DataService } from './data.service';
import { OfferListComponent } from './offer-list/offer-list.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CarDescriptionComponent } from './car-description/car-description.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { OfferDepositComponent } from './offer-deposit/offer-deposit.component';
import { OfferDepositImageComponent } from './offer-deposit-image/offer-deposit-image.component';

@NgModule({
  declarations: [
    AppComponent,
    /*AdListComponent,*/
    OfferListComponent,
    TopBarComponent,
    CarDescriptionComponent,
    OfferDetailComponent,
    OfferDepositComponent,
    OfferDepositImageComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: OfferListComponent },
      { path: 'deposit', component: OfferDepositComponent },
      /*{ path: 'car/:carId', component: CarDescriptionComponent },*/
      { path: 'offerDetail/:offerId', component: OfferDetailComponent },
      { path: 'deposit/offerDepositImage/:offerId', component: OfferDepositImageComponent },
    ]),
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
