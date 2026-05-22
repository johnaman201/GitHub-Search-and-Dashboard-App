export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    open_issues_count: number;
    watchers_count: number;
    owner: {
        login: string;
        avatar_url: string;
    }
}

export interface GithubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GithubRepo[];
}