import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase, authService } from '../services/supabase';
import { ADMIN_CREDENTIALS } from '../config/constants';

// Contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin', 'client', o null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al iniciar
    checkSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await checkUserRole(session.user.id);
        } else {
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { session } = await authService.getSession();
      if (session?.user) {
        setUser(session.user);
        await checkUserRole(session.user.id);
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (data) {
        setRole(data.role);
      } else {
        setRole('client'); // Por defecto es cliente
      }
    } catch (error) {
      setRole('client');
    }
  };

  // Login de admin con credenciales fijas
  const loginAdmin = async (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && 
        password === ADMIN_CREDENTIALS.password) {
      // Admin autenticado con credenciales fijas
      setUser({ id: 'admin', email: 'admin@aunerarroz.com' });
      setRole('admin');
      return { success: true, error: null };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  };

  // Login de cliente con email
  const loginClient = async (email, password) => {
    const { data, error } = await authService.signIn(email, password);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  };

  // Registro de cliente
  const registerClient = async (email, password) => {
    const { data, error } = await authService.signUp(email, password);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data, error: null };
  };

  // Verificar código OTP
  const verifyCode = async (email, code) => {
    const { data, error } = await authService.verifyOTP(email, code);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  };

  // Recuperar contraseña
  const resetPassword = async (email) => {
    const { data, error } = await authService.resetPassword(email);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  };

  // Cerrar sesión
  const logout = async () => {
    if (role === 'admin') {
      // Admin no usa Supabase auth
      setUser(null);
      setRole(null);
      return { error: null };
    }
    const { error } = await authService.signOut();
    return { error };
  };

  const value = {
    user,
    role,
    loading,
    loginAdmin,
    loginClient,
    registerClient,
    verifyCode,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
