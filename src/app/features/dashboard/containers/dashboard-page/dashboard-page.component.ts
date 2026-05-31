import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardRepo, MetricKey } from '@core/models';
import { GithubApiService, RepoStorageService } from '@core/services';
import { MetricBarChartComponent } from '@features/dashboard/components/metric-bar-chart/metric-bar-chart.component';
import { RepoToggleControlsComponent } from '@features/dashboard/components/repo-toggle-controls/repo-toggle-controls.component';
import { catchError, forkJoin, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { mapToDashboardRepo } from '@core/utils';

@Component({
  selector: 'app-dashboard-page',
  imports: [MetricBarChartComponent, RepoToggleControlsComponent, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  private readonly githubApi = inject(GithubApiService);
  private readonly repoStorage = inject(RepoStorageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly repoDetails = signal<DashboardRepo[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  readonly visibleRepoIds = signal<Set<number>>(new Set());
  readonly visibleMetrics = signal<MetricKey[]>([
    'stars', 'forks', 'open_issues', 'watchers'
  ]);

  readonly filteredRepos = computed(() =>
    this.repoDetails().filter(r => this.visibleRepoIds().has(r.id))
  );

  readonly savedRepos = this.repoStorage.repos;

  ngOnInit(): void {
    const stored = this.repoStorage.repos();
    this.repoDetails.set(stored);
    this.visibleRepoIds.set(new Set(stored.map(r => r.id)));
    this.loadRepoDetails();
  }

  refresh(): void {
    this.loadRepoDetails();
  }

  onRepoVisibilityChanged(event: { id: number; visible: boolean }): void {
    this.visibleRepoIds.update(current => {
      const next = new Set(current);
      event.visible ? next.add(event.id) : next.delete(event.id);
      return next;
    });
  }

  onMetricVisibilityChanged(event: { metric: MetricKey; visible: boolean }): void {
    this.visibleMetrics.update(current => {
      if (event.visible) {
        const order: MetricKey[] = ['stars', 'forks', 'open_issues', 'watchers'];
        return order.filter(m => m === event.metric || current.includes(m));
      }
      return current.filter(m => m !== event.metric);
    });
  }

  private loadRepoDetails(): void {
    const stored = this.repoStorage.repos();

    if (stored.length === 0) return;

    this.isLoading.set(true);
    this.hasError.set(false);

    const requests = stored.map(repo => {
      const [owner, name] = repo.full_name.split('/');
      return this.githubApi.getRepoDetail(owner, name).pipe(
        catchError(() => of(null))
      );
    });

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(results => {
        const details = results.map((result, index) => 
          result ? mapToDashboardRepo(result) : stored[index]
        );
        this.repoDetails.set(details);
        this.visibleRepoIds.set(new Set(details.map(r => r.id)));
        this.isLoading.set(false);
      });
  }
}