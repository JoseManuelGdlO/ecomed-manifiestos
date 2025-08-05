import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { EcomedAuthService } from 'app/core/auth/ecomed-auth.service';
import { of, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
{
    const router: Router = inject(Router);

    // Check the authentication status
    return inject(EcomedAuthService).isAuthenticated().pipe(
        switchMap((authenticated) =>
        {
            // If the user is authenticated...
            if ( authenticated )
            {
                return of(router.parseUrl(''));
            }

            // Allow the access
            return of(true);
        }),
    );
};
