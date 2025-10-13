import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artwork } from '../models/artwork.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/artworks`;

  getArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(this.apiUrl);
  }

  getArtwork(id: string): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.apiUrl}/${id}`);
  }

  createArtwork(formData: FormData): Observable<Artwork> {
    return this.http.post<Artwork>(this.apiUrl, formData);
  }

  updateArtwork(id: string, formData: FormData): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.apiUrl}/${id}`, formData);
  }

  deleteArtwork(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
