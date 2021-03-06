import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';


import { RouterModule } from '@angular/router';

import { authInterceptorProviders } from './_helpers/auth.interceptor';

import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

import { DataService } from './data.service';
import { OfferListComponent } from './offer-list/offer-list.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CarDescriptionComponent } from './car-description/car-description.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { OfferDepositComponent } from './offer-deposit/offer-deposit.component';
import { OfferDepositImageComponent } from './offer-deposit-image/offer-deposit-image.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { OfferDepositEquipmentComponent } from './offer-deposit-equipment/offer-deposit-equipment.component';
import { OfferUpdateComponent } from './offer-update/offer-update.component';
import { SaleComponent } from './sale/sale.component';
import { LoanCalculatorComponent } from './loan-calculator/loan-calculator.component';




@NgModule({
  declarations: [
    AppComponent,
    OfferListComponent,
    TopBarComponent,
    CarDescriptionComponent,
    OfferDetailComponent,
    OfferDepositComponent,
    OfferDepositImageComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    OfferDepositEquipmentComponent,
    OfferUpdateComponent,
    SaleComponent,
    LoanCalculatorComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: OfferListComponent }, 
      { path: 'deposit', component: OfferDepositComponent },
      { path: 'offerDetail/:offerId', component: OfferDetailComponent },
      { path: 'sale/:offerId', component: SaleComponent },
      { path: 'loanCalculator/:offerId', component: LoanCalculatorComponent },
      { path: 'offerDepositImage/:offerId', component: OfferDepositImageComponent },
      { path: 'offerDepositEquipment/:offerId', component: OfferDepositEquipmentComponent },
      { path: 'update/:offerId', component: OfferUpdateComponent },
      { path: 'home', component: OfferListComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'user', component: BoardUserComponent },
      { path: 'mod', component: BoardModeratorComponent },
      { path: 'admin', component: BoardAdminComponent }
    ]),
  ],
  providers: [DataService,
    {provide: LOCALE_ID,
    useValue: 'fr-FR'},
    authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
