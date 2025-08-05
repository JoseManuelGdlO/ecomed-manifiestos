import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap, Subject, takeUntil } from 'rxjs';
import { EcomedAuthService } from '../auth/ecomed-auth.service';
import { defaultNavigation, compactNavigation, futuristicNavigation, horizontalNavigation } from '../../mock-api/common/navigation/data';

@Injectable({providedIn: 'root'})
export class NavigationService implements OnDestroy
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: EcomedAuthService
    )
    {
        // Listen to user changes and update navigation accordingly
        this._authService.getUserChanges()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.refreshNavigation();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data based on user role
     */
    get(): Observable<Navigation>
    {
        // Get user role and filter navigation accordingly
        const user = this._authService.getCurrentUser();
        const userRole = user?.rol?.nombre;
        
        let filteredDefaultNavigation = defaultNavigation;
        let filteredCompactNavigation = compactNavigation;
        let filteredFuturisticNavigation = futuristicNavigation;
        let filteredHorizontalNavigation = horizontalNavigation;

        // Filter navigation based on role
        if (userRole === 'capturista') {
            filteredDefaultNavigation = this.filterNavigationForCapturista(defaultNavigation);
            filteredCompactNavigation = this.filterNavigationForCapturista(compactNavigation);
            filteredFuturisticNavigation = this.filterNavigationForCapturista(futuristicNavigation);
            filteredHorizontalNavigation = this.filterNavigationForCapturista(horizontalNavigation);
        }
        // Admin can see everything, so no filtering needed

        const navigation: Navigation = {
            compact: filteredCompactNavigation,
            default: filteredDefaultNavigation,
            futuristic: filteredFuturisticNavigation,
            horizontal: filteredHorizontalNavigation
        };

        this._navigation.next(navigation);
        return new Observable(observer => {
            observer.next(navigation);
            observer.complete();
        });
    }

    /**
     * Filter navigation for capturista role
     */
    private filterNavigationForCapturista(navigation: any[]): any[] {
        return navigation.filter(item => {
            // Capturista can only see: clientes, manifiestos, reportes
            const allowedSections = ['clientes', 'manifiestos', 'reportes'];
            
            if (item.children) {
                // For group items, filter children
                const filteredChildren = item.children.filter((child: any) => {
                    const sectionId = child.id.split('.')[0];
                    return allowedSections.includes(sectionId);
                });
                
                // Only include group if it has allowed children
                if (filteredChildren.length > 0) {
                    item.children = filteredChildren;
                    return true;
                }
                return false;
            } else {
                // For basic items, check if the section is allowed
                const sectionId = item.id.split('.')[0];
                return allowedSections.includes(sectionId);
            }
        });
    }

    /**
     * Refresh navigation when user role changes
     */
    refreshNavigation(): void {
        this.get().subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
