import { Component, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { DashboardRepo, MetricKey, METRIC_LABELS  } from '@core/models';

@Component({
  selector: 'app-repo-toggle-controls',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule],
  templateUrl: './repo-toggle-controls.component.html',
  styleUrl: './repo-toggle-controls.component.scss'
})
export class RepoToggleControlsComponent {
  readonly repos = input<DashboardRepo[]>([]);
  readonly visibleRepoIds = input<Set<number>>(new Set());
  readonly visibleMetrics = input<MetricKey[]>([]);

  readonly repoVisibilityChanged = output<{ id: number; visible: boolean }>();
  readonly metricVisibilityChanged = output<{ metric: MetricKey; visible: boolean }>();

  readonly allMetrics = (Object.keys(METRIC_LABELS) as MetricKey[]).map(key =>({
    value: key,
    label: METRIC_LABELS[key]
  }))

  isRepoVisible(id: number): boolean {
    return this.visibleRepoIds().has(id);
  }

  isMetricVisible(metric: MetricKey): boolean {
    return this.visibleMetrics().includes(metric);
  }

  onRepoToggle(id: number, visible: boolean): void {
    this.repoVisibilityChanged.emit({ id, visible });
  }

  onMetricToggle(metric: MetricKey, visible: boolean): void {
    this.metricVisibilityChanged.emit({ metric, visible });
  }
}