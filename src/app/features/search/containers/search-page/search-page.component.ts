import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiError, DashboardRepo, GithubRepo, OrderOption, SearchParams, SortOption } from '@core/models';
import { GithubApiService, RepoStorageService } from '@core/services';
import { RepoListComponent } from '@features/search/components/repo-list/repo-list.component';
import { SearchBarComponent } from '@features/search/components/search-bar/search-bar.component';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-page',
  imports: [SearchBarComponent, RepoListComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {

  private readonly githubApi = inject(GithubApiService);
  private readonly repoStorage = inject(RepoStorageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchQuery = signal('');
  readonly sortBy = signal<SortOption>('stars');
  readonly order = signal<OrderOption>('desc');
  readonly repos = signal<GithubRepo[]>([]);
  readonly isLoading = signal(false);
  readonly hasMore = signal(false);
  readonly currentPage = signal(1);

  readonly addedIds = computed(() =>
    new Set(this.repoStorage.repos().map(r => r.id))
  );

  private readonly searchTrigger$ = new Subject<SearchParams>();

  constructor() {
    this.searchTrigger$
      .pipe(
        switchMap(params => {
          this.isLoading.set(true);
          return this.githubApi.searchRepos(params).pipe(
            catchError((err: ApiError) => {
              this.isLoading.set(false);
              return EMPTY;
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        const incoming = response.items;
        this.repos.update(existing =>
          this.currentPage() === 1 ? incoming : [...existing, ...incoming]
        );
        this.hasMore.set(incoming.length === 30);
        this.isLoading.set(false);
      });
  }

  onDebouncedQueryChange(query: string): void {
    this.searchQuery.set(query);
    if (!query.trim()) {
      this.repos.set([]);
      this.hasMore.set(false);
      return;
    }
    this.currentPage.set(1);
    this.triggerSearch();
  }

  onSortChange(sort: SortOption): void {
    this.sortBy.set(sort);
    if (this.searchQuery().trim()) {
      this.currentPage.set(1);
      this.triggerSearch();
    }
  }

  onOrderChange(order: OrderOption): void {
    this.order.set(order);
    if (this.searchQuery().trim()) {
      this.currentPage.set(1);
      this.triggerSearch();
    }
  }

  onLoadMore(): void {
    if (this.isLoading() || !this.hasMore()) return;
    this.currentPage.update(p => p + 1);
    this.triggerSearch();
  }

  onAddRepo(repo: GithubRepo): void {
    const dashboardRepo: DashboardRepo = {
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      open_issues: repo.open_issues_count,
      watchers: repo.watchers_count
    };
    this.repoStorage.add(dashboardRepo);
  }

  private triggerSearch(): void {
    this.searchTrigger$.next({
      query: this.searchQuery(),
      sort: this.sortBy(),
      order: this.order(),
      page: this.currentPage(),
      per_page: 30
    });
  }
}
