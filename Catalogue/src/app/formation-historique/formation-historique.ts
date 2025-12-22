import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../service/formation-service';
import Swal from 'sweetalert2';

interface Formation {
  id_formation: number;
  intitule: string;
  axe: string;
  niveau: string;
  population?: string;
  interne_externe?: string;
  etat: 'en_attente' | 'validee' | 'refusee';
  description?: string;
  duree?: string;
  prerequis?: string;
  objectifs?: string[];
  competences?: string[];
}

@Component({
  selector: 'app-formation-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formation-historique.html',
  styleUrls: ['./formation-historique.css']
})
export class FormationHistorique implements OnInit {

  formations: Formation[] = [];
  selectedFormation: Formation | null = null;
 private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  detailModalOpen = false;
  updateModalOpen = false;
  deleteModalOpen = false;

  selectedEtat: 'en_attente' | 'validee' | 'refusee' = 'en_attente';
  loading = false;

  constructor(private formationsService: FormationService) {}

  ngOnInit(): void {
    
    this.loadFormations();

  }

loadFormations(): void {
  this.loading = true;
  const token = localStorage.getItem('token');

  if (!token) {
    Swal.fire(
      'Non authentifié',
      'Vous devez être connecté pour voir les formations.',
      'warning'
    );
    this.loading = false;
    return;
  }

  this.formationsService.getFormationsByFormateur(this.selectedEtat)
    .subscribe({
      next: (data) => {
        this.formations = data;
        this.loading = false;
        this.cdr.detectChanges(); // ensure view updates if needed
      },
      error: (err) => {
        console.error('Erreur récupération formations:', err);
        this.loading = false;
        Swal.fire('Erreur', 'Impossible de charger les formations.', 'error');
      }
    });
}


  changeEtat(etat: 'en_attente' | 'validee' | 'refusee'): void {
    this.selectedEtat = etat;
    this.loadFormations();
  }

  trackFormation(index: number, formation: Formation): number {
    return formation.id_formation;
  }

  // Detail Modal
  openDetailModal(formation: Formation): void {
    this.selectedFormation = { ...formation };
    this.detailModalOpen = true;
  }

  closeDetailModal(): void {
    this.detailModalOpen = false;
    this.selectedFormation = null;
  }

  // Update Modal
  openUpdateModal(): void {
    this.updateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.updateModalOpen = false;
  }

  confirmUpdate(): void {
    if (!this.selectedFormation) return;

    Swal.fire({
      title: 'Confirmer la modification',
      text: 'Êtes-vous sûr de vouloir modifier cette formation ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed && this.selectedFormation) {
        const token = localStorage.getItem('token') || '';
        this.formationsService.updateFormation(this.selectedFormation.id_formation, this.selectedFormation, token)
          .subscribe({
            next: () => {
              Swal.fire('Modifiée !', 'La formation a été modifiée.', 'success');
              this.closeUpdateModal();
              this.closeDetailModal();
              this.loadFormations();
            },
            error: (err) => {
              console.error('Erreur modification formation:', err);
              Swal.fire('Erreur', 'Impossible de modifier la formation.', 'error');
            }
          });
      }
    });
  }

  // Delete Modal
  openDeleteModal(): void {
    this.deleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.deleteModalOpen = false;
  }

  confirmDelete(): void {
    if (!this.selectedFormation) return;

    const token = localStorage.getItem('token') || '';
    this.formationsService.deleteFormation(this.selectedFormation.id_formation, token)
      .subscribe({
        next: () => {
          Swal.fire('Supprimée !', 'La formation a été supprimée.', 'success');
          this.closeDeleteModal();
          this.closeDetailModal();
          this.loadFormations();
        },
        error: (err) => {
          console.error('Erreur suppression formation:', err);
          Swal.fire('Erreur', 'Impossible de supprimer la formation.', 'error');
        }
      });
  }
}
