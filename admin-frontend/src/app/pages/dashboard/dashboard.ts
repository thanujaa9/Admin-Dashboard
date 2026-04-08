import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  isLoading = true;
  summary: any = {};
  today = new Date();

  private static cachedData: any = null;

  salesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Sales',
      data: [],
      borderColor: '#1A237E',
      backgroundColor: 'rgba(26, 35, 126, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#1A237E',
      pointRadius: 5,
    }]
  };

  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  signupsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Signups',
      data: [],
      backgroundColor: 'rgba(0, 188, 212, 0.8)',
      borderRadius: 6,
    }]
  };

  signupsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  pieChartData: ChartData<'pie'> = {
    labels: ['Admins', 'Regular Users'],
    datasets: [{
      data: [],
      backgroundColor: ['#1A237E', '#00BCD4'],
      borderWidth: 0,
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    if (Dashboard.cachedData) {
      this.applyData(Dashboard.cachedData);
      this.isLoading = false;
      return;
    }

    this.api.getDashboardStats().subscribe({
      next: (res: any) => {
        Dashboard.cachedData = res;
        this.applyData(res);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyData(res: any) {
    this.summary = res.summary;

    this.salesChartData = {
      ...this.salesChartData,
      labels: res.charts.sales?.labels || [],
      datasets: [{
        ...this.salesChartData.datasets[0],
        data: res.charts.sales?.values || []
      }]
    };

    this.signupsChartData = {
      ...this.signupsChartData,
      labels: res.charts.signups?.labels || [],
      datasets: [{
        ...this.signupsChartData.datasets[0],
        data: res.charts.signups?.values || []
      }]
    };

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: [res.summary.adminCount, res.summary.regularUsers]
      }]
    };
  }
}