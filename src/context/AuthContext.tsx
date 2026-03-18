import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Marketer, UserRole } from '../types';
import { ADMIN_EMAIL } from '../constants';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  marketerData: Marketer | null;
  loading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  marketerData: null,
  loading: true,
  isAuthReady: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [marketerData, setMarketerData] = useState<Marketer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        if (user.email === ADMIN_EMAIL) {
          setRole('admin');
          setMarketerData(null);
        } else {
          try {
            const marketerDoc = await getDoc(doc(db, 'marketers', user.uid));
            if (marketerDoc.exists()) {
              setMarketerData({ uid: user.uid, ...marketerDoc.data() } as Marketer);
              setRole('marketer');
            } else {
              setRole('customer');
              setMarketerData(null);
            }
          } catch (error) {
            console.error('Error fetching marketer data:', error);
            setRole('customer');
          }
        }
      } else {
        setRole(null);
        setMarketerData(null);
      }
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, marketerData, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
