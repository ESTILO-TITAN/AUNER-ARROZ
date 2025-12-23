import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config/constants';

export default function CustomersScreen() {
  const [period, setPeriod] = useState('month');
  const periods = [
    { id: 'day', name: 'Día' },
    { id: 'week', name: 'Semana' },
    { id: 'month', name: 'Mes' },
    { id: '3month', name: '3M' },
    { id: '6month', name: '6M' },
    { id: 'year', name: '1A' },
    { id: '5year', name: '5A' },
  ];

  // Datos de ejemplo
  const stats = { total: 156, new: 23, recurring: 45 };
  const customers = [
    { id: 1, name: 'Juan Pérez', orders: 12, points: 1200, lastOrder: '2024-12-20', recurring: true },
    { id: 2, name: 'María García', orders: 8, points: 800, lastOrder: '2024-12-19', recurring: true },
    { id: 3, name: 'Carlos López', orders: 3, points: 300, lastOrder: '2024-12-18', recurring: false },
    { id: 4, name: 'Ana Rodríguez', orders: 15, points: 1800, lastOrder: '2024-12-21', recurring: true },
  ];

  const renderCustomer = ({ item }) => (
    <View style={styles.customerCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.customerInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.customerName}>{item.name}</Text>
          {item.recurring && (
            <View style={styles.recurringBadge}>
              <Ionicons name="star" size={10} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.customerDetails}>{item.orders} pedidos • {item.points} pts</Text>
      </View>
      <Text style={styles.lastOrder}>{new Date(item.lastOrder).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clientes</Text>
      </View>

      {/* Selector de período */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
        {periods.map(p => (
          <TouchableOpacity
            key={p.id}
            style={[styles.periodButton, period === p.id && styles.periodButtonActive]}
            onPress={() => setPeriod(p.id)}
          >
            <Text style={[styles.periodText, period === p.id && styles.periodTextActive]}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Estadísticas */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="person-add" size={24} color={COLORS.success} />
          <Text style={styles.statValue}>{stats.new}</Text>
          <Text style={styles.statLabel}>Nuevos</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star" size={24} color={COLORS.warning} />
          <Text style={styles.statValue}>{stats.recurring}</Text>
          <Text style={styles.statLabel}>Recurrentes</Text>
        </View>
      </View>

      {/* Lista de clientes */}
      <Text style={styles.sectionTitle}>👥 Clientes Recientes</Text>
      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  periodScroll: { backgroundColor: COLORS.card, paddingVertical: 12 },
  periodButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginLeft: 8, backgroundColor: COLORS.background },
  periodButtonActive: { backgroundColor: COLORS.primary },
  periodText: { color: COLORS.text, fontWeight: '500', fontSize: 13 },
  periodTextActive: { color: '#fff' },
  statsRow: { flexDirection: 'row', padding: 16, paddingBottom: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginRight: 8, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 8 },
  statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: 16, paddingTop: 16 },
  listContainer: { padding: 16 },
  customerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  customerInfo: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  customerName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  recurringBadge: { backgroundColor: COLORS.warning, borderRadius: 10, padding: 4, marginLeft: 6 },
  customerDetails: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  lastOrder: { fontSize: 12, color: COLORS.textLight },
});
