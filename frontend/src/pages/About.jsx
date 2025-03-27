//About.jsx
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import SuiviIcon from '../assets/icon-suivi.png';
import RapportIcon from '../assets/icon-rapport.png';
import logo from  '../assets/logo-digital-market.png';
import InnovationIcon from '../assets/innovation-icon.png';
import TransparenceIcon from '../assets/transparence-icon.png';
import ExcellenceIcon from '../assets/excellence-icon.png';

const About = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Digital Market Logo" className="logo-image" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/about">À propos</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/contact">Contactez-nous</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>RESULTATS MESURABLES, VISIBILITÉ ACCRUE</h1>
          <h2>Ce que vous obtenez avec Digital Market</h2>
          
          <div className="about-content">
            <p>
              Lorsque vous collaborez avec Digital Market, vous obtenez bien plus qu'un simple service de marketing digital. 
              Nous offrons une expertise personnalisée pour développer votre présence en ligne et atteindre vos objectifs commerciaux.
            </p>
            
            <div className="about-features">
              <div className="feature-item">
                <img src={SuiviIcon} alt="Suivi" className="feature-icon" />
                <h3>Analyse approfondie</h3>
                <p>Audit complet de vos besoins et stratégie sur mesure</p>
              </div>
              
              <div className="feature-item">
                <img src={RapportIcon} alt="Optimisation" className="feature-icon" />
                <h3>Optimisation continue</h3>
                <p>Suivi régulier et ajustements aux tendances du marché</p>
              </div>
            </div>
            
            <p>
              Après une analyse approfondie de vos besoins, nous proposons des solutions stratégiques adaptées à votre marché. 
              Une équipe dédiée optimise chaque aspect de votre projet, tout en assurant un suivi régulier pour améliorer constamment 
              vos performances et vous ajuster aux tendances du marché.
            </p>
          </div>
        </div>
      </section>
       {/* Nouvelle section Nos Valeurs */}
       <section className="values-section">
        <div className="values-content">
          <h2>Nos valeurs</h2>
          
          <div className="values-grid">
            <div className="value-item">
              <img src={InnovationIcon} alt="Innovation" className="value-icon" />
              <h3>Innovation</h3>
              <p>
                Nous croyons fermement que l'innovation est la clé du succès dans le monde digital. 
                Nous nous efforçons d'adopter les dernières technologies et tendances pour offrir 
                des solutions créatives et avant-gardistes à nos clients.
              </p>
            </div>

            <div className="value-item">
              <img src={TransparenceIcon} alt="Transparence" className="value-icon" />
              <h3>Transparence</h3>
              <p>
                La confiance est primordiale dans toute collaboration. C'est pourquoi nous prônons 
                une communication transparente à chaque étape de votre projet, en partageant clairement 
                les résultats, les progrès et les ajustements nécessaires.
              </p>
            </div>

            <div className="value-item">
              <img src={ExcellenceIcon} alt="Excellence" className="value-icon" />
              <h3>Excellence</h3>
              <p>
                L'excellence est au cœur de tout ce que nous faisons. Nous cherchons toujours à surpasser 
                les attentes de nos clients, en assurant un service de haute qualité, basé sur une attention 
                aux détails et un suivi rigoureux.
              </p>
            </div>
          </div>
        </div>
      </section>

     {/* Footer */}
<footer className="main-footer">
  <div className="footer-content">
    {/* Colonne Solutions */}
    <div className="footer-column">
      <h4>SOLUTIONS</h4>
      <ul className="footer-links">
        <li>Création de stratégie Marketing Digital</li>
        <li>Gestion des fiches Google My Business</li>
        <li>Développement mobile</li>
        <li>Contact</li>
        <li>Optimisation De Stratégie SEO</li>
        <li>Gestion des réseaux sociaux</li>
        <li>Développement web</li>
      </ul>
    </div>

    {/* Colonne Contact */}
    <div className="footer-column">
      <h4>NOUS CONTACTER</h4>
      <div className="contact-info">
        <p className="contact-text">
          Nous sommes là pour faire grandir votre activité
        </p>
        <div className="contact-details">
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <a href="tel:+21655619993" className="contact-link">+216 55 619 993</a>
          </div>
          
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <a href="mailto:contact@digital-market.fr" className="contact-link">contact@digital-market.fr</a>
          </div>
          
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>3 Digital Market, QP54+QC9, Sahline</span>
          </div>
          
          <a 
            href="https://www.google.com/maps/place/Digital+Market/@35.7600816,10.7056202,16z/data=!4m6!3m5!1s0x1302138bcd34f905:0x8db59969fef815a!8m2!3d35.7596506!4d10.705867!16s%2Fg%2F11fq8qtfmm?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D"
            target="_blank" 
            rel="noopener noreferrer" 
            className="map-link"
          >
            © Voir sur la carte
          </a>
        </div>
      </div>
    </div>

    {/* Réseaux sociaux */}
    <div className="footer-column social-column">
      <h4>SUIVEZ-NOUS</h4>
      <div className="social-icons">
        <a href="https://www.facebook.com/Digitalmarket.tn/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.linkedin.com/company/digital-market-tn/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="https://www.instagram.com/digital.market.tn/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="copyright">
    <p>© 2025 Digital Market. Tous droits réservés</p>
  </div>
</footer>
    </div>
  );
};

export default About;