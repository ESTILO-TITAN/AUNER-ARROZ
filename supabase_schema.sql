-- =====================================================
-- AUNER ARROZ - Esquema de Base de Datos para Supabase
-- =====================================================
-- Ejecutar este SQL en: https://supabase.com/dashboard/project/hseldgqfznfpaombplkm/sql/new

-- 1. Tabla de usuarios (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  cedula TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  points INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de platos del menú
CREATE TABLE IF NOT EXISTS public.dishes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT DEFAULT 'menu' CHECK (category IN ('menu', 'adicional')),
  image_url TEXT,
  video_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  customer_name TEXT NOT NULL,
  customer_cedula TEXT,
  customer_address TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de códigos de puntos
CREATE TABLE IF NOT EXISTS public.points_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  points INTEGER NOT NULL,
  type TEXT CHECK (type IN ('visit', 'referral')),
  used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES public.users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de transacciones de puntos
CREATE TABLE IF NOT EXISTS public.points_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed')),
  points INTEGER NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de inventario
CREATE TABLE IF NOT EXISTS public.inventory (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_stock DECIMAL(10,2) DEFAULT 0,
  cost_per_unit INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de gastos
CREATE TABLE IF NOT EXISTS public.expenses (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT DEFAULT 'purchase' CHECK (type IN ('purchase', 'ant', 'other')),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla de ventas manuales
CREATE TABLE IF NOT EXISTS public.manual_sales (
  id SERIAL PRIMARY KEY,
  description TEXT,
  amount INTEGER NOT NULL,
  items_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabla de sugerencias
CREATE TABLE IF NOT EXISTS public.suggestions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  user_email TEXT,
  message TEXT NOT NULL,
  liked BOOLEAN DEFAULT false,
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabla de reseñas (para el sitio web)
CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Platos del menú
INSERT INTO public.dishes (name, description, price, category) VALUES
  ('Menú del Día', 'Arroz, proteína del día, ensalada y bebida', 12000, 'menu'),
  ('Menú Ejecutivo', 'Arroz, proteína premium, ensalada, sopa y bebida', 18000, 'menu'),
  ('Menú Especial', 'Arroz, doble proteína, ensalada, sopa, postre y bebida', 25000, 'menu'),
  ('Asadura de Chivo', 'Porción de asadura de chivo', 8000, 'adicional'),
  ('Huevo Cocido', 'Huevo cocido', 2000, 'adicional'),
  ('Limonada', 'Limonada natural', 3000, 'adicional'),
  ('Jugo Natural', 'Jugo de fruta natural', 4000, 'adicional');

-- Inventario inicial
INSERT INTO public.inventory (name, quantity, unit, min_stock) VALUES
  ('Arroz', 50, 'kg', 20),
  ('Pollo', 15, 'kg', 10),
  ('Carne', 10, 'kg', 8),
  ('Cerdo', 8, 'kg', 5),
  ('Aceite', 12, 'L', 5),
  ('Limones', 100, 'unid', 50),
  ('Azúcar', 10, 'kg', 5),
  ('Asadura de chivo', 5, 'kg', 3);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para dishes (lectura pública)
CREATE POLICY "Dishes are viewable by everyone" ON public.dishes
  FOR SELECT USING (active = true);

CREATE POLICY "Dishes are editable by admins" ON public.dishes
  FOR ALL USING (true);

-- Políticas para users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Políticas para points_transactions
CREATE POLICY "Users can view own points" ON public.points_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para suggestions
CREATE POLICY "Users can create suggestions" ON public.suggestions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own suggestions" ON public.suggestions
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas públicas para reviews aprobadas
CREATE POLICY "Approved reviews are public" ON public.reviews
  FOR SELECT USING (approved = true);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON public.dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ¡LISTO! Las tablas están creadas
-- =====================================================
