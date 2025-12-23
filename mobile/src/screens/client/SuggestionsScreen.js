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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../config/constants';

export default function SuggestionsScreen({ navigation }) {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [mySuggestions, setMySuggestions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchMySuggestions();
  }, []);

  const fetchMySuggestions = async () => {
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from('suggestions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setMySuggestions(data);
        }
      }
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
      // Datos de ejemplo
      setMySuggestions([
        {
          id: 1,
          message: 'Sería genial tener más opciones vegetarianas en el menú',
          created_at: new Date().toISOString(),
          liked: true,
          admin_response: null,
        },
        {
          id: 2,
          message: 'El servicio fue excelente, muy amables',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          liked: true,
          admin_response: '¡Gracias por tus palabras! Nos alegra mucho saberlo 😊',
        },
      ]);
    }
  };

  const handleSendSuggestion = async () => {
    if (!suggestion.trim()) {
      Alert.alert('Error', 'Por favor escribe tu sugerencia');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('suggestions')
        .insert([{
          user_id: user?.id || 'anonymous',
          user_email: user?.email,
          message: suggestion.trim(),
          liked: false,
          admin_response: null,
        }]);

      if (error) throw error;

      setSuggestion('');
      fetchMySuggestions();

      Alert.alert(
        '¡Gracias!',
        'Tu sugerencia ha sido enviada. El equipo de Auner Arroz la revisará pronto.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error enviando sugerencia:', error);
      Alert.alert('Error', 'No se pudo enviar la sugerencia. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestion = ({ item }) => (
    <View style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionDate}>
          {new Date(item.created_at).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
        {item.liked && (
          <View style={styles.likedBadge}>
            <Ionicons name="heart" size={14} color={COLORS.danger} />
            <Text style={styles.likedText}>Le gustó</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.suggestionMessage}>{item.message}</Text>
      
      {item.admin_response && (
        <View style={styles.responseContainer}>
          <View style={styles.responseHeader}>
            <Ionicons name="restaurant" size={16} color={COLORS.primary} />
            <Text style={styles.responseLabel}>Respuesta de Auner Arroz:</Text>
          </View>
          <Text style={styles.responseText}>{item.admin_response}</Text>
        </View>
      )}
    </View>
  );

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
          <Text style={styles.headerTitle}>Sugerencias</Text>
          <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
            <Ionicons 
              name={showHistory ? 'create-outline' : 'time-outline'} 
              size={24} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
        </View>

        {!showHistory ? (
          // Formulario de nueva sugerencia
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>💬 Tu opinión nos importa</Text>
            <Text style={styles.formSubtitle}>
              Cuéntanos cómo podemos mejorar o qué te gustaría ver en Auner Arroz
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Escribe tu sugerencia aquí..."
              placeholderTextColor={COLORS.textLight}
              value={suggestion}
              onChangeText={setSuggestion}
              multiline
              numberOfLines={6}
              maxLength={500}
              textAlignVertical="top"
            />

            <Text style={styles.charCount}>{suggestion.length}/500</Text>

            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleSendSuggestion}
              disabled={loading}
            >
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.sendButtonText}>
                {loading ? 'Enviando...' : 'Enviar Sugerencia'}
              </Text>
            </TouchableOpacity>

            {/* Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Ideas de qué puedes sugerir:</Text>
              <Text style={styles.tipItem}>• Nuevos platos que te gustaría probar</Text>
              <Text style={styles.tipItem}>• Mejoras en el servicio</Text>
              <Text style={styles.tipItem}>• Tu experiencia en el restaurante</Text>
              <Text style={styles.tipItem}>• Promociones o eventos especiales</Text>
            </View>
          </View>
        ) : (
          // Historial de sugerencias
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>📋 Mis Sugerencias</Text>
            
            {mySuggestions.length > 0 ? (
              mySuggestions.map(item => (
                <View key={item.id}>
                  {renderSuggestion({ item })}
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyText}>
                  Aún no has enviado sugerencias
                </Text>
              </View>
            )}
          </View>
        )}
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
  formContainer: {
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 20,
    lineHeight: 22,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 150,
  },
  charCount: {
    textAlign: 'right',
    color: COLORS.textLight,
    fontSize: 13,
    marginTop: 8,
  },
  sendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  historyContainer: {
    padding: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  suggestionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionDate: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  likedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likedText: {
    fontSize: 12,
    color: COLORS.danger,
    marginLeft: 4,
    fontWeight: '500',
  },
  suggestionMessage: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  responseContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  responseText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 12,
    textAlign: 'center',
  },
});
