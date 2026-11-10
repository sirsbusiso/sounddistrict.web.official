export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  coverImageUrl?: string;
  author: string;
  keywords?: string;
  viewCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedDate?: Date;
  createdDate: Date;
  updatedDate?: Date;
}

export interface ArticleAdd {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  coverImageUrl?: string;
  author: string;
  keywords?: string;
  isFeatured: boolean;
  isPublished: boolean;
  publishedDate?: Date;
}

export interface ArticleUpdate {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  coverImageUrl?: string;
  author: string;
  keywords?: string;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
