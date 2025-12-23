import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

function Main() {
  const { role, loading } = useAuth();

  if (loading) {
    return null; // Splash screen mientras carga
  }

  return <AppNavigator userRole={role} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="auto" />
          <Main />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
