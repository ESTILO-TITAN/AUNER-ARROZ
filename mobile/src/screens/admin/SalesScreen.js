import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config/constants';

export default function SalesScreen() {
  const [period, setPeriod] = useState('month');
  const periods = [
    { id: 'day', name: 'Día' },
    { id: 'week', name: 'Semana' },
    { id: 'month', name: 'Mes' },
    { id: 'year', name: 'Año' },
  ];

  // Datos de ejemplo
  const salesData = {
    total: 2850000,
    digital: 1950000,
    manual: 900000,
    orders: 145,
    avgTicket: 19655,
    projection: 3200000,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ventas</Text>
      </View>

      {/* Selector de período */}
      <View style={styles.periodContainer}>
        {periods.map(p => (
          <TouchableOpacity
            key={p.id}
            style={[styles.periodButton, period === p.id && styles.periodButtonActive]}
            onPress={() => setPeriod(p.id)}
          >
            <Text style={[styles.periodText, period === p.id && styles.periodTextActive]}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total de ventas */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Ventas Totales</Text>
        <Text style={styles.totalValue}>{formatCurrency(salesData.total)}</Text>
        <View style={styles.totalDetails}>
          <View style={styles.detailItem}>
            <View style={[styles.detailDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.detailLabel}>Digital: {formatCurrency(salesData.digital)}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={[styles.detailDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.detailLabel}>Manual: {formatCurrency(salesData.manual)}</Text>
          </View>
        </View>
      </View>

      {/* Métricas */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Ionicons name="receipt" size={28} color={COLORS.primary} />
          <Text style={styles.metricValue}>{salesData.orders}</Text>
          <Text style={styles.metricLabel}>Pedidos</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="cash" size={28} color={COLORS.success} />
          <Text style={styles.metricValue}>{formatCurrency(salesData.avgTicket)}</Text>
          <Text style={styles.metricLabel}>Ticket Promedio</Text>
        </View>
      </View>

      {/* Proyección */}
      <View style={styles.projectionCard}>
        <View style={styles.projectionHeader}>
          <Ionicons name="trending-up" size={24} color={COLORS.success} />
          <Text style={styles.projectionTitle}>Proyección Próximo Mes</Text>
        </View>
        <Text style={styles.projectionValue}>{formatCurrency(salesData.projection)}</Text>
        <Text style={styles.projectionNote}>
          Basado en el crecimiento actual y el sistema de puntos (+10-15% clientes)
        </Text>
      </View>

      {/* Cálculo */}
      <View style={styles.calculationCard}>
        <Text style={styles.calculationTitle}>📊 Resumen Financiero</Text>
        <View style={styles.calculationRow}>
          <Text style={styles.calcLabel}>Ingresos</Text>
          <Text style={[styles.calcValue, { color: COLORS.success }]}>{formatCurrency(salesData.total)}</Text>
        </View>
        <View style={styles.calculationRow}>
          <Text style={styles.calcLabel}>Gastos (ver sección)</Text>
          <Text style={[styles.calcValue, { color: COLORS.danger }]}>- {formatCurrency(1200000)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.calculationRow}>
          <Text style={styles.calcLabelBold}>Ganancia Neta</Text>
          <Text style={styles.calcValueBold}>{formatCurrency(salesData.total - 1200000)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  periodContainer: { flexDirection: 'row', padding: 12, backgroundColor: COLORS.card },
  periodButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.background },
  periodButtonActive: { backgroundColor: COLORS.primary },
  periodText: { color: COLORS.text, fontWeight: '500' },
  periodTextActive: { color: '#fff' },
  totalCard: { backgroundColor: COLORS.primary, margin: 16, borderRadius: 20, padding: 24, alignItems: 'center' },
  totalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  totalValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 8 },
  totalDetails: { flexDirection: 'row', marginTop: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  detailDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  detailLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  metricsRow: { flexDirection: 'row', marginHorizontal: 16 },
  metricCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginRight: 8, alignItems: 'center' },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 8 },
  metricLabel: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  projectionCard: { backgroundColor: COLORS.card, margin: 16, borderRadius: 16, padding: 20 },
  projectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  projectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginLeft: 8 },
  projectionValue: { fontSize: 28, fontWeight: 'bold', color: COLORS.success },
  projectionNote: { fontSize: 13, color: COLORS.textLight, marginTop: 8 },
  calculationCard: { backgroundColor: COLORS.card, margin: 16, marginTop: 0, borderRadius: 16, padding: 20 },
  calculationTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  calculationRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  calcLabel: { fontSize: 15, color: COLORS.textLight },
  calcValue: { fontSize: 15, fontWeight: '500' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  calcLabelBold: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  calcValueBold: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
});
