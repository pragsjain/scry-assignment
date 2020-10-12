import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable,throwError, of } from 'rxjs';
import { map ,catchError} from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  //private url =  'https://chatapi.edwisor.com';
  private url =  environment.SOCKET_ENDPOINT
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {} 
  getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  } 
  setUserInfoInLocalStorage = (data) =>{
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  getTokenFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('authtoken'));
  } 
  setTokenInLocalStorage = (data) =>{
    localStorage.setItem('token', JSON.stringify(data));
  }

  fullNameSource = new BehaviorSubject<string>('');
  fullName = this.fullNameSource.asObservable()


  signupFunction(formdata): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users/signup`, formdata);
  } 

  signinFunction(formdata): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users/login`, formdata);
  } 

  logout(userId): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users/${userId}/delete`,userId);
  } 

  requestReset(body): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users/req-reset-password`, body);
  }

  newPassword(body): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users/new-password`, body);
  }

  ValidPasswordToken(body): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users/valid-password-token`, body);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/all`)
    .pipe(map((response:any) =>{
        return response;
    }),catchError(<T>(error: any, result?: T) => {
      console.log(error);
      return this.handleError(error)
    }))
  } 

  //  getAllStocks(): Observable<any> {
  //   return this.http.get(`${this.url}/api/v1/stocks/all`)
  //   .pipe(map((response:any) =>{
  //       return response;
  //   }),catchError(<T>(error: any, result?: T) => {
  //     console.log(error);
  //     return this.handleError(error)
  //   }))
  // } 
  insertCSVStocks(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/stocks/insert`);
  } 

  getAllStocks(page,numberOfStockPerPage): Observable<any> {
    return this.http.get(`${this.url}/api/v1/stocks/all?page=${page}&numberOfStockPerPage=${numberOfStockPerPage}`)
    .pipe(map((response:any) =>{
        return response;
    }),catchError(<T>(error: any, result?: T) => {
      console.log(error);
      return this.handleError(error)
    }))
  }

   getStockById(id): Observable<any> {
    return this.http.get(`${this.url}/api/v1/stocks/view/${id}`);
  } 
    
  createStock(formdata): Observable<any> {
    return this.http.post(`${this.url}/api/v1/stocks/create`, formdata);
  } 
    
  editStock(data): Observable<any> {
    return this.http.put(`${this.url}/api/v1/stocks/${data['id']}/edit`, data);
  } 

  deleteStock(id): Observable<any> {
    return this.http.post(`${this.url}/api/v1/stocks/${id}/delete`,id);
  } 

  




  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.error.text}`;

    } // end condition *if

    this.toastr.error(err.error.text);
    return throwError(errorMessage);

  }  // END handleError

}
