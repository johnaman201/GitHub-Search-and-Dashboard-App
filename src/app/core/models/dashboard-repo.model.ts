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

export const METRIC_LABELS: Record<MetricKey, string> = {
    stars: 'Stars',
    forks: 'Forks',
    open_issues: 'Open Issues',
    watchers: 'Watchers'
}
