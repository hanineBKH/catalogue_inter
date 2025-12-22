import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class FormateurGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.hasRole(1)) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
