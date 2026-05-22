import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { ApiError } from "@core/models";
import { inject } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);
    
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const apiError: ApiError = {
                status: error.status,
                message: resolveErrorMessage(error)
            };

            snackBar.open(apiError.message, 'Dismiss', {
                duration: 500,
                panelClass: ['error-snackbar'],
                horizontalPosition: 'end',
                verticalPosition: 'bottom'
            });
            
            return throwError(() => apiError);
        })
    );
};

function resolveErrorMessage(error: HttpErrorResponse): string {
    switch(error.status) {
        case 403:
            return 'GitHub API rate limit exceed. Please wait a moment and try again.';
        case 404:
            return 'Repository not found.';
        case 422:
            return 'Invalid search query. Please refine your search.';
        case 0:
            return 'Network error. Please check your connection.';
        default:
            return 'An unexpected error occured. Please try again.';
    }
}