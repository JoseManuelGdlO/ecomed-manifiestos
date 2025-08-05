import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EcomedAuthService } from '../ecomed-auth.service';

export const RoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router: Router = inject(Router);
    const authService: EcomedAuthService = inject(EcomedAuthService);

    const user = authService.getCurrentUser();
    const userRole = user?.rol?.nombre;

    // Check if user has any of the allowed roles
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // If user doesn't have permission, redirect to clientes (default page)
    console.warn(`Access denied: User role '${userRole}' not allowed for route '${state.url}'`);
    return router.parseUrl('/clientes');
  };
}; 