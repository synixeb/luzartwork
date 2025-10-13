export interface Artwork {
  _id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: 'peinture' | 'sculpture' | 'dessin' | 'photographie' | 'digital' | 'autre';
  year?: number;
  dimensions?: string;
  technique?: string;
  price?: number;
  isAvailable?: boolean;
  order?: number;
  createdAt?: Date;
}
