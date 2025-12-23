import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS, POINTS_CONFIG } from '../../config/constants';

export default function PointsAdminScreen() {
  const [codes, setCodes] = useState([]);
  const [clients, setClients] = useState([]);
  const [showGenerate, setShowGenerate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Datos de ejemplo
    setCodes([
      { id: 1, code: '123', type: '3d', used: false },
      { id: 2, code: '456', type: '3d', used: true },
      { id: 3, code: '12345', type: '5d', used: false },
    ]);
    setClients([
      { id: 1, name: 'Juan Pérez', email: 'juan@gmail.com', points: 4500 },
      { id: 2, name: 'María García', email: 'maria@gmail.com', points: 7200 },
      { id: 3, name: 'Carlos López', email: 'carlos@gmail.com', points: 1800 },
    ]);
  };

  const generateCodes = (type) => {
    const newCodes = [];
    const digits = type === '3d' ? 3 : 5;
    for (let i = 0; i < POINTS_CONFIG.CODES_PER_BATCH; i++) {
      const code = Math.floor(Math.random() * Math.pow(10, digits)).toString().padStart(digits, '0');
      newCodes.push({ id: Date.now() + i, code, type, used: false });
    }
    setCodes([...newCodes, ...codes]);
    Alert.alert('¡Listo!', `Se generaron ${POINTS_CONFIG.CODES_PER_BATCH} códigos de ${digits} dígitos`);
    setShowGenerate(false);
  };

  const handleSubtractPoints = (client, amount) => {
    if (client.points < amount) {
      Alert.alert('Error', 'El cliente no tiene suficientes puntos');
      return;
    }
    Alert.alert(
      'Restar Puntos',
      `¿Restar ${amount} puntos a ${client.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restar',
          onPress: () => {
            setClients(clients.map(c =>
              c.id === client.id ? { ...c, points: c.points - amount } : c
            ));
          },
        },
      ]
    );
  };

  const unusedCodes = codes.filter(c => !c.used).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Puntos</Text>
      </View>

      {/* Resumen */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{POINTS_CONFIG.POINTS_PER_VISIT}</Text>
          <Text style={styles.summaryLabel}>Pts/Visita (3 díg)</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{POINTS_CONFIG.POINTS_PER_REFERRAL}</Text>
          <Text style={styles.summaryLabel}>Pts/Referido (5 díg)</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{unusedCodes}</Text>
          <Text style={styles.summaryLabel}>Códigos Libres</Text>
        </View>
      </View>

      {/* Generar códigos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎟️ Generar Códigos</Text>
          <TouchableOpacity onPress={() => setShowGenerate(!showGenerate)}>
            <Ionicons name={showGenerate ? 'chevron-up' : 'chevron-down'} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        {showGenerate && (
          <View style={styles.generateRow}>
            <TouchableOpacity style={styles.generateButton} onPress={() => generateCodes('3d')}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.generateText}>50 códigos (3 díg)</Text>
              <Text style={styles.generatePoints}>{POINTS_CONFIG.POINTS_PER_VISIT} pts c/u</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.generateButton, { backgroundColor: COLORS.accent }]} onPress={() => generateCodes('5d')}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.generateText}>50 códigos (5 díg)</Text>
              <Text style={styles.generatePoints}>{POINTS_CONFIG.POINTS_PER_REFERRAL} pts c/u</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Códigos recientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Códigos Recientes</Text>
        <View style={styles.codesGrid}>
          {codes.slice(0, 12).map(code => (
            <View key={code.id} style={[styles.codeChip, code.used && styles.codeChipUsed]}>
              <Text style={[styles.codeText, code.used && styles.codeTextUsed]}>{code.code}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Clientes y puntos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Puntos de Clientes</Text>
        {clients.map(client => (
          <View key={client.id} style={styles.clientCard}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientEmail}>{client.email}</Text>
            </View>
            <View style={styles.clientPoints}>
              <Text style={[styles.pointsValue, client.points >= POINTS_CONFIG.MINIMUM_REDEEM && { color: COLORS.success }]}>
                {client.points}
              </Text>
              <Text style={styles.pointsLabel}>puntos</Text>
            </View>
            <TouchableOpacity
              style={styles.subtractButton}
              onPress={() => handleSubtractPoints(client, 1000)}
            >
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  summaryRow: { flexDirection: 'row', padding: 16 },
  summaryCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginRight: 8, alignItems: 'center' },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  summaryLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 4, textAlign: 'center' },
  section: { backgroundColor: COLORS.card, margin: 16, marginTop: 0, borderRadius: 16, padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  generateRow: { flexDirection: 'row', marginTop: 8 },
  generateButton: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, marginRight: 8, alignItems: 'center' },
  generateText: { color: '#fff', fontWeight: '600', marginTop: 4 },
  generatePoints: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  codesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  codeChip: { backgroundColor: COLORS.background, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, margin: 4 },
  codeChipUsed: { backgroundColor: '#FFEBEE' },
  codeText: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  codeTextUsed: { color: COLORS.danger, textDecorationLine: 'line-through' },
  clientCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  clientEmail: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  clientPoints: { alignItems: 'center', marginRight: 12 },
  pointsValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  pointsLabel: { fontSize: 11, color: COLORS.textLight },
  subtractButton: { backgroundColor: COLORS.danger, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
