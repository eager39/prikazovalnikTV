import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const currentUser = localStorage.getItem("currentUser")
  const decodedToken = helper.decodeToken(currentUser);
const expirationDate = helper.getTokenExpirationDate(currentUser);
const isExpired = helper.isTokenExpired(currentUser);
  if (currentUser && !isExpired) {
      // logged in so return true
     
      return true;
  }
  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
}
}
