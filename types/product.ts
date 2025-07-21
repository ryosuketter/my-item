export type Company = {
  id: string;
  name: string;
  slug?: string;
  website?: string;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  link: string;
  comment?: string;
  detailedComment?: string;
  photos: { url: string }[];
  videoUrl?: string;
  price: number;
  rating: number;
  categories: Category[];
  pros?: string[];
  cons?: string[];
  relatedProducts?: Product[];
  companies?: Company[];
};
