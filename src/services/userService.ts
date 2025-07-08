import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'users';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class UserService {
  // Create or update user document on login
  static async upsertUser(user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
  }) {
    const userRef = doc(db, COLLECTION_NAME, user.uid);
    const now = serverTimestamp();
    await setDoc(
      userRef,
      {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  // Get user profile
  static async getUser(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as UserProfile;
  }

  // Update user profile
  static async updateUser(uid: string, updates: Partial<UserProfile>) {
    const userRef = doc(db, COLLECTION_NAME, uid);
    await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
  }
} 