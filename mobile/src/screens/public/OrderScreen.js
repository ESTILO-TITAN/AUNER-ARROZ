import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../services/supabase';
import { COLORS, RESTAURANT_WHATSAPP } from '../../config/constants';

export default function OrderScreen({ navigation }) {
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    cedula: '',
    address: '',
    whatsapp: '',
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return false;
    }
    if (!formData.cedula.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu cédula');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Por favor ingresa la dirección de entrega');
      return false;
    }
    if (!formData.whatsapp.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu número de WhatsApp');
      return false;
    }
    return true;
  };

  const buildWhatsAppMessage = () => {
    let message = '🍚 *NUEVO PEDIDO - AUNER ARROZ*\n\n';
    message += '📋 *DATOS DEL CLIENTE:*\n';
    message += `👤 Nombre: ${formData.fullName}\n`;
    message += `🆔 Cédula: ${formData.cedula}\n`;
    message += `📍 Dirección: ${formData.address}\n`;
    message += `📱 WhatsApp: ${formData.whatsapp}\n\n`;
    
    message += '🍽️ *PEDIDO:*\n';
    items.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\n💰 *TOTAL: ${formatPrice(getTotal())}*\n`;
    message += '\n¡Gracias por tu pedido! 🙏';
    
    return encodeURIComponent(message);
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Guardar pedido en la base de datos
      const orderData = {
        customer_name: formData.fullName,
        customer_cedula: formData.cedula,
        customer_address: formData.address,
        customer_whatsapp: formData.whatsapp,
        items: items.map(item => ({
          dish_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotal(),
        status: 'pending', // Estado: pendiente
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) {
        console.log('Error guardando pedido:', error);
        // Continuamos aunque falle el guardado
      }

      // Construir URL de WhatsApp
      const message = buildWhatsAppMessage();
      const whatsappUrl = `whatsapp://send?phone=${RESTAURANT_WHATSAPP}&text=${message}`;
      
      // Intentar abrir WhatsApp
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        
        // Limpiar carrito después de enviar
        Alert.alert(
          '¡Pedido Enviado!',
          'Tu pedido ha sido enviado por WhatsApp. Te contactaremos pronto.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.navigate('Menú');
              },
            },
          ]
        );
      } else {
        // Fallback: usar URL web de WhatsApp
        const webUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${message}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Error enviando pedido:', error);
      Alert.alert('Error', 'No se pudo enviar el pedido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Datos del Pedido</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Resumen del pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Resumen del Pedido</Text>
          {items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={styles.orderItemPrice}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(getTotal())}</Text>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Tus Datos</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor={COLORS.textLight}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.input}
              placeholder="Cédula"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              value={formData.cedula}
              onChangeText={(text) => setFormData({ ...formData, cedula: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.input}
              placeholder="Dirección de entrega"
              placeholderTextColor={COLORS.textLight}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="logo-whatsapp" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.input}
              placeholder="Número de WhatsApp"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
              value={formData.whatsapp}
              onChangeText={(text) => setFormData({ ...formData, whatsapp: text })}
            />
          </View>
        </View>

        {/* Botón de enviar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmitOrder}
          disabled={loading}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>
            {loading ? 'Enviando...' : 'Enviar Pedido por WhatsApp'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Al enviar el pedido, serás redirigido a WhatsApp para confirmar con el restaurante.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  section: {
    backgroundColor: COLORS.card,
    margin: 12,
    marginBottom: 0,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    margin: 12,
    padding: 18,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  disclaimer: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 13,
    marginHorizontal: 24,
    marginBottom: 24,
  },
});
