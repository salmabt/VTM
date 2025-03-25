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

      <footer>
        <p>© 2025 Digital Market. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default About;