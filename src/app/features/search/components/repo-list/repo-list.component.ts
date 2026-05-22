import { Component, input, output } from '@angular/core';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';
import { RepoCardComponent } from '../repo-card/repo-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GithubRepo } from '@core/models';

@Component({
  selector: 'app-repo-list',
  imports: [RepoCardComponent, InfiniteScrollDirective, MatProgressSpinnerModule ],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss'
})
export class RepoListComponent {

    readonly repos = input<GithubRepo[]>([]);
    readonly addedIds = input<Set<number>>(new Set());
    readonly hasMore = input<boolean>(false);
    readonly isLoading = input<boolean>(false);

    readonly addRepo = output<GithubRepo>();
    readonly loadMore = output<void>();

    isAdded(id: number): boolean {
      return this.addedIds().has(id);
    }

    trackByRepo(_: number, repo: GithubRepo): number {
      return repo.id;
    }
}
