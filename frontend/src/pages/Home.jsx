//Homejsxi
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Fichier CSS séparé (optionnel)
import logo from  '../assets/logo-digital-market.png';
import home from  '../assets/home.png';
import calander from  '../assets/calander.png';
import planningIcon from '../assets/planning-icon.png';
import alertIcon from '../assets/alert-icon.png';
import SuiviIcon from '../assets/icon-suivi.png';
import RapportIcon from '../assets/icon-rapport.png';
import DisponibileIcon from '../assets/icone-disponibilité.png';
import MapsIcon from '../assets/icon-google-maps.png';
const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
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
      
      {/* Hero Section avec mise en page similaire à l'image */}
      <section className="hero">
        <div className="hero-content">
          <h1>Planification rapide et facile</h1>
          <p>
            Nous vous proposons une gamme complète de solutions de 
            planification adaptées à votre activité.
          </p>
          <p><strong>Excellente Gestion de Planning des Techniciens et des Voitures!</strong></p>
         
        </div>
        <div className="hero-image">
        <img src={home} alt="DashboardAdmin"  />
        <img src={calander} alt="Calandrier"  />
        </div>
      </section>

      {/* Nouvelle Section Hero avec fonctionnalités */}
      <section className="hero">
        <div className="hero-content">
          <h1>La gestion du planning devient facile</h1>
          <p>
            Vous aviez peut-être l’habitude de faire votre planning sur Excel mais vous avez des besoins plus complexes ? 
            Il est temps de vous tourner vers un logiciel qui vous permette de gérer le <strong>planning prévisionnel</strong> de votre société.
          </p>
          <p>
            Gérez vos ressources humaines et matérielles ainsi que les congés, rendez-vous, projets, horaires etc. 
            PlanningPME s’adapte à tous les secteurs d’activité et vous permet <strong>d’optimiser votre rentabilité</strong>.
          </p>
          
          <div className="features-list">
            <div className="feature-item">
            <img src={planningIcon} alt="Planning" className="feature-icon" />
              <h3>Affichage simple et précis</h3>
              <p>Prise en main rapide et intuitive pour tous les utilisateurs.</p>
            </div>
            <div className="feature-item">
            <img src={alertIcon} alt="Alertes" className="feature-icon" />
              <h3>Alertes en temps réel</h3>
              <p>Notifications immédiates pour les modifications d'agenda.</p>
            </div>
            <div className="feature-item">
            <img src={SuiviIcon} alt="Suivi en temps réelle" className="feature-icon" />
              <h3>Suivi en temps réel</h3>
              <p>Visualiser les plannings et suivre l’avancement des tâches ,temps d'utilisation des véhicules...</p>
            </div>
            <div className="feature-item">
            <img src={RapportIcon} alt="Rapport détailler" className="feature-icon" />
              <h3>Analyses approfondies</h3>
              <p>Générez des rapports personnalisés pour suivre vos performances.</p>
            </div>
            <div className="feature-item">
            <img src={DisponibileIcon} alt="DESponible" className="feature-icon" />
              <h3>Gestion de la disponibilité des techniciens </h3>
              <p>Planifier les interventions et suivre leur charge de travail.</p>
            </div> 
            <div className="feature-item">
            <img src={MapsIcon} alt="maps" className="feature-icon" />
              <h3> Intégration d'un Google Maps </h3>
              <p>Cette Intégration permet de visualiser les lieux d’interventions.</p>
            </div>
          </div>
        </div>
      </section>

{/* ... Le reste de votre code existant ... */}
      <section className="hero">
        <h1>Nous sommes là pour faire grandir votre activité</h1>
        <p>
        N’hésitez pas à nous contacter via votre méthode préférée. 
        Nous sommes impatients de vous accompagner et de découvrir comment notre équipe de marketing digital peut contribuer à votre succès.
        </p>
      </section>
      {/* Features Section */}
      <section className="features">
        <h2>Nos fonctionnalités clés</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Gestion des plannings</h3>
            <p>Créez et partagez les plannings en quelques clics.</p>
          </div>
          <div className="feature-card">
            <h3>Suivi des présences</h3>
            <p>Suivez et analysez les présences en temps réel.</p>
          </div>
          <div className="feature-card">
            <h3>Gestion de paie</h3>
            <p>Automatisez vos processus de paie simplement.</p>
          </div>
        </div>
      </section>
      

      {/* Footer */}
      <footer>
        <p>© 2025 Digital Market. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;
