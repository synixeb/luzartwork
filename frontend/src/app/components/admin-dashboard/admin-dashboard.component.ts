import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ArtworkService } from '../../services/artwork.service';
import { ArtistService } from '../../services/artist.service';
import { ContactInfoService } from '../../services/contact-info.service';
import { Artwork } from '../../models/artwork.model';
import { ArtistInfo, ParcoursItem } from '../../models/artist-info.model';
import { ContactInfo } from '../../models/contact-info.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private artworkService = inject(ArtworkService);
  private artistService = inject(ArtistService);
  private contactInfoService = inject(ContactInfoService);
  private router = inject(Router);

  // Onglets
  activeTab = signal<'artworks' | 'artist' | 'contact' | 'account'>('artworks');

  artworks = signal<Artwork[]>([]);
  loading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  editMode = signal<boolean>(false);
  selectedFile = signal<File | null>(null);
  
  currentArtwork = signal<Partial<Artwork>>({
    title: '',
    description: '',
    imageUrl: '',
    category: 'autre',
    year: new Date().getFullYear(),
    dimensions: '',
    technique: '',
    price: undefined,
    isAvailable: true,
    order: 0
  });

  // Infos artiste
  artistInfo = signal<ArtistInfo>({
    name: '',
    bio: '',
    imageUrl: '',
    parcours: []
  });
  artistImageFile = signal<File | null>(null);

  // Infos contact
  contactInfo = signal<ContactInfo>({
    email: '',
    phone: '',
    address: '',
    social: {
      instagram: '',
      artstation: '',
      linkedin: ''
    }
  });

  // Infos compte
  accountForm = signal({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });

  accountError = signal<string>('');
  accountSuccess = signal<string>('');

  categories = ['peinture', 'sculpture', 'dessin', 'photographie', 'digital', 'autre'];

  ngOnInit(): void {
    this.loadArtworks();
    this.loadArtistInfo();
    this.loadContactInfo();
  }

  setActiveTab(tab: 'artworks' | 'artist' | 'contact' | 'account'): void {
    this.activeTab.set(tab);
    // Réinitialiser les messages lors du changement d'onglet
    if (tab !== 'account') {
      this.accountError.set('');
      this.accountSuccess.set('');
    }
  }

  // ===== ARTWORKS =====
  loadArtworks(): void {
    this.loading.set(true);
    this.artworkService.getArtworks().subscribe({
      next: (data) => {
        this.artworks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  openForm(artwork?: Artwork): void {
    if (artwork) {
      this.editMode.set(true);
      this.currentArtwork.set({ ...artwork });
    } else {
      this.editMode.set(false);
      this.resetForm();
    }
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.currentArtwork.set({
      title: '',
      description: '',
      imageUrl: '',
      category: 'autre',
      year: new Date().getFullYear(),
      dimensions: '',
      technique: '',
      price: undefined,
      isAvailable: true,
      order: 0
    });
    this.selectedFile.set(null);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile.set(target.files[0]);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    const artwork = this.currentArtwork();

    formData.append('title', artwork.title || '');
    if (artwork.description) formData.append('description', artwork.description);
    if (artwork.category) formData.append('category', artwork.category);
    if (artwork.year) formData.append('year', artwork.year.toString());
    if (artwork.dimensions) formData.append('dimensions', artwork.dimensions);
    if (artwork.technique) formData.append('technique', artwork.technique);
    formData.append('isAvailable', (artwork.isAvailable !== undefined ? artwork.isAvailable : true).toString());

    if (this.selectedFile()) {
      formData.append('image', this.selectedFile()!);
    } else if (artwork.imageUrl) {
      formData.append('imageUrl', artwork.imageUrl);
    }

    this.loading.set(true);

    const request = this.editMode() && artwork._id
      ? this.artworkService.updateArtwork(artwork._id, formData)
      : this.artworkService.createArtwork(formData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeForm();
        this.loadArtworks();
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        alert('Erreur lors de l\'enregistrement');
      }
    });
  }

  deleteArtwork(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ?')) {
      this.artworkService.deleteArtwork(id).subscribe({
        next: () => {
          this.loadArtworks();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  // ===== ARTIST INFO =====
  loadArtistInfo(): void {
    this.artistService.getArtistInfo().subscribe({
      next: (data) => {
        this.artistInfo.set(data);
      },
      error: (err) => {
        console.error('Erreur chargement infos artiste:', err);
      }
    });
  }

  onArtistImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.artistImageFile.set(target.files[0]);
    }
  }

  addParcoursItem(): void {
    const current = this.artistInfo();
    const newParcours = [...current.parcours, { year: '', event: '' }];
    this.artistInfo.set({ ...current, parcours: newParcours });
  }

  removeParcoursItem(index: number): void {
    const current = this.artistInfo();
    const newParcours = current.parcours.filter((_, i) => i !== index);
    this.artistInfo.set({ ...current, parcours: newParcours });
  }

  updateParcoursItem(index: number, field: 'year' | 'event', value: string): void {
    const current = this.artistInfo();
    const newParcours = [...current.parcours];
    newParcours[index] = { ...newParcours[index], [field]: value };
    this.artistInfo.set({ ...current, parcours: newParcours });
  }

  saveArtistInfo(): void {
    this.loading.set(true);
    const formData = new FormData();
    const info = this.artistInfo();

    formData.append('name', info.name);
    formData.append('bio', info.bio);
    formData.append('parcours', JSON.stringify(info.parcours));

    if (this.artistImageFile()) {
      formData.append('image', this.artistImageFile()!);
    }

    this.artistService.updateArtistInfo(formData).subscribe({
      next: (data) => {
        this.artistInfo.set(data);
        this.artistImageFile.set(null);
        this.loading.set(false);
        alert('Informations mises à jour avec succès !');
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  // ===== CONTACT INFO =====
  loadContactInfo(): void {
    this.contactInfoService.getContactInfo().subscribe({
      next: (data) => {
        this.contactInfo.set(data);
      },
      error: (err) => {
        console.error('Erreur chargement infos contact:', err);
      }
    });
  }

  saveContactInfo(): void {
    this.loading.set(true);
    this.contactInfoService.updateContactInfo(this.contactInfo()).subscribe({
      next: (data) => {
        this.contactInfo.set(data);
        this.loading.set(false);
        alert('Informations de contact mises à jour avec succès !');
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  // ===== ACCOUNT MANAGEMENT =====
  updateUsername(): void {
    const form = this.accountForm();
    
    if (!form.currentPassword || !form.newUsername) {
      this.accountError.set('Veuillez remplir tous les champs requis');
      return;
    }

    this.loading.set(true);
    this.accountError.set('');
    this.accountSuccess.set('');

    this.authService.updateUsername({
      currentPassword: form.currentPassword,
      newUsername: form.newUsername
    }).subscribe({
      next: () => {
        this.accountSuccess.set('Identifiant mis à jour avec succès !');
        this.resetAccountForm();
        this.loading.set(false);
      },
      error: (err) => {
        this.accountError.set(err.error?.message || 'Erreur lors de la mise à jour de l\'identifiant');
        this.loading.set(false);
      }
    });
  }

  updatePassword(): void {
    const form = this.accountForm();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      this.accountError.set('Veuillez remplir tous les champs requis');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      this.accountError.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (form.newPassword.length < 7) {
      this.accountError.set('Le mot de passe doit contenir au moins 7 caractères');
      return;
    }

    if (!/[A-Z]/.test(form.newPassword)) {
      this.accountError.set('Le mot de passe doit contenir au moins une majuscule');
      return;
    }

    if (!/[a-z]/.test(form.newPassword)) {
      this.accountError.set('Le mot de passe doit contenir au moins une minuscule');
      return;
    }

    if (!/[0-9]/.test(form.newPassword)) {
      this.accountError.set('Le mot de passe doit contenir au moins un chiffre');
      return;
    }

    this.loading.set(true);
    this.accountError.set('');
    this.accountSuccess.set('');

    this.authService.updatePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    }).subscribe({
      next: () => {
        this.accountSuccess.set('Mot de passe mis à jour avec succès !');
        this.resetAccountForm();
        this.loading.set(false);
      },
      error: (err) => {
        this.accountError.set(err.error?.message || 'Erreur lors de la mise à jour du mot de passe');
        this.loading.set(false);
      }
    });
  }

  resetAccountForm(): void {
    this.accountForm.set({
      currentPassword: '',
      newUsername: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  // Validation helpers pour le mot de passe
  hasMinLength(): boolean {
    const password = this.accountForm().newPassword;
    return password ? password.length >= 7 : false;
  }

  hasUppercase(): boolean {
    const password = this.accountForm().newPassword;
    return password ? /[A-Z]/.test(password) : false;
  }

  hasLowercase(): boolean {
    const password = this.accountForm().newPassword;
    return password ? /[a-z]/.test(password) : false;
  }

  hasNumber(): boolean {
    const password = this.accountForm().newPassword;
    return password ? /[0-9]/.test(password) : false;
  }

  // ===== UTILS =====
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) {
      return url;
    }
    // Retirer /api de l'URL pour les uploads
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }
}
