export interface SocialMedia {
  instagram?: string;
  artstation?: string;
  linkedin?: string;
}

export interface ContactInfo {
  _id?: string;
  email: string;
  phone?: string;
  address?: string;
  social?: SocialMedia;
  createdAt?: Date;
  updatedAt?: Date;
}
