import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Equipment } from './equipment';
import { Brand } from './brand';
import { Model } from './model';

import { Offer } from './offer';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

/**
 * getting list of offers in database, without any selection criteria
 */
  getOfferList() {
    return this.httpClient.get('http://localhost:8080/api/offers');
  }

 
    /**
   * getting data from a specific offer
   * @param offerId id of the offer we want data from
   */
  getOfferDetail(offerId) {
    return this.httpClient.get('http://localhost:8080/api/offers/' + offerId );
  }


/**
 * getting filtered list of offers
 * @param brand filter on brand
 * @param lowest filter on lowest price
 * @param highest filter on highest price
 */
  getFilteredOfferList(brand, lowest, highest) {
    let params = new HttpParams();
    params = params.append('brand', brand);
    params = params.append('lowestPrice', lowest);
    params = params.append('highestPrice', highest);

    const options = { params: params };

    return this.httpClient.get('http://localhost:8080/api/offers/filter', options)
  }

  /**
   * post request to save a client's new offer deposit
   * @param sellerId Id of the client who deposit a new offer
   * @param offerDeposit form values containing offer data
   */
  addOfferToSeller(sellerId, offerDeposit) {
    return this.httpClient.post<Offer>('http://localhost:8080/api/sellers/' + sellerId + '/offer', offerDeposit);
  }


  /**
   * post request to save an image associated to an existing offer
   * @param offerIdOnUse offer associated to which the image will be posted
   * @param selectedFile image file to be posted
   */
  addImageToDb(offerIdOnUse,selectedFile) {

    const uploadData = new FormData;
    uploadData.append('imageFile',selectedFile, selectedFile.name);

    return this.httpClient.post('http://localhost:8080/api/offers/' + offerIdOnUse + '/images', uploadData);
  }


  /**
   * get request to retrieve an image, giving its name
   * @param imageName name of the image to retrieve
   */
  getImageFromDb(imageName){
    return this.httpClient.get('http://localhost:8080/api/images/name/' + imageName);
  }


/**
 * list of brands a client can choose from
 */
  brands : Brand[] = [
    {"name": "BMW" },
    {"name": "Renault"}]

    models : Model[] = [
      {"name": "Série 2"},
      {"name": "clio"}]

  /*list of equipments a client can choose from */
  equipments : Equipment[] = [
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
  ]

}


