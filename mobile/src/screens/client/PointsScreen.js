import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { COLORS, POINTS_CONFIG } from '../../config/constants';

export default function PointsScreen({ navigation }) {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const periods = [
    { id: 'week', name: 'Semana' },
    { id: 'month', name: 'Mes' },
  ];

  useEffect(() => {
    fetchPoints();
    fetchTransactions();
  }, [selectedPeriod]);

  const fetchPoints = async () => {
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('points')
          .eq('id', user.id)
          .single();

        if (data) {
          setPoints(data.points || 0);
        }
      }
    } catch (error) {
      console.error('Error cargando puntos:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      if (user?.id) {
        const now = new Date();
        let startDate;
        
        if (selectedPeriod === 'week') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const { data, error } = await supabase
          .from('points_transactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false });

        if (data) {
          setTransactions(data);
        }
      }
    } catch (error) {
      console.error('Error cargando transacciones:', error);
      // Datos de ejemplo
      setTransactions([
        { id: 1, type: 'earned', points: 50, code: '123', description: 'Por comer', created_at: new Date().toISOString() },
        { id: 2, type: 'earned', points: 350, code: '12345', description: 'Por referir', created_at: new Date(Date.now() - 86400000).toISOString() },
      ]);
    }
  };

  const handleRedeemCode = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Por favor ingresa un código');
      return;
    }

    if (code.length !== 3 && code.length !== 5) {
      Alert.alert('Error', 'El código debe tener 3 o 5 dígitos');
      return;
    }

    setLoading(true);

    try {
      // Verificar si el código existe y es válido
      const { data: codeData, error: codeError } = await supabase
        .from('points_codes')
        .select('*')
        .eq('code', code)
        .eq('used', false)
        .single();

      if (codeError || !codeData) {
        Alert.alert('Error', 'Código inválido o ya utilizado');
        setLoading(false);
        return;
      }

      // Calcular puntos según longitud del código
      const pointsToAdd = code.length === 3 
        ? POINTS_CONFIG.POINTS_PER_VISIT 
        : POINTS_CONFIG.POINTS_PER_REFERRAL;

      // Actualizar puntos del usuario
      const { error: updateError } = await supabase
        .from('users')
        .update({ points: points + pointsToAdd })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Marcar código como usado
      await supabase
        .from('points_codes')
        .update({ used: true, used_by: user.id, used_at: new Date().toISOString() })
        .eq('id', codeData.id);

      // Registrar transacción
      await supabase
        .from('points_transactions')
        .insert([{
          user_id: user.id,
          type: 'earned',
          points: pointsToAdd,
          code: code,
          description: code.length === 3 ? 'Por comer' : 'Por referir amigo',
        }]);

      setPoints(prev => prev + pointsToAdd);
      setCode('');
      fetchTransactions();

      Alert.alert(
        '¡Puntos Reclamados!',
        `Has ganado ${pointsToAdd} puntos`,
        [{ text: '¡Genial!' }]
      );
    } catch (error) {
      console.error('Error reclamando puntos:', error);
      Alert.alert('Error', 'No se pudieron reclamar los puntos');
    } finally {
      setLoading(false);
    }
  };

  const canRedeem = points >= POINTS_CONFIG.MINIMUM_REDEEM;

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={[
        styles.transactionIcon,
        { backgroundColor: item.type === 'earned' ? '#E8F5E9' : '#FFEBEE' }
      ]}>
        <Ionicons
          name={item.type === 'earned' ? 'add-circle' : 'remove-circle'}
          size={24}
          color={item.type === 'earned' ? COLORS.success : COLORS.danger}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.created_at).toLocaleDateString('es-CO')}
        </Text>
      </View>
      <Text style={[
        styles.transactionPoints,
        { color: item.type === 'earned' ? COLORS.success : COLORS.danger }
      ]}>
        {item.type === 'earned' ? '+' : '-'}{item.points}
      </Text>
    </View>
  );

  // Calcular ganados y usados
  const earned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);
  const used = transactions
    .filter(t => t.type === 'used')
    .reduce((sum, t) => sum + t.points, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Card de puntos */}
      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Tus Puntos</Text>
        <View style={styles.pointsRow}>
          <Ionicons name="star" size={40} color="#FFD700" />
          <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
        </View>
        <Text style={styles.pointsInfo}>
          {canRedeem 
            ? '¡Puedes canjear tus puntos!' 
            : `Necesitas ${POINTS_CONFIG.MINIMUM_REDEEM.toLocaleString()} puntos para canjear`}
        </Text>
        
        {/* Barra de progreso */}
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min((points / POINTS_CONFIG.MINIMUM_REDEEM) * 100, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.min(Math.round((points / POINTS_CONFIG.MINIMUM_REDEEM) * 100), 100)}% completado
        </Text>
      </View>

      {/* Reclamar código */}
      <View style={styles.redeemCard}>
        <Text style={styles.sectionTitle}>🎁 Reclamar Puntos</Text>
        <Text style={styles.sectionSubtitle}>
          Ingresa el código que te dio el restaurante
        </Text>
        
        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Código"
            placeholderTextColor={COLORS.textLight}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={5}
          />
          <TouchableOpacity
            style={[styles.redeemButton, loading && styles.redeemButtonDisabled]}
            onPress={handleRedeemCode}
            disabled={loading}
          >
            <Text style={styles.redeemButtonText}>
              {loading ? '...' : 'Reclamar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.codeInfo}>
          <View style={styles.codeInfoItem}>
            <Text style={styles.codeInfoDigits}>3 dígitos</Text>
            <Text style={styles.codeInfoPoints}>= {POINTS_CONFIG.POINTS_PER_VISIT} pts</Text>
          </View>
          <View style={styles.codeInfoItem}>
            <Text style={styles.codeInfoDigits}>5 dígitos</Text>
            <Text style={styles.codeInfoPoints}>= {POINTS_CONFIG.POINTS_PER_REFERRAL} pts</Text>
          </View>
        </View>
      </View>

      {/* Resumen del período */}
      <View style={styles.summaryCard}>
        <View style={styles.periodSelector}>
          {periods.map(period => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.id && styles.periodTextActive
              ]}>
                {period.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ganados</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>+{earned}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Usados</Text>
            <Text style={[styles.summaryValue, { color: COLORS.danger }]}>-{used}</Text>
          </View>
        </View>
      </View>

      {/* Historial */}
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>📋 Historial</Text>
        {transactions.length > 0 ? (
          transactions.map(item => (
            <View key={item.id}>
              {renderTransaction({ item })}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay movimientos en este período</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pointsCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  pointsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  pointsInfo: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 8,
  },
  redeemCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  codeInputContainer: {
    flexDirection: 'row',
  },
  codeInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 4,
  },
  redeemButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  redeemButtonDisabled: {
    opacity: 0.7,
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  codeInfoItem: {
    alignItems: 'center',
  },
  codeInfoDigits: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  codeInfoPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  periodTextActive: {
    color: '#fff',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  historyCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  transactionDate: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  transactionPoints: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 15,
    paddingVertical: 20,
  },
});
