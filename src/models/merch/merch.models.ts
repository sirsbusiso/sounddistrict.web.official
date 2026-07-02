export interface ProductDto {
  id: number;
  name: string;
  description?: string | null;
  productType: string;
  downloadUrl?: string | null;
  createdAt: Date;
  updatedAt: string;
  price: number;
  color?: string | null;
  variants: ProductVariantDto[];
  productImages: ProductImageDto[];
  quantity: number;
  size?: string;
  isActive: boolean;
  slug: string;
}

export interface ProductVariantDto {
  id: number;
  productId: number;
  sku?: string | null;
  size?: string | null;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductImageDto {
  productImageId: number;
  productId: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  createdAt: string;
  isActive: boolean;
}
