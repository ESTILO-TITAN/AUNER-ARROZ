import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../config/constants';

// Pantallas públicas
import MenuScreen from '../screens/public/MenuScreen';
import CartScreen from '../screens/public/CartScreen';
import OrderScreen from '../screens/public/OrderScreen';

// Pantallas de autenticación
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Pantallas de cliente
import ClientProfileScreen from '../screens/client/ProfileScreen';
import ClientPointsScreen from '../screens/client/PointsScreen';
import ClientSuggestionsScreen from '../screens/client/SuggestionsScreen';

// Pantallas de admin
import AdminDashboardScreen from '../screens/admin/DashboardScreen';
import AdminOrdersScreen from '../screens/admin/OrdersScreen';
import AdminMenuScreen from '../screens/admin/MenuAdminScreen';
import AdminInventoryScreen from '../screens/admin/InventoryScreen';
import AdminSalesScreen from '../screens/admin/SalesScreen';
import AdminExpensesScreen from '../screens/admin/ExpensesScreen';
import AdminCustomersScreen from '../screens/admin/CustomersScreen';
import AdminPointsScreen from '../screens/admin/PointsAdminScreen';
import AdminMessagesScreen from '../screens/admin/MessagesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs del cliente
function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Menú') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Puntos') {
            iconName = focused ? 'star' : 'star-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Menú" component={MenuScreen} />
      <Tab.Screen name="Carrito" component={CartScreen} />
      <Tab.Screen name="Puntos" component={ClientPointsScreen} />
      <Tab.Screen name="Perfil" component={ClientProfileScreen} />
    </Tab.Navigator>
  );
}

// Tabs del admin
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Pedidos') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Inventario') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Más') {
            iconName = focused ? 'menu' : 'menu-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        headerStyle: { backgroundColor: COLORS.secondary },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Pedidos" component={AdminOrdersScreen} />
      <Tab.Screen name="Inventario" component={AdminInventoryScreen} />
      <Tab.Screen name="Más" component={AdminMoreStack} />
    </Tab.Navigator>
  );
}

// Stack para opciones adicionales del admin
function AdminMoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminMenu" component={AdminMenuScreen} />
      <Stack.Screen name="AdminSales" component={AdminSalesScreen} />
      <Stack.Screen name="AdminExpenses" component={AdminExpensesScreen} />
      <Stack.Screen name="AdminCustomers" component={AdminCustomersScreen} />
      <Stack.Screen name="AdminPoints" component={AdminPointsScreen} />
      <Stack.Screen name="AdminMessages" component={AdminMessagesScreen} />
    </Stack.Navigator>
  );
}

// Navegación principal
export default function AppNavigator({ userRole }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userRole === null ? (
          // Usuario no autenticado
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="PublicMenu" component={MenuScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Order" component={OrderScreen} />
          </>
        ) : userRole === 'admin' ? (
          // Admin
          <Stack.Screen name="AdminTabs" component={AdminTabs} />
        ) : (
          // Cliente
          <>
            <Stack.Screen name="ClientTabs" component={ClientTabs} />
            <Stack.Screen name="Order" component={OrderScreen} />
            <Stack.Screen name="Suggestions" component={ClientSuggestionsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
