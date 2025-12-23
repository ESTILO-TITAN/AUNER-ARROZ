import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../config/constants';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', type: 'purchase' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (data) setExpenses(data);
    } catch (error) {
      setExpenses([
        { id: 1, description: 'Compra de arroz', amount: 250000, type: 'purchase', created_at: new Date().toISOString() },
        { id: 2, description: 'Gas', amount: 80000, type: 'purchase', created_at: new Date().toISOString() },
        { id: 3, description: 'Taxi', amount: 15000, type: 'ant', created_at: new Date().toISOString() },
        { id: 4, description: 'Compra de pollo', amount: 180000, type: 'purchase', created_at: new Date().toISOString() },
      ]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
  };

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: parseInt(newExpense.amount),
      type: newExpense.type,
      created_at: new Date().toISOString(),
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '', type: 'purchase' });
    setShowForm(false);
  };

  const totalPurchases = expenses.filter(e => e.type === 'purchase').reduce((sum, e) => sum + e.amount, 0);
  const totalAnt = expenses.filter(e => e.type === 'ant').reduce((sum, e) => sum + e.amount, 0);

  const renderExpense = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={[styles.typeIndicator, { backgroundColor: item.type === 'purchase' ? COLORS.primary : COLORS.warning }]} />
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDesc}>{item.description}</Text>
        <Text style={styles.expenseDate}>
          {new Date(item.created_at).toLocaleDateString('es-CO')}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>-{formatCurrency(item.amount)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gastos</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(!showForm)}>
          <Ionicons name={showForm ? 'close' : 'add'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Resumen */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="cart" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.summaryLabel}>Compras</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalPurchases)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="wallet" size={20} color={COLORS.warning} />
          </View>
          <Text style={styles.summaryLabel}>Gastos Hormiga</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalAnt)}</Text>
        </View>
      </View>

      {/* Formulario */}
      {showForm && (
        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Descripción del gasto"
            placeholderTextColor={COLORS.textLight}
            value={newExpense.description}
            onChangeText={t => setNewExpense({ ...newExpense, description: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Monto"
            placeholderTextColor={COLORS.textLight}
            keyboardType="numeric"
            value={newExpense.amount}
            onChangeText={t => setNewExpense({ ...newExpense, amount: t })}
          />
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, newExpense.type === 'purchase' && styles.typeButtonActive]}
              onPress={() => setNewExpense({ ...newExpense, type: 'purchase' })}
            >
              <Text style={[styles.typeText, newExpense.type === 'purchase' && styles.typeTextActive]}>Compra</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, newExpense.type === 'ant' && styles.typeButtonActive]}
              onPress={() => setNewExpense({ ...newExpense, type: 'ant' })}
            >
              <Text style={[styles.typeText, newExpense.type === 'ant' && styles.typeTextActive]}>Hormiga</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleAddExpense}>
            <Text style={styles.saveButtonText}>Guardar Gasto</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista */}
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  addButton: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  summaryContainer: { flexDirection: 'row', padding: 16 },
  summaryCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginRight: 8, alignItems: 'center' },
  summaryIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 12, color: COLORS.textLight },
  summaryValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  formCard: { backgroundColor: COLORS.card, margin: 16, marginTop: 0, borderRadius: 12, padding: 16 },
  input: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 15, color: COLORS.text },
  typeSelector: { flexDirection: 'row', marginBottom: 12 },
  typeButton: { flex: 1, padding: 10, borderRadius: 10, marginRight: 8, backgroundColor: COLORS.background, alignItems: 'center' },
  typeButtonActive: { backgroundColor: COLORS.primary },
  typeText: { color: COLORS.text, fontWeight: '500' },
  typeTextActive: { color: '#fff' },
  saveButton: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listContainer: { padding: 16, paddingTop: 0 },
  expenseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 10, padding: 14, marginBottom: 10 },
  typeIndicator: { width: 4, height: 36, borderRadius: 2, marginRight: 12 },
  expenseInfo: { flex: 1 },
  expenseDesc: { fontSize: 15, color: COLORS.text },
  expenseDate: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  expenseAmount: { fontSize: 15, fontWeight: 'bold', color: COLORS.danger },
});
