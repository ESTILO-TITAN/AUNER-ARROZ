import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../config/constants';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Todos' },
    { id: 'pending', name: 'Pendientes' },
    { id: 'confirmed', name: 'Confirmados' },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      // Datos de ejemplo
      setOrders([
        {
          id: 1,
          customer_name: 'Juan Pérez',
          customer_cedula: '1234567890',
          customer_address: 'Calle 1 #2-3, Barrio Centro',
          customer_whatsapp: '3001234567',
          items: [
            { name: 'Menú del Día', quantity: 2, price: 12000 },
            { name: 'Limonada', quantity: 2, price: 3000 },
          ],
          total: 30000,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          customer_name: 'María García',
          customer_cedula: '0987654321',
          customer_address: 'Carrera 5 #10-20',
          customer_whatsapp: '3009876543',
          items: [
            { name: 'Menú Ejecutivo', quantity: 1, price: 18000 },
          ],
          total: 18000,
          status: 'confirmed',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleConfirmOrder = async (order) => {
    Alert.alert(
      'Confirmar Pedido',
      `¿Confirmar el pedido de ${order.customer_name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('orders')
                .update({ status: 'confirmed' })
                .eq('id', order.id);

              if (!error) {
                setOrders(orders.map(o =>
                  o.id === order.id ? { ...o, status: 'confirmed' } : o
                ));
                Alert.alert('¡Listo!', 'Pedido confirmado');
              }
            } catch (error) {
              console.error('Error confirmando pedido:', error);
              // Simular cambio
              setOrders(orders.map(o =>
                o.id === order.id ? { ...o, status: 'confirmed' } : o
              ));
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredOrders = selectedFilter === 'all'
    ? orders
    : orders.filter(o => o.status === selectedFilter);

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderCustomerInfo}>
          <Text style={styles.customerName}>{item.customer_name}</Text>
          <Text style={styles.orderTime}>
            {new Date(item.created_at).toLocaleString('es-CO', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'pending' ? '#FFF3E0' : '#E8F5E9' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'pending' ? '#FF9800' : '#4CAF50' }
          ]}>
            {item.status === 'pending' ? 'Pendiente' : 'Confirmado'}
          </Text>
        </View>
      </View>

      {/* Datos del cliente */}
      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.detailText}>C.C. {item.customer_cedula}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.detailText}>{item.customer_address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
          <Text style={styles.detailText}>{item.customer_whatsapp}</Text>
        </View>
      </View>

      {/* Items del pedido */}
      <View style={styles.itemsContainer}>
        {item.items?.map((product, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemQuantity}>{product.quantity}x</Text>
            <Text style={styles.itemName}>{product.name}</Text>
            <Text style={styles.itemPrice}>
              {formatCurrency(product.price * product.quantity)}
            </Text>
          </View>
        ))}
      </View>

      {/* Total y acciones */}
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(item.total)}</Text>
        </View>

        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirmOrder(item)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <View style={styles.container}>
      {/* Header con contador */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pedidos</Text>
        {pendingCount > 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>{pendingCount} pendientes</Text>
          </View>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive,
            ]}>
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de pedidos */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No hay pedidos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.card,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.background,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 12,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderCustomerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderTime: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  customerDetails: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  itemsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
  },
  totalLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 12,
  },
});
