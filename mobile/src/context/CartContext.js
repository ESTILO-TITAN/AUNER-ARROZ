import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Contexto del carrito
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito del storage al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  // Guardar carrito en storage cuando cambie
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loading]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  // Añadir item al carrito
  const addItem = (dish) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === dish.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...dish, quantity: 1 }];
    });
  };

  // Remover item del carrito
  const removeItem = (dishId) => {
    setItems(currentItems => currentItems.filter(item => item.id !== dishId));
  };

  // Actualizar cantidad
  const updateQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  // Vaciar carrito
  const clearCart = () => {
    setItems([]);
  };

  // Calcular total
  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Obtener cantidad total de items
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
