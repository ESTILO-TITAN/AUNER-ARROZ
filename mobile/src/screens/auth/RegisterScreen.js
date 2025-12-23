import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config/constants';

export default function RegisterScreen({ navigation, route }) {
  const { registerClient, verifyCode } = useAuth();
  const mode = route?.params?.mode || 'register'; // 'register' o 'recover'
  const initialEmail = route?.params?.email || '';

  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Contraseña
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!email.includes('@gmail.com') && !email.includes('@')) {
      Alert.alert('Error', 'Por favor usa un correo válido');
      return;
    }

    setLoading(true);
    
    if (mode === 'register') {
      // Registro: envía código al crear cuenta
      const { success, error } = await registerClient(email, '123456temp');
      setLoading(false);

      if (success || error?.includes('already registered')) {
        Alert.alert('Código Enviado', 'Te hemos enviado un código a tu correo');
        setStep(2);
      } else {
        Alert.alert('Error', error || 'No se pudo enviar el código');
      }
    } else {
      // Ya se envió el código desde la pantalla de login
      setLoading(false);
      setStep(2);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 6) {
      Alert.alert('Error', 'El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);
    const { success, error } = await verifyCode(email, code);
    setLoading(false);

    if (success) {
      if (mode === 'register') {
        Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido verificada');
        navigation.navigate('Login');
      } else {
        setStep(3); // Ir a cambiar contraseña
      }
    } else {
      Alert.alert('Error', error || 'Código incorrecto');
    }
  };

  const handleSetPassword = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    // Aquí iría la lógica para actualizar la contraseña
    // Por ahora simulamos éxito
    setLoading(false);
    
    Alert.alert('¡Listo!', 'Tu contraseña ha sido actualizada', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>
        {mode === 'register' ? '📧 Ingresa tu correo' : '🔑 Recuperar contraseña'}
      </Text>
      <Text style={styles.stepDescription}>
        {mode === 'register'
          ? 'Te enviaremos un código de verificación'
          : 'Ingresa el código que recibiste en tu correo'}
      </Text>

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
          editable={!initialEmail}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Enviando...' : 'Enviar Código'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>📱 Ingresa el código</Text>
      <Text style={styles.stepDescription}>
        Revisa tu correo {email} y escribe el código de 6 dígitos
      </Text>

      <View style={styles.codeContainer}>
        <TextInput
          style={styles.codeInput}
          placeholder="000000"
          placeholderTextColor={COLORS.textLight}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verificando...' : 'Verificar Código'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
        <Text style={styles.backText}>← Cambiar correo</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>🔐 Nueva contraseña</Text>
      <Text style={styles.stepDescription}>
        Crea una contraseña segura para tu cuenta
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
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

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor={COLORS.textLight}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Guardando...' : 'Guardar Contraseña'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'register' ? 'Crear Cuenta' : 'Recuperar Contraseña'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress */}
        <View style={styles.progress}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                step >= s && styles.progressDotActive,
                mode === 'register' && s === 3 && styles.progressDotHidden,
              ]}
            />
          ))}
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        {/* Ir a login */}
        {step === 1 && mode === 'register' && (
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  progressDotHidden: {
    opacity: 0,
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  codeContainer: {
    marginBottom: 16,
  },
  codeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
