import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Needed for *ngIf, *ngFor
import { AuthService } from '../service/auth-service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gest-user',
  standalone: true,
  imports: [
    FormsModule,   // ✅ for ngModel
    CommonModule   // ✅ for ngIf and ngFor
  ],
  templateUrl: './gest-user.html',
  styleUrl: './gest-user.css',
})
export class GestUser implements OnInit {
  users: any[] = [];
  roles: any[] = [];

  modalOpen = false;
  newUser = { nom: '', prenom: '', email: '', password: '', id_role: null };

  editModalOpen = false;
  editUser: any = null;

  constructor( private AuthService: AuthService,
  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

loadUsers() {
  this.AuthService.getUsers().subscribe({
    next: (data) => {
      this.users = data;
      this.cdr.detectChanges(); // 🔥 THIS is the fix
    },
    error: (err) => console.error(err)
  });
}


  loadRoles() {
    this.AuthService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; }

  openEditModal(user: any) {
    this.editModalOpen = true;
    this.editUser = { ...user, password: '' };
  }
  closeEditModal() { this.editModalOpen = false; this.editUser = null; }

saveUser() {
  this.AuthService.addUser(this.newUser).subscribe({
    next: () => {
      this.loadUsers();
      this.closeModal();

      // SweetAlert succès
      Swal.fire({
        icon: 'success',
        title: 'Utilisateur ajouté',
        text: 'Le nouvel utilisateur a été ajouté avec succès !',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {
      // SweetAlert erreur
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d\'ajouter l\'utilisateur. Veuillez réessayer.',
      });
      console.error('Erreur ajout utilisateur:', err);
    }
  });
}

updateUser() {
  this.AuthService.updateUser(this.editUser.id_user, this.editUser)
    .subscribe({
      next: () => {
        this.loadUsers();
        this.closeEditModal();

        // SweetAlert succès
        Swal.fire({
          icon: 'success',
          title: 'Utilisateur modifié',
          text: 'Les informations de l\'utilisateur ont été mises à jour avec succès !',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de mettre à jour l\'utilisateur. Veuillez réessayer.',
        });
        console.error('Erreur update utilisateur:', err);
      }
    });
}

delete(index: number) {
  const user = this.users[index];

  // Confirmation avant suppression
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: `Vous êtes sur le point de supprimer l'utilisateur ${user.nom}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.AuthService.deleteUser(user.id_user).subscribe({
        next: () => {
          this.loadUsers();
          Swal.fire({
            icon: 'success',
            title: 'Supprimé',
            text: 'L\'utilisateur a été supprimé avec succès !',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de supprimer l\'utilisateur. Veuillez réessayer.',
          });
          console.error('Erreur suppression utilisateur:', err);
        }
      });
    }
  });
}
}
