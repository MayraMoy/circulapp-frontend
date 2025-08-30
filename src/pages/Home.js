// pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Aquí irán los estilos

// Iconos con emojis simples
const EcoIcon = () => <span>🌱</span>;
const RecycleIcon = () => <span>♻️</span>;
const PeopleIcon = () => <span>👥</span>;
const LocationIcon = () => <span>📍</span>;
const SecurityIcon = () => <span>🔒</span>;
const StarIcon = () => <span>⭐</span>;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RecycleIcon />,
      title: "Economía Circular",
      description:
        "Da una segunda vida a tus objetos y encuentra lo que necesitas de manera sostenible.",
    },
    {
      icon: <PeopleIcon />,
      title: "Comunidad Local",
      description:
        "Conecta con personas de tu zona y fortalece los lazos comunitarios.",
    },
    {
      icon: <LocationIcon />,
      title: "Cerca de Ti",
      description:
        "Encuentra productos y servicios en tu área local para reducir la huella de carbono.",
    },
    {
      icon: <SecurityIcon />,
      title: "Seguro y Confiable",
      description: "Sistema de reputación y verificación para transacciones seguras.",
    },
  ];

  const stats = [
    { number: "2,500+", label: "Productos Donados", icon: <RecycleIcon /> },
    { number: "1,200+", label: "Usuarios Activos", icon: <PeopleIcon /> },
    { number: "850kg", label: "CO₂ Ahorrado", icon: <EcoIcon /> },
    { number: "98%", label: "Satisfacción", icon: <StarIcon /> },
  ];

  const testimonials = [
    {
      name: "María González",
      location: "Córdoba Capital",
      avatar: "MG",
      text: "CirculApp me ayudó a encontrar muebles perfectos para mi nuevo hogar. ¡Es increíble lo que la gente dona!",
    },
    {
      name: "Juan Pérez",
      location: "Villa Carlos Paz",
      avatar: "JP",
      text: "Logré darle nueva vida a electrodomésticos que ya no usaba. La plataforma es muy fácil de usar.",
    },
    {
      name: "Ana Rodríguez",
      location: "Río Cuarto",
      avatar: "AR",
      text: "Como productora, CirculApp me permite conectar con personas que valoran la sostenibilidad.",
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="nav-container">
          <a href="/" className="logo">
            <EcoIcon /> CirculApp
          </a>
          <div className="nav-buttons">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-outline"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn btn-primary"
            >
              Registrarse
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Conecta, Comparte, <span className="hero-highlight">Cuida</span>
          </h1>
          <p className="hero-subtitle">
            La plataforma que une a tu comunidad para crear un futuro más
            sostenible a través del intercambio responsable
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate("/register")}
              className="btn btn-white"
            >
              Comenzar Ahora →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-outline-white"
            >
              Explorar
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="section-container">
          <div className="section-title">
            <h2>Impacto Real</h2>
            <p className="section-subtitle">
              Números que reflejan nuestro compromiso con la sostenibilidad
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-title">
            <h2>¿Cómo Funciona?</h2>
            <p className="section-subtitle">Simple, seguro y efectivo</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-title">
            <h2>Lo Que Dicen Nuestros Usuarios</h2>
            <p className="section-subtitle">
              Historias reales de impacto positivo
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div className="testimonial-info">
                    <h4>{t.name}</h4>
                    <span className="testimonial-location">📍 {t.location}</span>
                  </div>
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo Para Hacer la Diferencia?</h2>
          <p>
            Únete a nuestra comunidad y comienza a contribuir a un futuro más
            sostenible hoy mismo
          </p>
          <div className="cta-buttons">
            <button
              onClick={() => navigate("/register")}
              className="btn btn-white"
            >
              Crear Cuenta Gratis →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-outline-white"
            >
              Ya Tengo Cuenta
            </button>
          </div>
          <div className="cta-features">
            <span>✓ Gratis para siempre</span>
            <span>✓ Sin comisiones</span>
            <span>✓ 100% seguro</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

