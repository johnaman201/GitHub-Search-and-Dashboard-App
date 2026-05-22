import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SortOption, OrderOption } from '@core/models/search-params.model';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
    ],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
    
    readonly sort = input<SortOption>('stars');
    readonly order = input<OrderOption>('desc');

    readonly debouncedQueryChange = output<string>();
    readonly sortUpdated = output<SortOption>();
    readonly orderUpdated = output<OrderOption>();

    readonly localQuery = signal('');

    private readonly destroyRef = inject(DestroyRef);

    readonly sortOptions: { value: SortOption; label: string }[] = [
        { value: 'stars', label: 'Stars' },
        { value: 'forks', label: 'Forks' },
        { value: 'updated', label: 'Last Updated' },
    ]

    readonly orderOptions: { value: OrderOption; label: string }[] = [
        { value: 'desc', label: 'Descending' },
        { value: 'asc', label: 'Ascending' },
    ]

    constructor() {
        toObservable(this.localQuery)
        .pipe(
            skip(1),
            debounceTime(400),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(value => this.debouncedQueryChange.emit(value))
    }

    onQueryChange(value: string): void {
        this.localQuery.set(value);
    }

    onSortChange(value: SortOption): void {
        this.sortUpdated.emit(value);
    }

    onOrderChange(value: OrderOption): void {
        this.orderUpdated.emit(value);
    }

    onClear(): void {
        this.localQuery.set('');
        this.debouncedQueryChange.emit('');
    }
}