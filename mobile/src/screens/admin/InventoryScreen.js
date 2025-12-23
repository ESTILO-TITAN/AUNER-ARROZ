import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../config/constants';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await supabase.from('inventory').select('*').order('name');
      if (data) setInventory(data);
    } catch (error) {
      // Datos de ejemplo
      setInventory([
        { id: 1, name: 'Arroz', quantity: 50, unit: 'kg', min_stock: 20 },
        { id: 2, name: 'Pollo', quantity: 15, unit: 'kg', min_stock: 10 },
        { id: 3, name: 'Carne', quantity: 8, unit: 'kg', min_stock: 10 },
        { id: 4, name: 'Aceite', quantity: 12, unit: 'L', min_stock: 5 },
        { id: 5, name: 'Limones', quantity: 100, unit: 'unid', min_stock: 50 },
        { id: 6, name: 'Azadura de chivo', quantity: 5, unit: 'kg', min_stock: 3 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 0) return;

    setInventory(inventory.map(i =>
      i.id === item.id ? { ...i, quantity: newQuantity } : i
    ));
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter(i => i.quantity <= i.min_stock).length;

  const renderItem = ({ item }) => {
    const isLowStock = item.quantity <= item.min_stock;
    
    return (
      <View style={[styles.itemCard, isLowStock && styles.lowStockCard]}>
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            {isLowStock && (
              <View style={styles.alertBadge}>
                <Ionicons name="warning" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.itemStock}>
            {item.quantity} {item.unit} disponible
          </Text>
          <Text style={styles.itemMinStock}>
            Mínimo: {item.min_stock} {item.unit}
          </Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStock(item, -1)}
          >
            <Ionicons name="remove" size={20} color={COLORS.danger} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStock(item, 1)}
          >
            <Ionicons name="add" size={20} color={COLORS.success} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventario</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Alerta de stock bajo */}
      {lowStockItems > 0 && (
        <View style={styles.alertBar}>
          <Ionicons name="warning" size={18} color="#FF9800" />
          <Text style={styles.alertText}>
            {lowStockItems} producto(s) con stock bajo
          </Text>
        </View>
      )}

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Lista */}
      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  addButton: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  alertBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0',
    padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 10,
  },
  alertText: { marginLeft: 8, color: '#FF9800', fontWeight: '500' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    margin: 16, padding: 12, borderRadius: 12,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text },
  listContainer: { padding: 16, paddingTop: 0 },
  itemCard: {
    backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center',
  },
  lowStockCard: { borderLeftWidth: 4, borderLeftColor: COLORS.warning },
  itemInfo: { flex: 1 },
  itemHeader: { flexDirection: 'row', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  alertBadge: { backgroundColor: COLORS.warning, borderRadius: 10, padding: 4, marginLeft: 8 },
  itemStock: { fontSize: 14, color: COLORS.text, marginTop: 4 },
  itemMinStock: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  itemActions: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 20, padding: 4 },
  actionButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, minWidth: 30, textAlign: 'center' },
});
