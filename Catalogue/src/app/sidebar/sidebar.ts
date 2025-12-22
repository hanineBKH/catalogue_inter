import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
 import { AuthService } from '../service/auth-service';
 import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
    imports: [CommonModule,RouterModule   ],  // ← ajouter ici aussi
  standalone: true,             // ← IMPORTANT !!!
 
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() toggleSidebar = new EventEmitter<boolean>();
  // const isAdmin = Number(localStorage.getItem('role')) === 2;

  sidebarOpen = true;
 
  constructor( private AuthService: AuthService,private router: Router ) {}
  toggle() {
    this.sidebarOpen = !this.sidebarOpen;
    this.toggleSidebar.emit(this.sidebarOpen); // envoie TRUE ou FALSE
  }
    logout() {
    // Clear your auth tokens
    this.AuthService.logout();

    // Optional: SweetAlert confirmation
    Swal.fire({
      icon: 'success',
      title: 'Déconnecté',
      text: 'Vous avez été déconnecté avec succès',
      timer: 1500,
      showConfirmButton: false
    });

    // Redirect to login page
    this.router.navigate(['/catalogue']);
  }
isAdmin(): boolean {
  return this.AuthService.hasRole(2);
}
isFormateur(): boolean {
  return this.AuthService.hasRole(1);
}
}
