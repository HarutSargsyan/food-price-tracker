import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { UserService } from '../services/userService';

const provider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await UserService.upsertUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const login = () => {
    signInWithPopup(auth, provider).catch(console.error);
  };

  const logout = () => {
    signOut(auth).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
