import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../model/formation.model';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  private apiUrl = 'http://localhost:3000/api';  // Your backend API base URL
formateurs: any[] = [];
  constructor(private http: HttpClient) { }

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`);
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/formation/${id}`);
  }
    addFormation(formation: Formation): Observable<any> {
    return this.http.post(`${this.apiUrl}/FormationAttent`, formation);
  }
loadFormateurs(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/api/formateurs');
}

getFormationsByFormateur(etat: 'en_attente' | 'validee' | 'refusee'): Observable<any[]> {
  const params = new HttpParams().set('etat', etat);
  
  const token = localStorage.getItem('token'); // must match how you stored it
  if (!token) {
    throw new Error('Utilisateur non authentifié');
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const url = `${this.apiUrl}/formations/formateur`;

  return this.http.get<any[]>(url, { params, headers });
}

  updateFormation(id_formation: number, formationData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`http://localhost:3000/api/formations/${id_formation}`, formationData, { headers });
  }

  // DELETE a formation
  deleteFormation(id_formation: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`http://localhost:3000/api/formations/${id_formation}`, { headers });
  }
}
