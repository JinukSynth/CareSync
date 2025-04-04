// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { firebaseService } from '../../firebase';
import { authService } from '../../firebase/auth';
import { HospitalUser } from '../../firebase/type';

interface AuthContextType {
  user: User | null;
  hospitalUser: HospitalUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hospitalUser, setHospitalUser] = useState<HospitalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase Auth의 인증 상태 변경 감지
  useEffect(() => {
    const auth = firebaseService.getAuth();
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const hospitalData = await authService.getUserHospital(user.uid);
          setHospitalUser(hospitalData);
        } catch (error) {
          console.error('Error loading hospital user:', error);
          setHospitalUser(null);
        }
      } else {
        setHospitalUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.login(email, password);
    } catch (error) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      setError('로그아웃 중 오류가 발생했습니다.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    hospitalUser,
    isLoading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}