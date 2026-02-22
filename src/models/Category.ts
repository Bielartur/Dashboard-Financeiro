export interface Category {
  id: string;
  name: string;
  slug: string;
  alias?: string;
  colorHex: string;
  createdAt?: string;
  updatedAt?: string;
  isInvestment?: boolean;
  ignored?: boolean;
}

export interface CategoryCreate {
  name: string;
  colorHex: string;
  isInvestment?: boolean;
  ignored?: boolean;
}
export interface CategoryUpdate {
  name?: string;
  colorHex?: string;
  isInvestment?: boolean;
  ignored?: boolean;
}

export interface CategorySettingsUpdate {
  alias?: string;
  colorHex?: string;
  isInvestment?: boolean;
  ignored?: boolean;
}
