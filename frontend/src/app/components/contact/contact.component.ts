import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactInfoService } from '../../services/contact-info.service';
import { ContactInfo, SocialMedia } from '../../models/contact-info.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  private contactInfoService = inject(ContactInfoService);

  contactForm = signal({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  submitted = signal(false);
  loading = signal(false);

  contactInfo = signal<ContactInfo>({
    email: 'contact@artiste.com',
    phone: '+33 6 12 34 56 78',
    address: 'Paris, France',
    social: {
      instagram: '@artiste',
      artstation: 'luzartwork',
    }
  });

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo(): void {
    this.contactInfoService.getContactInfo().subscribe({
      next: (data: ContactInfo) => {
        this.contactInfo.set(data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des infos de contact:', error);
        // Garder les valeurs par défaut en cas d'erreur
      }
    });
  }

  onSubmit(): void {
    this.loading.set(true);
    
    // Simulation d'envoi (à remplacer par un vrai service backend)
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
      this.resetForm();
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => {
        this.submitted.set(false);
      }, 5000);
    }, 1500);
  }

  resetForm(): void {
    this.contactForm.set({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  }
}
