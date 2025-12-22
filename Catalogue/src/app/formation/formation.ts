import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './formation.html',
  styleUrls: ['./formation.css']
})
export class formation implements OnInit, OnDestroy {

  formations: any[] = [];
  formateurs: any[] = [];
  objectifs: any[] = [];
  competences: any[] = [];

  modalOpen = false;
  editModalOpen = false;

  dureeNumber: number | null = null;
  dureeUnit: 'jours' | 'heures' = 'jours';

  objectifsInput: string[] = [''];
  competencesInput: string[] = [''];

  editObjectifsInput: string[] = [];
  editCompetencesInput: string[] = [];
  editDureeNumber: number | null = null;
  editDureeUnit: 'jours' | 'heures' = 'jours';

  newFormation = this.emptyFormation();
  editFormation: any = null;

  refreshSub!: Subscription;

  constructor(private http: HttpClient,  private cdr: ChangeDetectorRef) {}

  /* ===================== LIFECYCLE ===================== */

  ngOnInit() {
    this.loadAll();

    this.refreshSub = interval(5000).subscribe(() => {
      this.loadFormations();
    });
  }

  ngOnDestroy() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  /* ===================== LOADERS ===================== */

  loadAll() {
    this.loadFormations();
    this.loadFormateurs();
    this.loadObjectifs();
    this.loadCompetences();
  }

  loadFormations() {
    this.http
      .get<any[]>('http://localhost:3000/api/formations')
      .subscribe(data => this.formations = data);
  }

  loadFormateurs() {
    this.http
      .get<any[]>('http://localhost:3000/api/formateurs')
      .subscribe(data => this.formateurs = data);
  }

  loadObjectifs() {
    this.http
      .get<any[]>('http://localhost:3000/api/objectifs')
      .subscribe(data => this.objectifs = data);
  }

  loadCompetences() {
    this.http
      .get<any[]>('http://localhost:3000/api/competences')
      .subscribe(data => this.competences = data);
  }

  /* ===================== CREATE ===================== */
 async saveFormation() {
  try {
    const objectifIds = await this.resolveIds(
      this.objectifsInput,
      this.objectifs,
      'objectif',
      'id_objectif'
    );

    const competenceIds = await this.resolveIds(
      this.competencesInput,
      this.competences,
      'competence',
      'id_competence'
    );

    const payload = {
      ...this.newFormation,
      duree: this.dureeNumber
        ? `${this.dureeNumber} ${this.dureeUnit}`
        : null,
      objectifs: objectifIds,
      competences: competenceIds
    };

    this.http.post('http://localhost:3000/api/formation', payload)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Formation ajoutée',
            text: 'La formation a été créée avec succès.',
            timer: 1800,
            showConfirmButton: false
          });

          this.loadFormations();
          this.closeModal(); // ← modal closes here
          this.cdr.detectChanges(); // ← force Angular refresh
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la création de la formation.',
            confirmButtonColor: '#d33'
          });
          console.error(err);
        }
      });

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur interne',
      text: 'Impossible de traiter les objectifs ou les compétences.'
    });
    console.error(error);
  }
}

  /* ===================== UPDATE ===================== */

async updateFormation() {
  if (!this.editFormation) return;

  try {
    const objectifIds = await this.resolveIds(
      this.editObjectifsInput,
      this.objectifs,
      'objectif',
      'id_objectif'
    );

    const competenceIds = await this.resolveIds(
      this.editCompetencesInput,
      this.competences,
      'competence',
      'id_competence'
    );

    const payload = {
      ...this.editFormation,
      duree: this.editDureeNumber
        ? `${this.editDureeNumber} ${this.editDureeUnit}`
        : null,
      objectifs: objectifIds,
      competences: competenceIds
    };

    this.http.put(
      `http://localhost:3000/api/formations/${this.editFormation.id_formation}`,
      payload
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Formation mise à jour',
          text: 'Les modifications ont été enregistrées avec succès.',
          timer: 1800,
          showConfirmButton: false
        });

        this.loadFormations();
        this.closeEditModal(); // ← edit modal closes here
        this.cdr.detectChanges(); // ← force Angular refresh
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de mettre à jour la formation. Veuillez réessayer.',
          confirmButtonColor: '#d33'
        });
        console.error(err);
      }
    });

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur interne',
      text: 'Problème lors de la résolution des objectifs ou compétences.'
    });
    console.error(error);
  }
}

  /* ===================== DELETE ===================== */

delete(i: number) {
  const formation = this.formations[i];

  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: `Voulez-vous vraiment supprimer la formation "${formation.intitule}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      const id = formation.id_formation;
      this.http
        .delete(`http://localhost:3000/api/formations/${id}`)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé !',
              text: 'La formation a été supprimée avec succès.',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadFormations();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer la formation.',
              confirmButtonColor: '#d33'
            });
            console.error(err);
          }
        });
    }
  });
}

  /* ===================== MODALS ===================== */

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.newFormation = this.emptyFormation();
    this.objectifsInput = [''];
    this.competencesInput = [''];
    this.dureeNumber = null;
    this.cdr.detectChanges(); // ← added
  }

  openEditModal(f: any) {
    this.editFormation = structuredClone(f);
    this.editObjectifsInput = [...(f.objectifs || [])];
    this.editCompetencesInput = [...(f.competences || [])];
    this.editModalOpen = true;
  }

  closeEditModal() {
    this.editModalOpen = false;
    this.editFormation = null;
    this.editObjectifsInput = [];
    this.editCompetencesInput = [];
    this.editDureeNumber = null;
    this.cdr.detectChanges(); // ← added
  }
  /* ===================== MODALS ===================== */

 
  /* ===================== HELPERS ===================== */

  addObjectifInput() { this.objectifsInput.push(''); }
  addCompetenceInput() { this.competencesInput.push(''); }
  addEditObjectifInput() { this.editObjectifsInput.push(''); }
  addEditCompetenceInput() { this.editCompetencesInput.push(''); }

  async resolveIds(
    inputs: string[],
    cache: any[],
    endpoint: string,
    idKey: string
  ): Promise<number[]> {

    const ids: number[] = [];

    for (const text of inputs) {
      if (!text || !text.trim()) continue;

      const existing = cache.find(
        e => e.libelle.toLowerCase() === text.toLowerCase()
      );

      if (existing) {
        ids.push(existing[idKey]);
      } else {
        const res: any = await firstValueFrom(
          this.http.post(`http://localhost:3000/api/${endpoint}`, { libelle: text })
        );
        ids.push(res[idKey]);
        cache.push(res);
      }
    }

    return ids;
  }

  emptyFormation() {
    return {
      axe: '',
      axe_code:'',
      type: 'Formation',
      intitule: '',
      population: '',
      niveau: 'débutant',
      prerequis: '',
      id_formateur: null,
      interne_externe: 'interne',
      prestataire: '',
      parcours: '',
      duree: '',
      objectifs: [],
      competences: []
    };
  }
}
