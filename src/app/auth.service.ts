import { Injectable } from '@angular/core';
import { ApiDataService } from './api-data.service';
import { Router, ActivatedRoute } from '@angular/router';





@Injectable()
export class AuthService {
   data;
    currentUserSubject
    constructor(
      private _dataService: ApiDataService,
      private route: ActivatedRoute,
      private router: Router,
      
      
      )
       {
       
      }
  public get currentUserValue() {
      try{
           this.currentUserSubject =JSON.parse(localStorage.getItem('currentUser'));
      }catch(err){
          
      }
   
      return this.currentUserSubject;
  }

    

   async login(logindata) {
      this.data=await this._dataService.add(logindata,"auth").toPromise()
          
      if(this.data==false){
            alert("napačno geslo ali uporabniško ime")

            }else{
            
            localStorage.setItem('currentUser', JSON.stringify(this.data));
            this.router.navigate(["dodaj"]);
            

            }
         
         
}

               
          
    

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.router.navigate(['login']); 
        
    }
}