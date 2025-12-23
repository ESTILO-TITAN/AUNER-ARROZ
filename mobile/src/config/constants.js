// Configuración de Supabase para Auner Arroz
// Credenciales configuradas

const SUPABASE_URL = "https://hseldgqfznfpaombplkm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ijnAeydJE6mnWO7nNma41Q_DRl2SUDs";

export { SUPABASE_URL, SUPABASE_ANON_KEY };

// Credenciales del Admin (fijas según especificación)
export const ADMIN_CREDENTIALS = {
  username: "AUNER MASA",
  password: "Arroz6000+2000",
};

// Configuración de Cloudinary
export const CLOUDINARY_CONFIG = {
  cloudName: "dwkyhx804",
  uploadPreset: "Aunerarroz", // Preset sin firmar
};

// WhatsApp del restaurante
export const RESTAURANT_WHATSAPP = "+573137471549";

// Sistema de puntos
export const POINTS_CONFIG = {
  POINTS_PER_VISIT: 50, // Código de 3 dígitos
  POINTS_PER_REFERRAL: 350, // Código de 5 dígitos
  MINIMUM_REDEEM: 6000, // Mínimo para canjear
  CODES_PER_BATCH: 50, // Códigos por generación
};

// Colores de la app
export const COLORS = {
  primary: "#FF6B35", // Naranja cálido (comida)
  secondary: "#2E4057", // Azul oscuro
  accent: "#048A81", // Verde azulado
  background: "#F8F9FA", // Gris muy claro
  card: "#FFFFFF",
  text: "#1A1A2E",
  textLight: "#6C757D",
  success: "#28A745",
  warning: "#FFC107",
  danger: "#DC3545",
  border: "#E9ECEF",
};
