import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { GithubRepo, GithubSearchResponse, SearchParams  } from "@core/models";

@Injectable({ providedIn: 'root' })
export class GithubApiService {
    
    private readonly http = inject(HttpClient);
    private readonly baseUrl =environment.githubApiUrl;

    searchRepos(params: SearchParams): Observable<GithubSearchResponse> {
        const httpParams = new HttpParams()
        .set('q', params.query)
        .set('sort', params.sort)
        .set('order', params.order)
        .set('page', params.page.toString())
        .set('per_page', params.per_page.toString());

        return this.http.get<GithubSearchResponse>(`${this.baseUrl}/search/repositories`, {
            params: httpParams
        });
    }

    getRepoDetail(owner: string, repo: string): Observable<GithubRepo> {
        return this.http.get<GithubRepo>(`${this.baseUrl}/repos/${owner}/${repo}`);
    }
}