import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'
import { Router, ActivatedRoute } from '@angular/router';

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
  if (currentUser) {
      // logged in so return true
     
      return true;
  }
  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
}
}
