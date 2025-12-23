import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../config/constants';

export default function MessagesScreen({ navigation }) {
  const [suggestions, setSuggestions] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    // Datos de ejemplo
    setSuggestions([
      { id: 1, user_email: 'juan@gmail.com', message: 'Sería genial tener más opciones vegetarianas en el menú', created_at: new Date().toISOString(), liked: false, admin_response: null },
      { id: 2, user_email: 'maria@gmail.com', message: 'El servicio fue excelente, muy amables todos. ¡Gracias!', created_at: new Date(Date.now() - 86400000).toISOString(), liked: true, admin_response: '¡Gracias María! Nos alegra mucho' },
      { id: 3, user_email: 'carlos@gmail.com', message: 'Podrían agregar más mesas afuera, el lugar se llena mucho', created_at: new Date(Date.now() - 172800000).toISOString(), liked: false, admin_response: null },
    ]);
  };

  const handleLike = (suggestion) => {
    setSuggestions(suggestions.map(s =>
      s.id === suggestion.id ? { ...s, liked: !s.liked } : s
    ));
  };

  const handleReply = (suggestion) => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Escribe una respuesta');
      return;
    }
    setSuggestions(suggestions.map(s =>
      s.id === suggestion.id ? { ...s, admin_response: replyText } : s
    ));
    setReplyText('');
    setReplyingTo(null);
    Alert.alert('¡Listo!', 'Respuesta enviada');
  };

  const renderSuggestion = ({ item }) => (
    <View style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.user_email.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userEmail}>{item.user_email}</Text>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleLike(item)}>
          <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={24} color={item.liked ? COLORS.danger : COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <Text style={styles.message}>{item.message}</Text>

      {item.admin_response ? (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Tu respuesta:</Text>
          <Text style={styles.responseText}>{item.admin_response}</Text>
        </View>
      ) : replyingTo === item.id ? (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Escribe tu respuesta..."
            placeholderTextColor={COLORS.textLight}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <View style={styles.replyActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setReplyingTo(null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={() => handleReply(item)}>
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.replyButton} onPress={() => setReplyingTo(item.id)}>
          <Ionicons name="chatbubble-outline" size={16} color={COLORS.primary} />
          <Text style={styles.replyButtonText}>Responder</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const unread = suggestions.filter(s => !s.admin_response && !s.liked).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sugerencias</Text>
        {unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unread} nuevas</Text>
          </View>
        )}
      </View>

      <FlatList
        data={suggestions}
        renderItem={renderSuggestion}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginLeft: 16 },
  unreadBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  listContainer: { padding: 16 },
  suggestionCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 12 },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  userEmail: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  date: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  message: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  responseContainer: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginTop: 12 },
  responseLabel: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  responseText: { fontSize: 14, color: COLORS.text },
  replyContainer: { marginTop: 12 },
  replyInput: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, fontSize: 14, color: COLORS.text, minHeight: 60 },
  replyActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 8 },
  cancelText: { color: COLORS.textLight },
  sendButton: { backgroundColor: COLORS.primary, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  replyButton: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  replyButtonText: { color: COLORS.primary, marginLeft: 6, fontWeight: '500' },
});
