import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.isLoggedIn.pipe(
    map((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        router.navigate(['auth/login']);
        return false;
      }
      return true;
    })
  )
}

