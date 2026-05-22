import { Component, input, computed } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts/core';
import { DashboardRepo, MetricKey } from '@core/models';
import { formatCount } from '@core/utils';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const METRIC_LABELS: Record<MetricKey, string> = {
  stars: 'Stars',
  forks: 'Forks',
  open_issues: 'Open Issues',
  watchers: 'Watchers'
};

const REPO_COLORS = ['#3b82f6', '#84cc16', '#334155'];

@Component({
  selector: 'app-metric-bar-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './metric-bar-chart.component.html',
  styleUrl: './metric-bar-chart.component.scss'
})
export class MetricBarChartComponent {
  readonly repos = input<DashboardRepo[]>([]);
  readonly visibleMetrics = input<MetricKey[]>(['stars', 'forks', 'open_issues', 'watchers']);

  readonly chartOptions = computed<EChartsCoreOption>(() => {
    const repos = this.repos();
    const metrics = this.visibleMetrics();

    return {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (params: { seriesName: string; name: string; value: number }) => {
          return `<b>${params.seriesName}</b><br/>${params.name}: ${formatCount(params.value)}`;
        }
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        pageButtonPosition: 'end'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '20%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.map(m => METRIC_LABELS[m]),
        axisLabel: {
          rotate: 0,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatCount(value)
        }
      },
      series: repos.map((repo, index) => ({
        name: repo.name,
        type: 'bar' as const,
        data: metrics.map(m => repo[m]),
        itemStyle: {
          color: REPO_COLORS[index % REPO_COLORS.length],
          borderRadius: [4, 4, 0, 0]
        }
      })),
      media: [
        {
          query: { maxWidth: 500 },
          option: {
            legend: {
              type: 'scroll',
              orient: 'horizontal',
              bottom: 0,
              itemWidth: 10,
              itemHeight: 10,
              textStyle: { fontSize: 10 }
            },
            grid: {
              bottom: '30%'
            },
            xAxis: {
              axisLabel: { fontSize: 10, rotate: 15 }
            }
          }
        }
      ]
    };
  });
}