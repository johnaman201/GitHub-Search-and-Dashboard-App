import { DashboardRepo, GithubRepo } from '@core/models';

export function mapToDashboardRepo(repo: GithubRepo): DashboardRepo {
    return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        open_issues: repo.open_issues_count,
        watchers: repo.watchers_count
    }
}