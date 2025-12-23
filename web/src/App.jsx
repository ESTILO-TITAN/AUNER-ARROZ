import React, { useState, useEffect } from 'react';
import './App.css';

// Iconos SVG inline para evitar dependencias
const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#FFD700' : '#E0E0E0'} width="20" height="20">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function App() {
  const [reviews, setReviews] = useState([
    { id: 1, name: 'María García', rating: 5, text: '¡El mejor arroz del pueblo! Siempre fresco y delicioso. El sistema de puntos es genial.', date: '15 Dic 2024' },
    { id: 2, name: 'Carlos López', rating: 5, text: 'Excelente servicio y la app hace todo más fácil. Muy recomendado.', date: '12 Dic 2024' },
    { id: 3, name: 'Ana Rodríguez', rating: 4, text: 'Buena comida y precios justos. La asadura de chivo está espectacular.', date: '10 Dic 2024' },
  ]);

  const features = [
    { icon: '🍚', title: 'Menú Delicioso', desc: 'Platos caseros preparados con amor y los mejores ingredientes' },
    { icon: '📱', title: 'Pide Fácil', desc: 'Ordena desde tu celular y recibe tu pedido donde estés' },
    { icon: '⭐', title: 'Gana Puntos', desc: 'Acumula puntos por cada visita y canjéalos por premios' },
    { icon: '💬', title: 'WhatsApp', desc: 'Comunicación directa para confirmar tu pedido' },
  ];

  const handleDownload = () => {
    // URL del APK (se actualizará cuando se compile)
    alert('¡Próximamente! La app estará disponible muy pronto para descargar.');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/57XXXXXXXXXX?text=Hola, quiero información sobre Auner Arroz', '_blank');
  };

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-emoji">🍚</div>
          <h1 className="hero-title">Auner Arroz</h1>
          <p className="hero-subtitle">El sabor del pueblo</p>
          <button className="download-btn" onClick={handleDownload}>
            <AndroidIcon />
            Descargar para Android
          </button>
          <p style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
            Versión 1.0.0 • Gratis
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="features" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">Sobre Nosotros</h2>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: '#6C757D', lineHeight: '1.8' }}>
              <strong>Auner Arroz</strong> es más que un restaurante, es tradición. 
              Ubicados en el corazón del pueblo, llevamos años sirviendo los mejores 
              platos caseros con ingredientes frescos y recetas de familia.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#6C757D', lineHeight: '1.8', marginTop: '20px' }}>
              Nuestro menú incluye arroz con diferentes proteínas, asadura de chivo, 
              huevo cocido, limonada natural y mucho más. ¡Ven a visitarnos o pide 
              desde nuestra app!
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <div className="container">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <div className="reviews-container">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="review-avatar">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="review-name">{review.name}</div>
                      <div className="review-date">{review.date}</div>
                    </div>
                  </div>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <StarIcon key={star} filled={star <= review.rating} />
                    ))}
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '60px 20px', 
        background: 'linear-gradient(135deg, #2E4057 0%, #3D5A80 100%)',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          ¿Listo para ordenar?
        </h2>
        <p style={{ opacity: 0.9, marginBottom: '30px', fontSize: '1.1rem' }}>
          Descarga la app o contáctanos por WhatsApp
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="download-btn" onClick={handleDownload}>
            <AndroidIcon />
            Descargar App
          </button>
          <button 
            className="download-btn" 
            onClick={handleWhatsApp}
            style={{ background: '#25D366', color: 'white' }}
          >
            <WhatsAppIcon />
            WhatsApp
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">🍚 Auner Arroz</div>
        <p className="footer-text">El sabor del pueblo</p>
        <div className="footer-social">
          <a href="#" className="social-link" onClick={handleWhatsApp}>
            <WhatsAppIcon />
          </a>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Auner Arroz. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;
