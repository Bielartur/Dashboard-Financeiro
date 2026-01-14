export interface Category {
  id: string;
  name: string;
  slug: string;
  colorHex: string;
  type: "income" | "expense" | "neutral";
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreate {
  name: string;
  colorHex: string;
  type: "income" | "expense" | "neutral";
}
export interface CategoryUpdate {
  name?: string;
  colorHex?: string;
  type?: "income" | "expense" | "neutral";
}
