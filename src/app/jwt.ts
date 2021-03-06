import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';






@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.auth.currentUserValue;
    
       
      
        if (currentUser) {
             
            request = request.clone({
                setHeaders: { 
                    authorization: currentUser.token
                }
            });
        }
    

        return next.handle(request);
    }
}