import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { PriceEntry, CreatePriceEntryInput } from '../types/database';

const COLLECTION_NAME = 'priceEntries';

export class PriceEntryService {
  // Add a new price entry
  static async addPriceEntry(input: CreatePriceEntryInput, userId: string): Promise<string> {
    const now = Timestamp.now();
    const entryData = {
      ...input,
      date: now,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), entryData);
    return docRef.id;
  }

  // Get all price entries for a user
  static async getPriceEntries(userId: string): Promise<PriceEntry[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PriceEntry[];
  }

  // Get price entries for a specific product
  static async getPriceEntriesByProduct(productId: string, userId: string): Promise<PriceEntry[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('productId', '==', productId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PriceEntry[];
  }

  // Get the best (lowest) price for a product across all stores
  static async getBestPriceForProduct(productId: string, userId: string): Promise<PriceEntry | null> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('productId', '==', productId),
      orderBy('price', 'asc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as PriceEntry;
  }

  // Get price comparison for a product across different stores
  static async getPriceComparisonByProduct(productId: string, userId: string): Promise<PriceEntry[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('productId', '==', productId),
      orderBy('price', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PriceEntry[];
  }

  // Get recent price entries (last 30 days)
  static async getRecentPriceEntries(userId: string, days: number = 30): Promise<PriceEntry[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);
    const timestamp = Timestamp.fromDate(thirtyDaysAgo);

    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('date', '>=', timestamp),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PriceEntry[];
  }

  // Update a price entry (allow updating date)
  static async updatePriceEntry(id: string, updates: Partial<CreatePriceEntryInput & { date?: Date | Timestamp }>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete a price entry
  static async deletePriceEntry(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  // Get price trend for a product (price changes over time)
  static async getPriceTrend(productId: string, userId: string, limitCount: number = 10): Promise<PriceEntry[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('productId', '==', productId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PriceEntry[];
  }

  // Get average price for a product
  static async getAveragePriceForProduct(productId: string, userId: string): Promise<number> {
    const entries = await this.getPriceEntriesByProduct(productId, userId);
    if (entries.length === 0) return 0;

    const total = entries.reduce((sum, entry) => sum + entry.price, 0);
    return total / entries.length;
  }

  // Get stores with best prices for multiple products
  static async getStoresWithBestPrices(userId: string): Promise<Map<string, PriceEntry>> {
    const allEntries = await this.getPriceEntries(userId);
    const bestPrices = new Map<string, PriceEntry>();

    // Group by product and find the lowest price for each
    allEntries.forEach(entry => {
      const existing = bestPrices.get(entry.productId);
      if (!existing || entry.price < existing.price) {
        bestPrices.set(entry.productId, entry);
      }
    });

    return bestPrices;
  }

  // Find an entry by productId, storeId, and userId
  static async findEntryByProductAndStore(productId: string, storeId: string, userId: string): Promise<PriceEntry | null> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('productId', '==', productId),
      where('storeId', '==', storeId),
      orderBy('date', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as PriceEntry;
  }

  // Delete all price entries for a product
  static async deleteEntriesByProduct(productId: string, userId: string): Promise<void> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);
    const batchDeletes = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)));
    await Promise.all(batchDeletes);
  }

  // Delete all price entries for a store
  static async deleteEntriesByStore(storeId: string, userId: string): Promise<void> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('storeId', '==', storeId)
    );
    const querySnapshot = await getDocs(q);
    const batchDeletes = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)));
    await Promise.all(batchDeletes);
  }
} 