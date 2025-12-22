export interface Formation {
  id_formation: number;
  intitule: string;
  type: string;
  population: string;
  niveau: string;
  prerequis: string;
  duree: string;
  id_formateur: number;
  formateur: string;
  axe: string;                   // <-- add this
  interne_externe: 'interne' | 'externe'; // <-- add this
  objectifs: string[];
  competences: string[];
  parcours:string;
  axe_code:string;
  prestataire:string;
}
