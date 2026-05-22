import { computed, effect, Injectable, Signal, signal } from "@angular/core";
import { DashboardRepo } from "@core/models";

const STORAGE_KEY = 'github_dashboard_repos';

@Injectable({ providedIn: 'root' })
export class RepoStorageService {
    
    private readonly _repos = signal<DashboardRepo[]>(this.loadFromStorage());
    public readonly repos: Signal<DashboardRepo[]> = this._repos.asReadonly();

    constructor() {
        effect(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._repos()));
        })
    }

    isAdded(id: number): Signal<boolean> {
        return computed(() => this._repos().some(r => r.id === id));
    }

    add(repo: DashboardRepo): void {
        if (this._repos().some(r => r.id === repo.id)) {
            return
        }
        this._repos.set([...this._repos(), repo]);
    }

    remove(id: number): void {
        this._repos.set(this._repos().filter(r => r.id !== id));
    }

    private loadFromStorage(): DashboardRepo[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as DashboardRepo[]) : [];
        } catch {
            return [];
        }
    }

}