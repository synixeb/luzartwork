export interface ParcoursItem {
  year: string;
  event: string;
}

export interface ArtistInfo {
  _id?: string;
  name: string;
  bio: string;
  imageUrl: string;
  parcours: ParcoursItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
