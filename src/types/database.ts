import { Timestamp } from 'firebase/firestore';

export interface PriceEntry {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  price: number;
  unit: string;
  date: Timestamp;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  defaultUnit: string;
  createdAt: Timestamp;
  userId: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  createdAt: Timestamp;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
}

// For form inputs (without IDs and timestamps)
export interface CreatePriceEntryInput {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  price: number;
  unit: string;
}

export interface CreateProductInput {
  name: string;
  category: string;
  defaultUnit: string;
}

export interface CreateStoreInput {
  name: string;
  location: string;
} 