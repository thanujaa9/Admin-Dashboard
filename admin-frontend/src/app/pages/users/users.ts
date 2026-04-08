import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  searchQuery = '';
  currentUserId = '';

  private static cachedUsers: any[] | null = null;

  showForm = false;
  isEditing = false;
  editingId = '';
  form = { name: '', email: '', password: '', role: 'user' };

  displayedColumns = ['avatar', 'name', 'email', 'role', 'createdAt', 'actions'];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private snackbar: MatSnackBar
  ) {
    this.currentUserId = this.auth.getUser()?.id;
  }

  ngOnInit() {
    if (Users.cachedUsers) {
      this.users = Users.cachedUsers;
      this.filteredUsers = Users.cachedUsers;
      this.isLoading = false;
      return;
    }
    this.loadUsers();
  }

  loadUsers(invalidateCache = false) {
    if (invalidateCache) {
      Users.cachedUsers = null;
    }

    this.isLoading = true;
    this.api.getUsers().subscribe({
      next: (res: any) => {
        Users.cachedUsers = res;
        this.users = res;
        this.filteredUsers = res;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  search() {
    const q = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }

  openAddForm() {
    this.isEditing = false;
    this.editingId = '';
    this.form = { name: '', email: '', password: '', role: 'user' };
    this.showForm = true;
  }

  openEditForm(user: any) {
    this.isEditing = true;
    this.editingId = user._id;
    this.form = { name: user.name, email: user.email, password: '', role: user.role };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  submitForm() {
    if (!this.form.name || !this.form.email) {
      this.snackbar.open('Name and email are required', 'Close', { duration: 3000 });
      return;
    }

    if (this.isEditing) {
      this.api.updateUser(this.editingId, {
        name: this.form.name,
        role: this.form.role
      }).subscribe({
        next: () => {
          this.snackbar.open('User updated successfully', 'Close', { duration: 3000 });
          this.closeForm();
          this.loadUsers(true);
        },
        error: () => {
          this.snackbar.open('Failed to update user', 'Close', { duration: 3000 });
        }
      });
    } else {
      if (!this.form.password) {
        this.snackbar.open('Password is required', 'Close', { duration: 3000 });
        return;
      }
      this.api.createUser(this.form).subscribe({
        next: () => {
          this.snackbar.open('User created successfully', 'Close', { duration: 3000 });
          this.closeForm();
          this.loadUsers(true);
        },
        error: (err) => {
          this.snackbar.open(err.error?.message || 'Failed to create user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteUser(id: string) {
    if (id === this.currentUserId) {
      this.snackbar.open('You cannot delete your own account', 'Close', { duration: 3000 });
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.api.deleteUser(id).subscribe({
      next: () => {
        this.snackbar.open('User deleted', 'Close', { duration: 3000 });
        this.loadUsers(true);
      },
      error: () => {
        this.snackbar.open('Failed to delete user', 'Close', { duration: 3000 });
      }
    });
  }

  getInitial(name: string): string {
    return name?.charAt(0).toUpperCase() || '?';
  }
}