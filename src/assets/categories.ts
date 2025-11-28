import {
  PhotoIcon,
  BookOpenIcon,
  DocumentTextIcon,
  NewspaperIcon,
  PaintBrushIcon,
  FaceSmileIcon,
  GiftIcon,
  SparklesIcon,
  RectangleGroupIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline';

export interface Category {
  id: string;
  name: string;
  icon: any;
  shortName: string;
}

export interface SubCategory {
  id: string;
  name: string;
  parentCategoryId: string;
  icon: any;
  shortName: string;
}

// Main categories
export const categories: Map<string, Category> = new Map([
  ['print', {
    id: 'print',
    name: 'プリント',
    icon: PrinterIcon,
    shortName: 'プリント'
  }],
  ['album', {
    id: 'album',
    name: 'アルバム',
    icon: BookOpenIcon,
    shortName: 'アルバム'
  }],
  ['album-print', {
    id: 'album-print',
    name: 'アルバムプリント',
    icon: BookOpenIcon,
    shortName: 'アルバムプリント'
  }],
  ['photo-book', {
    id: 'photo-book',
    name: '写真集',
    icon: BookOpenIcon,
    shortName: '写真集'
  }],
  ['photo-mount', {
    id: 'photo-mount',
    name: '写真台紙',
    icon: PaintBrushIcon,
    shortName: '写真台紙'
  }],
  ['display-item', {
    id: 'display-item',
    name: 'ディスプレイアイテム',
    icon: RectangleGroupIcon,
    shortName: 'ディスプレイ'
  }]
]);

// Subcategories
export const subCategories: Map<string, SubCategory> = new Map([
  ['album-print-fuedegi', {
    id: 'album-print-fuedegi',
    name: '増えデジ',
    parentCategoryId: 'album-print',
    icon: BookOpenIcon,
    shortName: '増えデジ'
  }],
  ['album-print-basic', {
    id: 'album-print-basic',
    name: 'ベーシック',
    parentCategoryId: 'album-print',
    icon: BookOpenIcon,
    shortName: 'ベーシック'
  }],
  ['photo-mount-premium', {
    id: 'photo-mount-premium',
    name: 'プレミア',
    parentCategoryId: 'photo-mount',
    icon: PaintBrushIcon,
    shortName: 'プレミア'
  }],
  ['photo-mount-premium-character', {
    id: 'photo-mount-premium-character',
    name: 'プレミア キャラクター',
    parentCategoryId: 'photo-mount',
    icon: FaceSmileIcon,
    shortName: 'キャラ'
  }],
  ['photo-mount-gift', {
    id: 'photo-mount-gift',
    name: 'ギフト',
    parentCategoryId: 'photo-mount',
    icon: GiftIcon,
    shortName: 'ギフト'
  }],
  ['photo-mount-design-poem', {
    id: 'photo-mount-design-poem',
    name: 'デザイン ポエム付き',
    parentCategoryId: 'photo-mount',
    icon: SparklesIcon,
    shortName: 'ポエム'
  }]
]);

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return categories.get(id);
};

export const getSubCategoryById = (id: string): SubCategory | undefined => {
  return subCategories.get(id);
};

export const getCategoryInfo = (categoryId: string): { category: Category | undefined, subCategory: SubCategory | undefined } => {
  const category = getCategoryById(categoryId);
  if (category) {
    return { category, subCategory: undefined };
  }
  
  const subCategory = getSubCategoryById(categoryId);
  if (subCategory) {
    const parentCategory = getCategoryById(subCategory.parentCategoryId);
    return { category: parentCategory, subCategory };
  }
  
  return { category: undefined, subCategory: undefined };
};

export const getCategoryDisplayName = (categoryId: string): string => {
  const { category, subCategory } = getCategoryInfo(categoryId);
  
  if (subCategory) {
    return `${category?.name} ${subCategory.name}`;
  }
  
  return category?.name || categoryId;
};

export const getCategoryIcon = (categoryId: string): any => {
  const { category, subCategory } = getCategoryInfo(categoryId);
  return subCategory?.icon || category?.icon || DocumentTextIcon;
};

export const getCategoryShortName = (categoryId: string): string => {
  const { category, subCategory } = getCategoryInfo(categoryId);
  return subCategory?.shortName || category?.shortName || categoryId.slice(0, 4);
};

// Get all parent categories for display (excludes subcategories from sidebar)
export const getAllCategoriesForDisplay = (): Array<{ id: string, name: string, icon: any, shortName: string }> => {
  const result: Array<{ id: string, name: string, icon: any, shortName: string }> = [];
  
  // Add all main categories (both those with and without subcategories)
  for (const [id, category] of categories) {
    result.push({
      id: category.id,
      name: category.name,
      icon: category.icon,
      shortName: category.shortName
    });
  }
  
  return result.sort((a, b) => a.name.localeCompare(b.name));
};

// Get all subcategory IDs for a given parent category
export const getSubCategoryIds = (parentCategoryId: string): string[] => {
  return Array.from(subCategories.values())
    .filter(sub => sub.parentCategoryId === parentCategoryId)
    .map(sub => sub.id);
};

// Mapping from old category strings to new category IDs
export const categoryStringToIdMap: Record<string, string> = {
  'プリント': 'print',
  'アルバム': 'album',
  'アルバムプリント 増えデジ': 'album-print-fuedegi',
  'アルバムプリント ベーシック': 'album-print-basic',
  '写真集': 'photo-book',
  '写真台紙 プレミア': 'photo-mount-premium',
  '写真台紙 プレミア キャラクター': 'photo-mount-premium-character',
  '写真台紙 ギフト': 'photo-mount-gift',
  '写真台紙 デザイン ポエム付き': 'photo-mount-design-poem'
};