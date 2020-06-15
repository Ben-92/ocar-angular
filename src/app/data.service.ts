import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";


import { Offer } from './offer';
import { Sale } from './sale';

import {InterceptorSkipHeader} from './_helpers/auth.interceptor';

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


  return this.httpClient.get(this.apiUrl + '/offers', options);
}

 
    /**
   * getting data from a specific offer
   * @param offerId id of the offer we want data from
   */

  getOfferDetail(offerId) {

    return this.httpClient.get(this.apiUrl + '/offers/' + offerId );
  }

  getUserDetail(userId) {

    return this.httpClient.get(this.apiUrl + '/users/' + userId );
  }

  getEquipmentList() {

    return this.httpClient.get(this.apiUrl + '/equipments');
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
  /*gearboxFilter,*/
  lowestGearboxFilter,
  highestGearboxFilter,
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
  /*params = params.append('gearbox', gearboxFilter);*/
  params = params.append('lowestGearbox', lowestGearboxFilter);
  params = params.append('highestGearbox', highestGearboxFilter);
  params = params.append('lowestPrice', lowestPriceFilter);
  params = params.append('highestPrice', highestPriceFilter);

  params = params.append('pageNumber', pageNumberParam);
  params = params.append('pageSize', pageSizeParam);
  params = params.append('sort', sortParam);
  params = params.append('direction', directionParam);

  const options = { params: params };


  return this.httpClient.get(this.apiUrl + '/offers/filter', options)
 }



  /**
   * post request to save a user's new offer deposit
   * @param userId id of the user connected who deposits an offer
   * @param offerDeposit offer object to deposit
   */
  addOfferToUser(userId, offerDeposit) {

    return this.httpClient.post<Offer>(this.apiUrl + '/users/' + userId + '/offer', offerDeposit);
  }

  addSaleToUser(userId, saleConcluded, offerId) {
    let params = new HttpParams();
    params = params.append('offerId', offerId);
    const options = { params: params };


    return this.httpClient.post<Sale>(this.apiUrl + '/users/' + userId + '/sale', saleConcluded, options);
  }


  updateOffer(offerIdOnUse, offerToSendToBack) {

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


    return this.httpClient.post(this.apiUrl + '/offers/' + offerIdOnUse + '/images', uploadData);
  }


  updateEquipmentToDb(offerIdOnUse, equipmentList) {

    return this.httpClient.put(this.apiUrl + '/offers/' + offerIdOnUse + '/equipments', equipmentList);
  }

  retrieveBrands(){
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');


    return this.httpClient.get('https://parallelum.com.br/fipe/api/v1/carros/marcas', {headers});
  }

  retrieveModels(brandCodigo){

    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    let urlToRetrieveModels = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/' + brandCodigo + '/modelos'
   
    return this.httpClient.get(urlToRetrieveModels, {headers});
  }



  deleteOffer(offerIdToDelete) {

    return this.httpClient.delete(this.apiUrl + '/offers/' + offerIdToDelete );
  }

  deleteImage(imageIdToDelete) {

    return this.httpClient.delete(this.apiUrl + '/images/' + imageIdToDelete );
  }


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


