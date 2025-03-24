import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Fichier CSS séparé (optionnel)
import logo from  '../assets/images.png'
const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
        <Link to="/">
          <img 
            src={logo} 
            alt="Digital Market Logo" 
            className="logo-image"
          />
        </Link>
        </div>
        <div className="nav-links">
          <Link to="/about">À propos</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/contact">Contactez-nous</Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero">
        <h1>Votre gestion simplifiée, du planning des taches</h1>
        <p>
          Le logiciel RH pensé pour les équipes opérationnelles. Plus de visibilité, 
          conformité et performance, avec un outil que vos équipes et managers vont adorer.
        </p>
      </section>

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
        <p>© 2025 digital market. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;