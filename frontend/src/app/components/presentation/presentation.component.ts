import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../services/artist.service';
import { ArtistInfo, ParcoursItem } from '../../models/artist-info.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {
  private artistService = inject(ArtistService);
  
  artistName = signal('Nom de l\'Artiste');
  artistImage = signal('https://via.placeholder.com/400x500/10b981/ffffff?text=Photo+Artiste');
  bio = signal('Chargement...');
  parcours = signal<ParcoursItem[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadArtistInfo();
  }

  loadArtistInfo(): void {
    this.loading.set(true);
    this.artistService.getArtistInfo().subscribe({
      next: (data: ArtistInfo) => {
        this.artistName.set(data.name);
        this.bio.set(data.bio);
        this.parcours.set(data.parcours);
        this.artistImage.set(this.getImageUrl(data.imageUrl));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des infos artiste:', error);
        this.loading.set(false);
        // Garder les valeurs par défaut en cas d'erreur
      }
    });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return 'https://via.placeholder.com/400x500/10b981/ffffff?text=Photo+Artiste';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Pour les URLs relatives (uploads)
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${imageUrl}`;
  }
}
