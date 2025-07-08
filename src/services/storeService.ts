import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Store, CreateStoreInput } from '../types/database';

const COLLECTION_NAME = 'stores';

export class StoreService {
  // Add a new store (guarantee uniqueness by name per user)
  static async addStore(input: CreateStoreInput, userId: string): Promise<string> {
    const now = Timestamp.now();
    const docId = `${userId}_${input.name.trim().toLowerCase()}`;
    const storeData = {
      ...input,
      createdAt: now,
      userId,
      id: docId,
    };
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, storeData, { merge: true });
    return docRef.id;
  }

  // Get all stores for a user
  static async getStores(userId: string): Promise<Store[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('name', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Store[];
  }

  // Get store by ID (ensure userId matches)
  static async getStoreById(id: string, userId: string): Promise<Store | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    if (data.userId !== userId) return null;
    
    return {
      id: docSnap.id,
      ...data,
    } as Store;
  }

  // Get stores by location for a user
  static async getStoresByLocation(location: string, userId: string): Promise<Store[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('location', '==', location),
      orderBy('name', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Store[];
  }

  // Update a store
  static async updateStore(id: string, updates: Partial<CreateStoreInput>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      userId,
    });
  }

  // Delete a store
  static async deleteStore(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  // Initialize default stores for a user if none exist (atomic, no double init)
  static async initializeDefaultStores(userId: string): Promise<void> {
    const existingStores = await this.getStores(userId);
    if (existingStores.length === 0) {
      await this.addStore({ name: 'SuperMart', location: '123 Main St, Anytown, USA' }, userId);
    }
  }
} 