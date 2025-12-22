export interface FormationForm {
  intitule: string;
  type: string;
  population: string;
  niveau: string;
  prerequis: string;
  duree: string;
  axe: string;
  parcours: string;
  interne_externe: 'interne' | 'externe';
  id_formateur?: number;
  prestataire?: string;
  objectifs: string[];
  competences: string[];
}
