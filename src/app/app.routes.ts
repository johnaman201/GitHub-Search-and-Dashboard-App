import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
    },
    {
        path: 'search',
        loadComponent: () =>
            import('./features/search/containers/search-page/search-page.component')
                .then(m => m.SearchPageComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/dashboard/containers/dashboard-page/dashboard-page.component')
                .then(m => m.DashboardPageComponent)
    },
    {
        path: '**',
        redirectTo: 'search'
    }
];