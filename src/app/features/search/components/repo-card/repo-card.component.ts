import { Component, computed, input, output } from "@angular/core";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GithubRepo } from "../../../../core/models/github-repo.model";

@Component({
    selector: 'app-repo-card',
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './repo-card.component.html',
    styleUrl: './repo-card.component.scss'
})

export class RepoCardComponent {

    readonly repo = input.required<GithubRepo>();
    readonly isAdded = input<boolean>(false);
    readonly add = output<GithubRepo>();

    readonly stars = computed(() => 
        this.formatCount(this.repo().stargazers_count)
    );

    readonly forks = computed(() =>
        this.formatCount(this.repo().forks_count)
    );

    onAdd(): void {
        this.add.emit(this.repo());
    }

    private formatCount(count: number): string {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }

        return count.toString();
    }




    

}