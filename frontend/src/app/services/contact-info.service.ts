import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContactInfo } from '../models/contact-info.model';

@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contact-info`;

  getContactInfo(): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(this.apiUrl);
  }

  updateContactInfo(contactInfo: ContactInfo): Observable<ContactInfo> {
    return this.http.put<ContactInfo>(this.apiUrl, contactInfo);
  }
}
