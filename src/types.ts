export interface ProductType {
  id: number | string;
  name: string;
  categoryId: string;
  description: string;
  photoCount: number;
  price: number;
  variation?: string;
  maxQuantity?: number; // Maximum quantity that can be purchased (undefined = unlimited)
  requiresThreshold?: boolean; // Requires 50k threshold to be orderable
  unavailableWhenThresholdMet?: boolean; // Becomes unavailable when 50k threshold is met
}

export interface CartItemType extends ProductType {
  quantity: number;
}

// New interfaces for product variation grouping
export interface ProductVariationType {
  id: number | string;
  variation: string;
  price: number;
  photoCount: number;
  description?: string; // Allow variation-specific descriptions
}

export interface GroupedProductType {
  name: string;
  categoryId: string;
  description: string;
  basePhotoCount: number; // Most common photo count among variations
  basePrice: number; // Lowest price among variations
  variations: ProductVariationType[];
  hasMultipleVariations: boolean;
}

// Union type for components that can handle both individual and grouped products
export type DisplayProductType = ProductType | GroupedProductType;
