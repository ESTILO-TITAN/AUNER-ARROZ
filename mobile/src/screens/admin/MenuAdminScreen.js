import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/supabase';
import { cloudinaryService } from '../../services/cloudinary';
import { COLORS } from '../../config/constants';

export default function MenuAdminScreen({ navigation }) {
  const [dishes, setDishes] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    // Datos de ejemplo
    setDishes([
      { id: 1, name: 'Menú del Día', description: 'Arroz, proteína, ensalada y bebida', price: 12000, category: 'menu', image_url: null, video_url: null, active: true },
      { id: 2, name: 'Menú Ejecutivo', description: 'Arroz, proteína premium, ensalada, sopa y bebida', price: 18000, category: 'menu', image_url: null, video_url: null, active: true },
      { id: 3, name: 'Asadura de Chivo', description: 'Porción de asadura de chivo', price: 8000, category: 'adicional', image_url: null, video_url: null, active: true },
      { id: 4, name: 'Huevo Cocido', description: 'Huevo cocido', price: 2000, category: 'adicional', image_url: null, video_url: null, active: true },
      { id: 5, name: 'Limonada', description: 'Limonada natural', price: 3000, category: 'adicional', image_url: null, video_url: null, active: true },
    ]);
  };

  const pickImage = async (dish) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const isVideo = result.assets[0].type === 'video';
      
      Alert.alert('Subiendo...', 'Espera mientras se sube el archivo');
      
      const { url, error } = isVideo
        ? await cloudinaryService.uploadVideo(uri)
        : await cloudinaryService.uploadImage(uri);

      if (url) {
        setDishes(dishes.map(d =>
          d.id === dish.id
            ? { ...d, [isVideo ? 'video_url' : 'image_url']: url }
            : d
        ));
        Alert.alert('¡Listo!', 'Archivo subido correctamente');
      } else {
        Alert.alert('Error', 'No se pudo subir el archivo');
      }
    }
  };

  const toggleActive = (dish) => {
    setDishes(dishes.map(d =>
      d.id === dish.id ? { ...d, active: !d.active } : d
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Menú</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>🍽️ Menús Principales</Text>
      {dishes.filter(d => d.category === 'menu').map(dish => (
        <View key={dish.id} style={[styles.dishCard, !dish.active && styles.dishCardInactive]}>
          <TouchableOpacity style={styles.mediaContainer} onPress={() => pickImage(dish)}>
            {dish.image_url ? (
              <Image source={{ uri: dish.image_url }} style={styles.dishImage} />
            ) : (
              <View style={styles.mediaPlaceholder}>
                <Ionicons name="camera" size={32} color={COLORS.textLight} />
                <Text style={styles.placeholderText}>Añadir foto/video</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{dish.name}</Text>
            <Text style={styles.dishDesc} numberOfLines={2}>{dish.description}</Text>
            <Text style={styles.dishPrice}>{formatCurrency(dish.price)}</Text>
          </View>
          <TouchableOpacity style={styles.toggleButton} onPress={() => toggleActive(dish)}>
            <Ionicons name={dish.active ? 'eye' : 'eye-off'} size={20} color={dish.active ? COLORS.success : COLORS.textLight} />
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.sectionTitle}>🥤 Adicionales</Text>
      {dishes.filter(d => d.category === 'adicional').map(dish => (
        <View key={dish.id} style={[styles.dishCard, !dish.active && styles.dishCardInactive]}>
          <TouchableOpacity style={styles.mediaContainer} onPress={() => pickImage(dish)}>
            {dish.image_url ? (
              <Image source={{ uri: dish.image_url }} style={styles.dishImage} />
            ) : (
              <View style={styles.mediaPlaceholder}>
                <Ionicons name="camera" size={32} color={COLORS.textLight} />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{dish.name}</Text>
            <Text style={styles.dishPrice}>{formatCurrency(dish.price)}</Text>
          </View>
          <TouchableOpacity style={styles.toggleButton} onPress={() => toggleActive(dish)}>
            <Ionicons name={dish.active ? 'eye' : 'eye-off'} size={20} color={dish.active ? COLORS.success : COLORS.textLight} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  addButton: { backgroundColor: COLORS.primary, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, padding: 16, paddingBottom: 8 },
  dishCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 12 },
  dishCardInactive: { opacity: 0.5 },
  mediaContainer: { width: 70, height: 70, borderRadius: 10, overflow: 'hidden', marginRight: 12 },
  dishImage: { width: '100%', height: '100%' },
  mediaPlaceholder: { width: '100%', height: '100%', backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 10, color: COLORS.textLight, marginTop: 4 },
  dishInfo: { flex: 1 },
  dishName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  dishDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  dishPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginTop: 4 },
  toggleButton: { padding: 8 },
});
