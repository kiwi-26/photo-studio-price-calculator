export interface ProductType {
  id: number | string;
  name: string;
  categoryId: string;
  description: string;
  photoCount: number;
  price: number;
  variation?: string;
}

export interface CartItemType extends ProductType {
  quantity: number;
}
