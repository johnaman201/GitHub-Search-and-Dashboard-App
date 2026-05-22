export type SortOption = 'stars' | 'forks' | 'updated';
export type OrderOption = 'asc' | 'desc';

export interface SearchParams {
    query: string;
    sort: SortOption;
    order: OrderOption;
    page: number;
    per_page: number;
}