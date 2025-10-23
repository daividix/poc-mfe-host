import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserSessionService } from '@poc-mfe/shared';

export const authGuard: CanActivateFn = (route, state) => {
  const _userSession = inject(UserSessionService);
  const router = inject(Router);

  if (_userSession.user()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};