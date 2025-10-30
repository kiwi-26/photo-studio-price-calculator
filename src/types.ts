export interface ProductType {
  id: number | string;
  name: string;
  category: string;
  description: string;
  photoCount: number;
  price: number;
  variation?: string;
}

export interface CartItemType extends ProductType {
  quantity: number;
}
