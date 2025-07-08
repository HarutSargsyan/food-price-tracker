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
import type { Product, CreateProductInput } from '../types/database';

const COLLECTION_NAME = 'products';

export class ProductService {
  // Add a new product (guarantee uniqueness by name per user)
  static async addProduct(input: CreateProductInput, userId: string): Promise<string> {
    const now = Timestamp.now();
    const docId = `${userId}_${input.name.trim().toLowerCase()}`;
    const productData = {
      ...input,
      createdAt: now,
      userId,
      id: docId,
    };
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, productData, { merge: true });
    return docRef.id;
  }

  // Get all products for a user
  static async getProducts(userId: string): Promise<Product[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('name', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  }

  // Get product by ID (ensure userId matches)
  static async getProductById(id: string, userId: string): Promise<Product | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    if (data.userId !== userId) return null;
    
    return {
      id: docSnap.id,
      ...data,
    } as Product;
  }

  // Get products by category for a user
  static async getProductsByCategory(category: string, userId: string): Promise<Product[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('name', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  }

  // Update a product
  static async updateProduct(id: string, updates: Partial<CreateProductInput>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      userId,
    });
  }

  // Delete a product
  static async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  // Initialize default products for a user if none exist (atomic, no double init)
  static async initializeDefaultProducts(userId: string): Promise<void> {
    const existingProducts = await this.getProducts(userId);
    if (existingProducts.length === 0) {
      await this.addProduct({ name: 'Apple', category: 'Fruits', defaultUnit: 'per lb' }, userId);
    }
  }
} 