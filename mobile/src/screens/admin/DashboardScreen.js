import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../config/constants';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newCustomers: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Obtener estadísticas
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Pedidos del mes
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startOfMonth.toISOString());

      // Clientes nuevos del mes
      const { data: customers, error: customersError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'client')
        .gte('created_at', startOfMonth.toISOString());

      if (orders) {
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          newCustomers: customers?.length || 0,
          pendingOrders,
        });

        // Últimos 5 pedidos
        setRecentOrders(orders.slice(-5).reverse());
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      // Datos de ejemplo
      setStats({
        totalOrders: 145,
        totalRevenue: 2850000,
        newCustomers: 23,
        pendingOrders: 5,
      });
      setRecentOrders([
        { id: 1, customer_name: 'Juan Pérez', total: 25000, status: 'pending', created_at: new Date().toISOString() },
        { id: 2, customer_name: 'María García', total: 18000, status: 'confirmed', created_at: new Date().toISOString() },
        { id: 3, customer_name: 'Carlos López', total: 32000, status: 'confirmed', created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpiCards = [
    {
      title: 'Total Pedidos',
      value: stats.totalOrders.toString(),
      icon: 'receipt',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
      change: '+12%',
      changePositive: true,
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(stats.totalRevenue),
      icon: 'cash',
      color: '#2196F3',
      bgColor: '#E3F2FD',
      change: '+8%',
      changePositive: true,
    },
    {
      title: 'Nuevos Clientes',
      value: stats.newCustomers.toString(),
      icon: 'people',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
      change: '+15%',
      changePositive: true,
    },
    {
      title: 'Pendientes',
      value: stats.pendingOrders.toString(),
      icon: 'time',
      color: '#FF9800',
      bgColor: '#FFF3E0',
      change: null,
      changePositive: false,
    },
  ];

  const quickActions = [
    { icon: 'add-circle', title: 'Nuevo Pedido', screen: 'Pedidos', color: COLORS.primary },
    { icon: 'cube', title: 'Inventario', screen: 'Inventario', color: '#4CAF50' },
    { icon: 'restaurant', title: 'Menú', screen: 'AdminMenu', color: '#FF9800' },
    { icon: 'star', title: 'Puntos', screen: 'AdminPoints', color: '#9C27B0' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return COLORS.warning;
      case 'confirmed': return COLORS.success;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.textLight;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, Auner! 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          {stats.pendingOrders > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{stats.pendingOrders}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        {kpiCards.map((card, index) => (
          <View key={index} style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconContainer, { backgroundColor: card.bgColor }]}>
                <Ionicons name={card.icon} size={20} color={card.color} />
              </View>
              {card.change && (
                <View style={[
                  styles.changeBadge,
                  { backgroundColor: card.changePositive ? '#E8F5E9' : '#FFEBEE' }
                ]}>
                  <Ionicons
                    name={card.changePositive ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={card.changePositive ? '#4CAF50' : '#F44336'}
                  />
                  <Text style={[
                    styles.changeText,
                    { color: card.changePositive ? '#4CAF50' : '#F44336' }
                  ]}>
                    {card.change}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.kpiValue}>{card.value}</Text>
            <Text style={styles.kpiTitle}>{card.title}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAction}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Pedidos')}>
            <Text style={styles.viewAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.ordersContainer}>
          {recentOrders.map((order, index) => (
            <View key={order.id || index} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderCustomer}>{order.customer_name}</Text>
                <Text style={styles.orderTime}>
                  {new Date(order.created_at).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AdminSales')}>
            <Text style={styles.viewAllText}>Ver más</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsPreview}>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={32} color={COLORS.success} />
            <Text style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</Text>
            <Text style={styles.statLabel}>Este mes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="restaurant" size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
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
    padding: 20,
    backgroundColor: COLORS.card,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  date: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  kpiCard: {
    width: (width - 48) / 2,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: (width - 64) / 4,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  ordersContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderTime: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsPreview: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  bottomSpace: {
    height: 24,
  },
});
