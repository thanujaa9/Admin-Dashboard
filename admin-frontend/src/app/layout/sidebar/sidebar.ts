import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  user: any;

  constructor(private auth: AuthService, public router: Router) {
    this.user = this.auth.getUser();
  }

  get menuItems() {
    const items: any[] = [
      { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
      { label: 'Analytics', icon: 'bar_chart', route: '/dashboard/analytics' },
    ];

    if (this.auth.isAdmin()) {
      items.push({ label: 'Users', icon: 'people', route: '/dashboard/users' });
    }

    return items;
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  logout() {
    this.auth.logout();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}