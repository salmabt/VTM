//frontend/src/pages/Homejsxi
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
import SeoIcon from '../assets/seo.png';
import SiteInternetIcon from '../assets/site-internet.png';
import StrategieIcon from '../assets/strategie-seo.png';
import CommuntyIcon from '../assets/communaute.png';
import DesignIcon from '../assets/design graphic.webp';
import AnimationIcon from '../assets/animation 3 d.webp';
import UIXIcon from '../assets/uiux.png';
import EquipeIcon from '../assets/equipe.png';
import GoogleIcon from '../assets/google-logo.png';
import AppmobileIcon from '../assets/application-mobile.png';
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

{/* Remplacez cette section */}
<section className="solutions-section">
<div className="solutions-header">
    {/* Titre à droite */}
    <div className="solution-title-container">
      <h5>Que Faisons-Nous?</h5>
      <h1>Nos Solutions : Réponses Complètes à Vos Défis Digitaux</h1>
    </div>
    
    {/* Paragraphe à gauche */}
    <div className="solution-subtitle-container">
      <p className="solutions-subtitle">
        Notre agence transforme vos idées en succès grâce à des solutions créatives, 
        sur-mesure et performantes. Nous boostons votre visibilité en ligne tout 
        en vous aidant à atteindre vos objectifs de manière efficace et durable.
      </p>
      <Link to="/about" className="voir-plus-link">
    VOIR PLUS
  </Link>
    </div>
  </div>

    <div className="solutions-grid">
      {/* Solution 1 */}
      <div className="solution-card">
        <div className="solution-number">1</div>
        <h3>Boostez 
        <br/>votre visibilité en ligne</h3>
        <p>
          Grâce à nos stratégies de marketing digital sur mesure, nous augmentons 
          votre présence sur les moteurs de recherche et les réseaux sociaux, 
          attirant plus de trafic qualifié vers votre site.
        </p>
      </div>

      {/* Solution 2 */}
      <div className="solution-card">
        <div className="solution-number">2</div>
        <h3>Augmentez votre chiffre d’affaires</h3>
        <p>
          Nos solutions de gestion publicitaire et d’optimisation SEO vous permettent 
          de convertir vos prospects en clients, tout en maximisant votre retour 
          sur investissement.
        </p>
      </div>

      {/* Solution 3 */}
      <div className="solution-card">
        <div className="solution-number">3</div>
        <h3>Organisez votre entreprise efficacement</h3>
        <p>
          Avec notre logiciel ERP Gestioner, vous optimisez la gestion de vos 
          opérations internes (comptabilité, CRM, gestion des stocks), pour gagner 
          en productivité et en efficacité.
        </p>
      </div>
  
    
  </div>
</section>
     {/* Remplacez la section Features par ceci */}
<section className="capacities-section">
  <div className="capacities-header">
    <h5>NOS CAPACITÉS</h5>
    <h2>Une entreprise complète, de A à Z</h2>
  </div>

  <div className="solutions-container">
    <h3 className="solutions-title">NOS SOLUTIONS</h3>
    
    <div className="solutions-grid">

{/* Développement web */}
      <div className="solution-card">
      <img src={SiteInternetIcon} alt="siteweb" className="feature-icon" />
        <h4>Développement web</h4>
        
        <p>
          Créez un site web performant et optimisé pour capter l’attention de vos utilisateurs 
          et convertir les visites en clients fidèles.
        </p>
        
      </div>

      {/* SEO */}
      <div className="solution-card">
      <img src={SeoIcon} alt="seo" className="feature-icon" />
        <h4>Optimisation de stratégie SEO</h4>
        <p>
          Développez une stratégie SEO solide pour améliorer votre visibilité et garantir 
          un retour sur investissement mesurable.
        </p>
        
      </div>

      {/* Google My Business */}
      <div className="solution-card">
      <img src={StrategieIcon} alt="seo" className="feature-icon" />
        <h4>Gestion des fiches Google My Business</h4>
        <p>
          Optimisez vos fiches Google My Business pour renforcer votre présence locale 
          et attirer plus de clients dans votre région.
        </p>
       
      </div>

      {/* Marketing digital */}
      <div className="solution-card">
      <img src={DesignIcon} alt="marketingdigital" className="feature-icon" />
        <h4>Création de stratégie marketing digital</h4>
        <p>
          Élaborez une stratégie marketing numérique qui maximise votre visibilité en ligne 
          et engage efficacement votre audience cible.
        </p>
        
      </div>

      {/* Community Management */}
      <div className="solution-card">
      <img src={CommuntyIcon} alt="seo" className="feature-icon" />
        <h4>Community Management</h4>
        <p>
          Boostez votre image de marque et interagissez avec vos clients sur les réseaux sociaux 
          grâce à des campagnes conçues spécialement pour votre entreprise.
        </p>
        
      </div>

      {/* Animation 3D */}
      <div className="solution-card">
      <img src={AnimationIcon} alt="3d" className="feature-icon" />
        <h4>Animation & Design en 3D</h4>
        <p>
          Donnez vie à vos idées avec des animations 3D créatives et captivantes pour attirer 
          l’attention de votre audience.
        </p>
        
      </div>

      {/* Design graphique */}
      <div className="solution-card">
      <img src={StrategieIcon} alt="seo" className="feature-icon" />
        <h4>Design graphique</h4>
        <p>
          Créez une identité visuelle forte avec des designs graphiques qui mettent en valeur 
          votre marque sur tous les supports.
        </p>
        
      </div>

      {/* UI/UX Design */}
      <div className="solution-card">
      <img src={UIXIcon} alt="uix" className="feature-icon" />
        <h4>UI/UX Design</h4>
        <p>
          Optimisez l’expérience utilisateur de votre site ou application pour offrir une navigation 
          fluide et agréable, augmentant ainsi la satisfaction des utilisateurs.
        </p>
       
      </div>
         {/* création de campagnes Google ads
*/}
         <div className="solution-card">
         <img src={GoogleIcon } alt="googleads" className="feature-icon" />
        <h4>création de campagnes Google ads
        </h4>
        <p>
        Lancez des campagnes Google Ads efficaces pour toucher de nouveaux clients et augmenter votre retour sur investissement.
        </p>
       
      </div>
         {/* Développement mobile*/}
         <div className="solution-card">
         <img src={AppmobileIcon} alt="appmobile" className="feature-icon" />
        <h4>Développement mobile</h4>
        <p>
        Concevez des applications mobiles adaptées à vos besoins pour atteindre vos utilisateurs directement sur leurs appareils mobiles.
        </p>
       
      </div>
         {/* Gestion d'entreprise*/}
         <div className="solution-card">
         <img src={EquipeIcon} alt="gestionetreprise" className="feature-icon" />
        <h4>Gestion d'entreprise</h4>
        <p>
        Améliorez vos processus internes et votre stratégie pour une gestion d'entreprise plus efficace et axée sur la croissance.
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

export default Home;
