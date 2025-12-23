# 🍚 Auner Arroz - Documentación Completa

## Estado del Proyecto: 95% Completado

---

## ✅ LO QUE ESTÁ LISTO

### 1. Código Fuente

| Componente                       | Estado   | Ubicación                |
| -------------------------------- | -------- | ------------------------ |
| App Móvil (17 pantallas)         | ✅ Listo | `mobile/src/screens/`    |
| Sitio Web Landing                | ✅ Listo | `web/src/`               |
| Navegación                       | ✅ Listo | `mobile/src/navigation/` |
| Contextos (Auth, Cart)           | ✅ Listo | `mobile/src/context/`    |
| Servicios (Supabase, Cloudinary) | ✅ Listo | `mobile/src/services/`   |

### 2. Configuraciones

| Servicio   | Estado         | Credenciales                             |
| ---------- | -------------- | ---------------------------------------- |
| Supabase   | ✅ Configurado | URL: `hseldgqfznfpaombplkm.supabase.co`  |
| Cloudinary | ✅ Configurado | Cloud: `dwkyhx804`, Preset: `Aunerarroz` |
| WhatsApp   | ✅ Configurado | `+573137471549`                          |

### 3. Base de Datos (Supabase)

**10 tablas creadas:**

- `users` - Clientes y admin
- `dishes` - Platos del menú (7 platos iniciales)
- `orders` - Pedidos
- `points_codes` - Códigos de puntos
- `points_transactions` - Historial de puntos
- `inventory` - Inventario (8 productos iniciales)
- `expenses` - Gastos
- `manual_sales` - Ventas manuales
- `suggestions` - Sugerencias de clientes
- `reviews` - Reseñas

### 4. Despliegues

| Plataforma    | Estado       | URL                                         |
| ------------- | ------------ | ------------------------------------------- |
| GitHub        | ✅ Subido    | https://github.com/ESTILO-TITAN/AUNER-ARROZ |
| Netlify (Web) | ✅ Publicado | https://auner-arroz.netlify.app             |

---

## ⏳ LO QUE FALTA (Pendiente)

### Compilar APK de Android

**Pasos a seguir:**

```bash
# 1. Ir a la carpeta del proyecto móvil
cd "c:\Users\Usuario\OneDrive\Documentos\AUNER ARROZ\mobile"

# 2. Iniciar sesión en Expo (crear cuenta gratis en expo.dev si no tienes)
eas login

# 3. Compilar la APK (toma ~15-20 minutos)
eas build --platform android --profile preview
```

> 📥 Al finalizar, recibirás un **link de descarga** del APK.

---

## 📱 FUNCIONALIDADES DE LA APP

### Para Clientes

| Función               | Descripción                                               |
| --------------------- | --------------------------------------------------------- |
| 🍽️ Ver Menú           | Lista de platos con fotos/videos, precios                 |
| 🛒 Carrito            | Añadir productos, ajustar cantidades                      |
| 📲 Pedir por WhatsApp | Envía pedido formateado al restaurante                    |
| ⭐ Sistema de Puntos  | Reclamar códigos 3 dígitos (50 pts) o 5 dígitos (350 pts) |
| 💬 Sugerencias        | Enviar comentarios al admin                               |

### Para Admin (Login: AUNER MASA / Arroz6000+2000)

| Función       | Descripción                                  |
| ------------- | -------------------------------------------- |
| 📊 Dashboard  | KPIs, pedidos recientes, estadísticas        |
| 📋 Pedidos    | Ver y confirmar pedidos pendientes           |
| 📦 Inventario | Control de stock con alertas                 |
| 💰 Ventas     | Resumen por período, proyecciones            |
| 💸 Gastos     | Compras y gastos hormiga                     |
| 👥 Clientes   | Estadísticas y clientes recurrentes          |
| 🎟️ Puntos     | Generar códigos (50 en 50), gestionar puntos |
| 🍽️ Menú       | CRUD de platos, subir fotos/videos           |
| 💬 Mensajes   | Ver sugerencias, responder, dar likes        |

---

## 🔐 CREDENCIALES

### Admin de la App

- **Usuario:** `AUNER MASA`
- **Contraseña:** `Arroz6000+2000`

### Sistema de Puntos

- Código 3 dígitos = **50 puntos** (por comer)
- Código 5 dígitos = **350 puntos** (por referir)
- Mínimo para canjear = **6,000 puntos**

---

## 🌐 URLS Y RECURSOS

| Recurso              | URL                                                         |
| -------------------- | ----------------------------------------------------------- |
| Sitio Web            | https://auner-arroz.netlify.app                             |
| Código Fuente        | https://github.com/ESTILO-TITAN/AUNER-ARROZ                 |
| Supabase Dashboard   | https://supabase.com/dashboard/project/hseldgqfznfpaombplkm |
| Cloudinary Dashboard | https://console.cloudinary.com                              |

---

## 📁 ESTRUCTURA DEL PROYECTO

```
AUNER ARROZ/
├── mobile/                      # App React Native
│   ├── src/
│   │   ├── config/constants.js  # Credenciales
│   │   ├── context/             # AuthContext, CartContext
│   │   ├── navigation/          # AppNavigator
│   │   ├── screens/
│   │   │   ├── public/          # Menú, Carrito, Pedido
│   │   │   ├── auth/            # Login, Registro
│   │   │   ├── client/          # Perfil, Puntos, Sugerencias
│   │   │   └── admin/           # Dashboard, Pedidos, etc.
│   │   └── services/            # Supabase, Cloudinary
│   ├── app.json                 # Config Expo
│   └── eas.json                 # Config EAS Build
│
├── web/                         # Sitio Web (Vite + React)
│   └── src/
│       ├── App.jsx              # Landing page
│       └── index.css            # Estilos
│
├── supabase_schema.sql          # SQL de las tablas
└── README.md
```

---

## 📝 NOTAS IMPORTANTES

1. **WhatsApp:** Usa enlaces `wa.me/` tradicionales, no API
2. **Imágenes:** Se transforman a WebP en Cloudinary
3. **Videos:** Se optimizan a 720p en Cloudinary
4. **Sesiones:** AsyncStorage para persistencia local
5. **Compilación APK:** Usa EAS Build (gratis, en la nube)

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DE TENER LA APK

1. **Descargar el APK** del link que da EAS Build
2. **Subir el APK** al sitio web (o compartir link directo)
3. **Probar** la app en un celular Android
4. **Agregar platos reales** con fotos desde el panel admin
5. **Generar códigos de puntos** para los clientes
