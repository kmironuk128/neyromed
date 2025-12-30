// src/components/auth/AuthProvider.jsx
import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback 
} from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';

/**
 * Контекст автентифікації
 */
const AuthContext = createContext(undefined);

/**
 * Хук для використання автентифікації.
 * Викидає помилку, якщо використовується поза AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Провайдер автентифікації Firebase
 * Забезпечує глобальний доступ до поточного користувача та методів входу/виходу
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Вхід користувача за email та паролем
   */
  const login = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  /**
   * Вихід поточного користувача
   */
  const logout = useCallback(() => {
    return signOut(auth);
  }, []);

  /**
   * Підписка на зміни стану автентифікації Firebase
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Очищення підписки при розмонтуванні компонента
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Рендеримо дочірні компоненти тільки після завершення ініціалізації */}
      {!loading && children}
    </AuthContext.Provider>
  );
};