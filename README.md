# 🍚 Auner Arroz - Sistema de Restaurante

Sistema completo de gestión para restaurante con app Android y sitio web.

## 🌐 Enlaces

- **Sitio Web:** https://auner-arroz.netlify.app
- **Repositorio:** https://github.com/ESTILO-TITAN/AUNER-ARROZ

## 📱 Tecnologías

- **App Móvil:** React Native + Expo
- **Sitio Web:** React + Vite
- **Backend:** Supabase (Auth + Database)
- **Media:** Cloudinary
- **Compilación APK:** EAS Build

## 🔐 Credenciales Admin

- **Usuario:** `AUNER MASA`
- **Contraseña:** `Arroz6000+2000`

## ⭐ Sistema de Puntos

| Código              | Puntos    | Descripción |
| ------------------- | --------- | ----------- |
| 3 dígitos           | 50 pts    | Por comer   |
| 5 dígitos           | 350 pts   | Por referir |
| Mínimo para canjear | 6,000 pts |             |

## 🛠️ Desarrollo Local

### App móvil

```bash
cd mobile
pnpm install
pnpm start  # Escanea QR con Expo Go
```

### Sitio web

```bash
cd web
pnpm install
pnpm dev
```

## 📦 Compilar APK

```bash
cd mobile
eas login          # Inicia sesión en Expo
eas build --platform android --profile preview
```

## 📁 Estructura

```
├── mobile/           # App React Native
│   ├── src/screens/  # 17 pantallas
│   ├── app.json      # Config Expo
│   └── eas.json      # Config EAS Build
├── web/              # Sitio Web
└── supabase_schema.sql  # SQL tablas
```

## 📝 Licencia

MIT
