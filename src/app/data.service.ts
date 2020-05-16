import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Equipment } from './equipment';
import { Brand } from './brand';
import { Model } from './model';

import { Offer } from './offer';
import { Sale } from './sale';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'http://localhost:8080/api' ;

  constructor(private httpClient: HttpClient) { }


  /**
   * GET request to retrieve a non filtered Offer Page
   * @param pageNumberParam   the number of the page to display
   * @param pageSizeParam     number of offers per page
   * @param sortParam         sort criteria
   * @param directionParam    sort direction
   */
 getOfferPage(pageNumberParam, pageSizeParam, sortParam, directionParam) {
 
  let params = new HttpParams();
  params = params.append('pageNumber', pageNumberParam);
  params = params.append('pageSize', pageSizeParam);
  params = params.append('sort', sortParam);
  params = params.append('direction', directionParam);

  const options = { params: params };

  /*return this.httpClient.get('http://localhost:8080/api/offers', options); */
  return this.httpClient.get(this.apiUrl + '/offers', options);
}

 
    /**
   * getting data from a specific offer
   * @param offerId id of the offer we want data from
   */

  getOfferDetail(offerId) {
    //return this.httpClient.get('http://localhost:8080/api/offers/' + offerId );
    return this.httpClient.get(this.apiUrl + '/offers/' + offerId );
  }

  getUserDetail(userId) {
    //return this.httpClient.get('http://localhost:8080/api/users/' + userId );
    return this.httpClient.get(this.apiUrl + '/users/' + userId );
  }


/**
 * GET request to retrieve a filtered Offer Page
 * @param lowestBrandFilter     Brand min value 
 * @param highestBrandFilter    Brand max value 
 * @param lowestModelFilter     Model min value 
 * @param highestModelFilter    Model max value 
 * @param lowestPostCodeFilter  PostCode min value 
 * @param highestPostCodeFilter PostCode max value
 * @param lowestYearFilter      Vehicle Year min value
 * @param highestYearFilter     Vehicle Year max value 
 * @param gearboxFilter         gearbox value
 * @param lowestPriceFilter     Vehicle price min value
 * @param highestPriceFilter    Vehicle price max value
 * @param pageNumberParam       number of the Page to retrieve 
 * @param pageSizeParam         number of Offers per page
 * @param sortParam             sort criteria
 * @param directionParam        direction of sorting
 */
 getFilteredOfferPage(lowestBrandFilter,
  highestBrandFilter,
  lowestModelFilter,
  highestModelFilter,
  lowestPostCodeFilter,
  highestPostCodeFilter,
  lowestYearFilter,
  highestYearFilter,
  gearboxFilter,
  lowestPriceFilter,
  highestPriceFilter,
  pageNumberParam,
  pageSizeParam,
  sortParam, 
  directionParam
  ) {
  let params = new HttpParams();
  params = params.append('lowestBrand', lowestBrandFilter);
  params = params.append('highestBrand', highestBrandFilter);
  params = params.append('lowestModel', lowestModelFilter);
  params = params.append('highestModel', highestModelFilter);
  params = params.append('lowestPostCode', lowestPostCodeFilter);
  params = params.append('highestPostCode', highestPostCodeFilter);
  params = params.append('lowestYear', lowestYearFilter);
  params = params.append('highestYear', highestYearFilter);
  params = params.append('gearbox', gearboxFilter);
  params = params.append('lowestPrice', lowestPriceFilter);
  params = params.append('highestPrice', highestPriceFilter);

  params = params.append('pageNumber', pageNumberParam);
  params = params.append('pageSize', pageSizeParam);
  params = params.append('sort', sortParam);
  params = params.append('direction', directionParam);

  const options = { params: params };

  //return this.httpClient.get('http://localhost:8080/api/offers/filter', options)
  return this.httpClient.get(this.apiUrl + '/offers/filter', options)
 }

  /**
   * post request to save a client's new offer deposit
   * @param clientId Id of the client who deposit a new offer
   * @param offerDeposit form values containing offer data
   */
  /*
  addOfferToClient(clientId, offerDeposit) {
    return this.httpClient.post<Offer>('http://localhost:8080/api/clients/' + clientId + '/offer', offerDeposit);
  } */

  addOfferToUser(userId, offerDeposit) {
    //return this.httpClient.post<Offer>('http://localhost:8080/api/users/' + userId + '/offer', offerDeposit);
    return this.httpClient.post<Offer>(this.apiUrl + '/users/' + userId + '/offer', offerDeposit);
  }

  addSaleToUser(userId, saleConcluded, offerId) {
    let params = new HttpParams();
    params = params.append('offerId', offerId);
    const options = { params: params };

    //return this.httpClient.post<Sale>('http://localhost:8080/api/users/' + userId + '/sale', saleConcluded, options);
    return this.httpClient.post<Sale>(this.apiUrl + '/users/' + userId + '/sale', saleConcluded, options);
  }


  updateOffer(offerIdOnUse, offerToSendToBack) {
    //return this.httpClient.put<Offer>('http://localhost:8080/api/offers/' + offerIdOnUse, offerToSendToBack);
    return this.httpClient.put<Offer>(this.apiUrl + '/offers/' + offerIdOnUse, offerToSendToBack);
  }


  /**
   * post request to save an image associated to an existing offer
   * @param offerIdOnUse offer associated to which the image will be posted
   * @param selectedFile image file to be posted
   */
  addImageToDb(offerIdOnUse,selectedFile) {

    const uploadData = new FormData;
    uploadData.append('imageFile',selectedFile, selectedFile.name);

    //return this.httpClient.post('http://localhost:8080/api/offers/' + offerIdOnUse + '/images', uploadData);
    return this.httpClient.post(this.apiUrl + '/offers/' + offerIdOnUse + '/images', uploadData);
  }

  /*
  addEquipmentToDb(offerIdOnUse, equipmentList) {
    return this.httpClient.post(this.apiUrl + '/offers/' + offerIdOnUse + '/equipments', equipmentList);
  } */

  updateEquipmentToDb(offerIdOnUse, equipmentList) {

    //return this.httpClient.put('http://localhost:8080/api/offers/' + offerIdOnUse + '/equipments', equipmentList);
    return this.httpClient.put(this.apiUrl + '/offers/' + offerIdOnUse + '/equipments', equipmentList);
  }


  /**
   * get request to retrieve an image, giving its name
   * @param imageName name of the image to retrieve
   */
  //getImageFromDb(imageName){
  //  return this.httpClient.get(this.apiUrl + '/images/name/' + imageName);
  //}


  deleteOffer(offerIdToDelete) {
    //return this.httpClient.delete('http://localhost:8080/api/offers/' + offerIdToDelete );
    return this.httpClient.delete(this.apiUrl + '/offers/' + offerIdToDelete );
  }

  deleteImage(imageIdToDelete) {
    //return this.httpClient.delete('http://localhost:8080/api/images/' + imageIdToDelete );
    return this.httpClient.delete(this.apiUrl + '/images/' + imageIdToDelete );
  }

/**
 * list of brands a client can choose from
 */
  brands : Brand[] = [
    {"name": "BMW" },
    {"name": "Renault"},
    {"name": "Ferrari"}
  ]

    models : Model[] = [
      {"name": "Série 2"},
      {"name": "Clio"},
      {"name": "Testarossa"},
    ]

  /*list of equipments a client can choose from */
  /* ! do not change the first label of each type*/
  /* ! labels of the same type must be grouped*/
  equipments : Equipment[] = 
  [
    { "type": "interior", "label": "Sièges cuir"},
    { "type": "interior", "label": "Volant Alcantara" },
    { "type": "exterior", "label": "Jantes Alu 17"   },
    { "type": "exterior", "label": "Peinture métallisée" },
    { "type": "comfort", "label": "Suspensions adaptables"},
    { "type": "comfort", "label": "Sièges chauffants" },
    { "type": "comfort", "label": "rétros dorés" },
    { "type": "comfort", "label": "rétros argentés" },
    { "type": "comfort", "label": "rétros platine" },
  ]
  /*[
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
  ] */

  /**
 * list of years for a vehicle
 */
years  = [
  {"yearValue": "2020" },
  {"yearValue": "2019"},
  {"yearValue": "2018"},
  {"yearValue": "2017"},
  {"yearValue": "2016"},
  {"yearValue": "2015"},
  {"yearValue": "2014"},
  {"yearValue": "2013"},
  {"yearValue": "2012"},
  {"yearValue": "2011"},
  {"yearValue": "2010"},
  {"yearValue": "2009"},
  {"yearValue": "2008"},
  {"yearValue": "2007"},
  {"yearValue": "2006"},
  {"yearValue": "2005"},
  {"yearValue": "2004"},
  {"yearValue": "2003"},
  {"yearValue": "2002"},
  {"yearValue": "2001"},
  {"yearValue": "2000"},
  {"yearValue": "1999"},
  {"yearValue": "1998"},
  {"yearValue": "1997"},
  {"yearValue": "1996"},
  {"yearValue": "1995"},
  {"yearValue": "1994"},
  {"yearValue": "1993"},
  {"yearValue": "1992"},
  {"yearValue": "1991"},
  {"yearValue": "1990"},
]

}


