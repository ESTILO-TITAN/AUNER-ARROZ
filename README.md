# Auner Arroz

🍚 Sistema de gestión para restaurante con app Android y sitio web.

## Estructura

```
├── mobile/     # App React Native (Expo)
└── web/        # Sitio web (React + Vite)
```

## Tecnologías

- **Frontend Mobile:** React Native + Expo
- **Frontend Web:** React + Vite
- **Backend:** Supabase (Auth + Database)
- **Media:** Cloudinary (imágenes/videos)
- **Compilación APK:** EAS Build

## Funcionalidades

- 📱 App móvil para Android
- 🍽️ Menú con platos e imágenes/videos
- 🛒 Carrito de compras
- 📲 Pedidos por WhatsApp
- ⭐ Sistema de puntos (códigos 3 y 5 dígitos)
- 👤 Panel de cliente
- 🔧 Panel de administración completo

## Desarrollo

### App móvil

```bash
cd mobile
pnpm install
pnpm start
```

### Sitio web

```bash
cd web
pnpm install
pnpm dev
```

## Compilar APK

```bash
cd mobile
eas build --platform android --profile preview
```

## Licencia

MIT
