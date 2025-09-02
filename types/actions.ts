/**
 * Типы для Server Actions
 */

export interface ActionResult {
  success: boolean;
  message?: string;
  data?: any;
}

export interface SearchResult {
  success: boolean;
  results?: any[];
  message?: string;
}

export interface PartFormData {
  name: string;
  category: string;
  price: number;
}

export interface ClientFormData {
  name: string;
  phone: string;
  email: string;
}

export interface SaleFormData {
  partId: string;
  clientId: string;
  price: number;
}

export interface SearchFormData {
  query: string;
  category: string;
  status: string;
}
