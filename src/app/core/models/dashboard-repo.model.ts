export type MetricKey = 'stars' | 'forks' | 'open_issues' | 'watchers';

export interface DashboardRepo {
    id: number;
    name: string;
    full_name: string;
    url: string;
    stars: number;
    forks: number;
    open_issues: number;
    watchers: number;
}
