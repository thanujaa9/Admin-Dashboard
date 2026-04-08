import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    BaseChartDirective
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class Analytics implements OnInit {
  isLoading = true;
  summary: any = {};

  private static cachedData: any = null;

  salesTrendData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Sales (₹)',
      data: [],
      borderColor: '#1A237E',
      backgroundColor: 'rgba(26,35,126,0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#1A237E',
      pointRadius: 5,
    }]
  };

  salesTrendOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  signupsTrendData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Signups',
      data: [],
      backgroundColor: 'rgba(0,188,212,0.8)',
      borderRadius: 6,
    }]
  };

  signupsTrendOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  activeUsersData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Active Users',
      data: [],
      borderColor: '#43A047',
      backgroundColor: 'rgba(67,160,71,0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#43A047',
      pointRadius: 5,
    }]
  };

  activeUsersOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  ratioChartData: ChartData<'doughnut'> = {
    labels: ['Total Sales (₹)', 'Total Signups'],
    datasets: [{
      data: [],
      backgroundColor: ['#1A237E', '#00BCD4'],
      borderWidth: 0,
    }]
  };

  ratioChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    if (Analytics.cachedData) {
      this.applyData(Analytics.cachedData);
      this.isLoading = false;
      return;
    }

    this.api.getDashboardStats().subscribe({
      next: (res: any) => {
        Analytics.cachedData = res;
        this.applyData(res);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadData() {
    this.isLoading = true;
    this.api.getDashboardStats().subscribe({
      next: (res: any) => {
        Analytics.cachedData = res;
        this.applyData(res);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyData(res: any) {
    this.summary = res.summary;
    const charts = res.charts;

    this.salesTrendData = {
      ...this.salesTrendData,
      labels: charts.sales?.labels || [],
      datasets: [{
        ...this.salesTrendData.datasets[0],
        data: charts.sales?.values || []
      }]
    };

    this.signupsTrendData = {
      ...this.signupsTrendData,
      labels: charts.signups?.labels || [],
      datasets: [{
        ...this.signupsTrendData.datasets[0],
        data: charts.signups?.values || []
      }]
    };

    this.activeUsersData = {
      ...this.activeUsersData,
      labels: charts.activeUsers?.labels || [],
      datasets: [{
        ...this.activeUsersData.datasets[0],
        data: charts.activeUsers?.values || []
      }]
    };

    this.ratioChartData = {
      ...this.ratioChartData,
      datasets: [{
        ...this.ratioChartData.datasets[0],
        data: [res.summary.totalSales, res.summary.totalSignups]
      }]
    };
  }
}