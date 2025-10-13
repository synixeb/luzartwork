import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artwork } from '../../models/artwork.model';
import { ArtworkService } from '../../services/artwork.service';
import { environment } from '../../../environments/environment';
import { PresentationComponent } from '../presentation/presentation.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, PresentationComponent, ContactComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  private artworkService = inject(ArtworkService);
  
  artworks = signal<Artwork[]>([]);
  selectedArtwork = signal<Artwork | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.loading.set(true);
    this.artworkService.getArtworks().subscribe({
      next: (data) => {
        this.artworks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des œuvres');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  openArtwork(artwork: Artwork): void {
    this.selectedArtwork.set(artwork);
  }

  closeArtwork(): void {
    this.selectedArtwork.set(null);
  }

  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Retirer /api de l'URL pour les uploads
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${imageUrl}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Image placeholder si l'image ne charge pas
    img.src = 'https://placehold.co/600x400?text=Image+Non+Disponible&font=roboto';
    console.error('Erreur de chargement d\'image:', img.src);
  }
}
