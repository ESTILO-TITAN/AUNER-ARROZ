import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../config/constants';

const { width } = Dimensions.get('window');

export default function MenuScreen({ navigation }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addItem, getItemCount } = useCart();

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'menu', name: 'Menús' },
    { id: 'adicional', name: 'Adicionales' },
  ];

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setDishes(data || []);
    } catch (error) {
      console.error('Error cargando platos:', error);
      // Datos de ejemplo mientras no hay conexión
      setDishes([
        {
          id: 1,
          name: 'Menú del Día',
          description: 'Arroz, proteína, ensalada y bebida',
          price: 12000,
          category: 'menu',
          image_url: null,
          video_url: null,
        },
        {
          id: 2,
          name: 'Menú Ejecutivo',
          description: 'Arroz, proteína premium, ensalada, sopa y bebida',
          price: 18000,
          category: 'menu',
          image_url: null,
          video_url: null,
        },
        {
          id: 3,
          name: 'Menú Especial',
          description: 'Arroz con pollo, ensalada especial y bebida',
          price: 15000,
          category: 'menu',
          image_url: null,
          video_url: null,
        },
        {
          id: 4,
          name: 'Asadura de Chivo',
          description: 'Porción de asadura de chivo',
          price: 8000,
          category: 'adicional',
          image_url: null,
          video_url: null,
        },
        {
          id: 5,
          name: 'Huevo Cocido',
          description: 'Huevo cocido',
          price: 2000,
          category: 'adicional',
          image_url: null,
          video_url: null,
        },
        {
          id: 6,
          name: 'Limonada',
          description: 'Limonada natural',
          price: 3000,
          category: 'adicional',
          image_url: null,
          video_url: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDishes = selectedCategory === 'all'
    ? dishes
    : dishes.filter(dish => dish.category === selectedCategory);

  const handleAddToCart = (dish) => {
    addItem(dish);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderDish = ({ item }) => (
    <View style={styles.dishCard}>
      {item.video_url ? (
        <Video
          source={{ uri: item.video_url }}
          style={styles.dishMedia}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
      ) : item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.dishMedia} />
      ) : (
        <View style={[styles.dishMedia, styles.placeholderMedia]}>
          <Ionicons name="restaurant" size={48} color={COLORS.textLight} />
        </View>
      )}
      
      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.dishFooter}>
          <Text style={styles.dishPrice}>{formatPrice(item.price)}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando menú...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con título y carrito */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🍚 Auner Arroz</Text>
          <Text style={styles.headerSubtitle}>El sabor del pueblo</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Carrito')}
        >
          <Ionicons name="cart" size={28} color={COLORS.primary} />
          {getItemCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de platos */}
      <FlatList
        data={filteredDishes}
        renderItem={renderDish}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.card,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.background,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 12,
  },
  dishCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dishMedia: {
    width: '100%',
    height: 180,
  },
  placeholderMedia: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishInfo: {
    padding: 16,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
