import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config/constants';

export default function LoginScreen({ navigation }) {
  const { loginAdmin, loginClient, resetPassword } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleClientLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const { success, error } = await loginClient(email, password);
    setLoading(false);

    if (!success) {
      Alert.alert('Error', error || 'No se pudo iniciar sesión');
    }
  };

  const handleAdminLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const { success, error } = await loginAdmin(username, password);
    setLoading(false);

    if (!success) {
      Alert.alert('Error', error || 'Credenciales incorrectas');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    const { success, error } = await resetPassword(email);
    setLoading(false);

    if (success) {
      Alert.alert(
        'Correo Enviado',
        'Te hemos enviado un código a tu correo para recuperar tu contraseña',
        [{ text: 'OK', onPress: () => navigation.navigate('Register', { mode: 'recover', email }) }]
      );
    } else {
      Alert.alert('Error', error || 'No se pudo enviar el correo');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🍚</Text>
          <Text style={styles.logoTitle}>Auner Arroz</Text>
          <Text style={styles.logoSubtitle}>El sabor del pueblo</Text>
        </View>

        {/* Selector Admin/Cliente */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, !isAdminMode && styles.modeButtonActive]}
            onPress={() => setIsAdminMode(false)}
          >
            <Text style={[styles.modeText, !isAdminMode && styles.modeTextActive]}>
              Cliente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, isAdminMode && styles.modeButtonActive]}
            onPress={() => setIsAdminMode(true)}
          >
            <Text style={[styles.modeText, isAdminMode && styles.modeTextActive]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {isAdminMode ? (
            // Login Admin
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Usuario"
                  placeholderTextColor={COLORS.textLight}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </>
          ) : (
            // Login Cliente
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico (Gmail)"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          {!isAdminMode && (
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={isAdminMode ? handleAdminLogin : handleClientLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Registro (solo clientes) */}
        {!isAdminMode && (
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Continuar sin cuenta */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => navigation.navigate('PublicMenu')}
        >
          <Text style={styles.guestText}>Ver menú sin iniciar sesión</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoEmoji: {
    fontSize: 64,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  logoSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  modeTextActive: {
    color: '#fff',
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  registerText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  guestButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  guestText: {
    color: COLORS.primary,
    fontSize: 15,
    marginRight: 4,
  },
});
