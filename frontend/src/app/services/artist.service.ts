import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ArtistInfo } from '../models/artist-info.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/artist-info`;

  getArtistInfo(): Observable<ArtistInfo> {
    return this.http.get<ArtistInfo>(this.apiUrl);
  }

  updateArtistInfo(formData: FormData): Observable<ArtistInfo> {
    return this.http.put<ArtistInfo>(this.apiUrl, formData);
  }
}
