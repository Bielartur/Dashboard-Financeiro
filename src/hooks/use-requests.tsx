import { apiRequest } from "../utils/apiRequests";

// --- Interfaces ---

export interface Category {
  id: string;
  name: string;
}

export interface Bank {
  id: string;
  name: string;
}

export interface Merchant {
  id: string;
  name: string;
  categoryId?: string;
  userId?: string;
}

export interface PaymentCreate {
  title: string;
  date: string;
  amount: number;
  paymentMethod: "pix" | "credit_card" | "debit_card" | "other";
  bankId: string;
  categoryId?: string | null;
}

export interface BankCreate {
  name: string;
  color_hex: string;
  logo_url: string;
  slug: string;
  is_active: boolean;
}

export interface PaymentResponse {
  id: string;
  title: string;
  date: string;
  amount: number;
  paymentMethod: {
    value: string;
    displayName: string;
  };
  bank?: Bank;
  merchant?: Merchant;
  category?: Category;
}

// --- Requests ---

const getCategories = async () => {
  return await apiRequest<Category[]>("categories/", "GET");
};

const getBanks = async () => {
  return await apiRequest<Bank[]>("banks/", "GET");
};

const createBank = async (payload: BankCreate) => {
  return await apiRequest<any>("banks/", "POST", payload as unknown as Record<string, unknown>);
};

const createPayment = async (payload: PaymentCreate) => {
  return await apiRequest<any>("payments/", "POST", payload as unknown as Record<string, unknown>);
};

const searchMerchants = async (query: string) => {
  if (!query) return [];
  return await apiRequest<Merchant[]>(`merchants/search?query=${encodeURIComponent(query)}`, "GET");
};

// Filter interface
export interface PaymentFilters {
  query?: string;
  limit?: number;
  paymentMethod?: string;
  categoryId?: string;
  bankId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

const searchPayments = async (filters: PaymentFilters) => {
  const queryParams = new URLSearchParams();

  if (filters.query) queryParams.append("query", filters.query);
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.paymentMethod && filters.paymentMethod !== "all") queryParams.append("payment_method", filters.paymentMethod);
  if (filters.categoryId && filters.categoryId !== "all") queryParams.append("category_id", filters.categoryId);
  if (filters.bankId && filters.bankId !== "all") queryParams.append("bank_id", filters.bankId);

  if (filters.startDate) queryParams.append("start_date", filters.startDate.toISOString().split('T')[0]);
  if (filters.endDate) queryParams.append("end_date", filters.endDate.toISOString().split('T')[0]);

  if (filters.minAmount) queryParams.append("min_amount", filters.minAmount.toString());
  if (filters.maxAmount) queryParams.append("max_amount", filters.maxAmount.toString());

  return await apiRequest<PaymentResponse[]>(`payments/search?${queryParams.toString()}`, "GET");
};

// --- Hook Export ---

export const useRequests = () => ({
  getCategories,
  getBanks,
  createPayment,
  createBank,
  searchMerchants,
  searchPayments,
});
