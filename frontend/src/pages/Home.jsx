// frontend/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import logo from '../assets/VTM-logo.png';
import home from '../assets/home.png';
import calander from '../assets/calander.png';
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
import { useState, useEffect } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { FaRobot } from 'react-icons/fa';
import { translations, languageNames } from './translations';
import Chatbot from '../components/Chatbot';
import '../styles/Home.css';
const Home = () => {
  const [language, setLanguage] = useState('fr');
  const [showChat, setShowChat] = useState(false);

  // Language Change
  const changeLanguage = (lng) => {
    setLanguage(lng);
    localStorage.setItem('language', lng);
    document.body.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
  };

  // Initial load
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'fr';
    setLanguage(savedLang);
    document.body.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
  }, []);

  // Items for language dropdown
  const languageItems = [
    { key: 'fr', label: 'Français' },
    { key: 'en', label: 'English' },
    { key: 'ar', label: 'العربية' },
  ];

  // Translation function
  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <div className="home-container">
      {/* Icône de chat flottante */}
      <div className="floating-chat-icon" onClick={() => setShowChat(!showChat)}>
        <FaRobot  style={{ fontSize: '24px', color: 'white' }} />
      </div>

      {/* Chatbot conditionnel */}
      {showChat && (
        <div className="chatbot-wrapper">
          <Chatbot onClose={() => setShowChat(false)} />
        </div>
      )}
      {/* Navbar */}
      <nav className="navbar">
        <div className="logoo">
          <Link to="/">
            <img src={logo} alt="VTM Logo" className="logoo-image" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/about">{t('about')}</Link>
          <Link to="/login">{t('login')}</Link>

          {/* Language Selector */}
          <Dropdown
            menu={{
              items: languageItems,
              onClick: ({ key }) => {
                changeLanguage(key);
                if (key === 'ar' || language === 'ar') {
                  window.location.reload();
                }
              },
            }}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <TranslationOutlined />
              <span>{languageNames[language]}</span>
            </Button>
          </Dropdown>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{t('quickPlanning')}</h1>
          <p className="hero-subtitle" dangerouslySetInnerHTML={{ __html: t('planningManagement') }} />
          <p dangerouslySetInnerHTML={{ __html: t('planningText1') }} />
          <p dangerouslySetInnerHTML={{ __html: t('planningText2') }} />
        </div>
        <div className="hero-images">
          <img src={home} alt="DashboardAdmin" className="large-image" />
          <img src={calander} alt="Calandrier" className="medium-image" />
        </div>
      </section>

      {/* Features Section */}
      <section className="hero1">
        <div className="hero-content1">  
          <h3>{t('features')}</h3>
          <div className="features-list">
            <div className="feature-item">
              <img src={planningIcon} alt="Planning" className="feature-icon" />
              <h3>{t('simpleDisplay')}</h3>
              <p>{t('simpleDisplayDesc')}</p>
            </div>
            <div className="feature-item">
              <img src={alertIcon} alt="Alertes" className="feature-icon" />
              <h3>{t('realtimeAlerts')}</h3>
              <p>{t('realtimeAlertsDesc')}</p>
            </div>
            <div className="feature-item">
              <img src={SuiviIcon} alt="Suivi en temps réelle" className="feature-icon" />
              <h3>{t('realtimeTracking')}</h3>
              <p>{t('realtimeTrackingDesc')}</p>
            </div>
            <div className="feature-item">
              <img src={RapportIcon} alt="Rapport détailler" className="feature-icon" />
              <h3>{t('deepAnalysis')}</h3>
              <p>{t('deepAnalysisDesc')}</p>
            </div>
            <div className="feature-item">
              <img src={DisponibileIcon} alt="DESponible" className="feature-icon" />
              <h3>{t('availability')}</h3>
              <p>{t('availabilityDesc')}</p>
            </div> 
            <div className="feature-item">
              <img src={MapsIcon} alt="maps" className="feature-icon" />
              <h3>{t('mapsIntegration')}</h3>
              <p>{t('mapsIntegrationDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="solutions-section">
        <div className="solutions-header">
          <div className="solution-title-container">
            <h1>{t('whyChooseUs')}</h1>
            <div className="solution-subtitle-container">
              <p className="solutions-subtitle">{t('solutionsSubtitle')}</p>
              <Link to="/about" className="voir-plus-link">
                {t('seeMore')}
              </Link>
            </div>
          </div>
        </div>

        <div className="solutions-grid">
          <div className="solution-card">
            <div className="solution-number">1</div>
            <h3>{t('boostVisibility')}</h3>
            <p>{t('boostVisibilityDesc')}</p>
          </div>

          <div className="solution-card">
            <div className="solution-number">2</div>
            <h3>{t('increaseRevenue')}</h3>
            <p>{t('increaseRevenueDesc')}</p>
          </div>

          <div className="solution-card">
            <div className="solution-number">3</div>
            <h3>{t('organizeBusiness')}</h3>
            <p>{t('organizeBusinessDesc')}</p>
          </div>
        </div>
      </section>

      {/* Capacities Section */}
      <section className="capacities-section">
        <div className="capacities-header">
          <h3>{t('capacities')}</h3>
          <h2>{t('completeCompany')}</h2>
        </div>

        <div className="solutions-container">
          <div className="solutions-grid">
            {/* Web Development */}
            <div className="solution-card">
              <img src={SiteInternetIcon} alt="siteweb" className="feature-icon" />
              <h4>{t('webDev')}</h4>
              <p>{t('webDevDesc')}</p>
            </div>

            {/* SEO */}
            <div className="solution-card">
              <img src={SeoIcon} alt="seo" className="feature-icon" />
              <h4>{t('seoOptimization')}</h4>
              <p>{t('seoOptimizationDesc')}</p>
            </div>

            {/* Google My Business */}
            <div className="solution-card">
              <img src={StrategieIcon} alt="seo" className="feature-icon" />
              <h4>{t('googleBusiness')}</h4>
              <p>{t('googleBusinessDesc')}</p>
            </div>

            {/* Digital Strategy */}
            <div className="solution-card">
              <img src={DesignIcon} alt="marketingdigital" className="feature-icon" />
              <h4>{t('digitalStrategy')}</h4>
              <p>{t('digitalStrategyDesc')}</p>
            </div>

            {/* Community Management */}
            <div className="solution-card">
              <img src={CommuntyIcon} alt="seo" className="feature-icon" />
              <h4>{t('communityManagement')}</h4>
              <p>{t('communityManagementDesc')}</p>
            </div>

            {/* Animation 3D */}
            <div className="solution-card">
              <img src={AnimationIcon} alt="3d" className="feature-icon" />
              <h4>{t('animation3D')}</h4>
              <p>{t('animation3DDesc')}</p>
            </div>

            {/* Graphic Design */}
            <div className="solution-card">
              <img src={StrategieIcon} alt="seo" className="feature-icon" />
              <h4>{t('graphicDesign')}</h4>
              <p>{t('graphicDesignDesc')}</p>
            </div>

            {/* UI/UX Design */}
            <div className="solution-card">
              <img src={UIXIcon} alt="uix" className="feature-icon" />
              <h4>{t('uiuxDesign')}</h4>
              <p>{t('uiuxDesignDesc')}</p>
            </div>

            {/* Google Ads */}
            <div className="solution-card">
              <img src={GoogleIcon} alt="googleads" className="feature-icon" />
              <h4>{t('googleAds')}</h4>
              <p>{t('googleAdsDesc')}</p>
            </div>

            {/* Mobile Development */}
            <div className="solution-card">
              <img src={AppmobileIcon} alt="appmobile" className="feature-icon" />
              <h4>{t('mobileDev')}</h4>
              <p>{t('mobileDevDesc')}</p>
            </div>

            {/* Business Management */}
            <div className="solution-card">
              <img src={EquipeIcon} alt="gestionetreprise" className="feature-icon" />
              <h4>{t('businessManagement')}</h4>
              <p>{t('businessManagementDesc')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>{t('footerSolutions')}</h4>
            <ul className="footer-links">
              <li>{t('digitalStrategyItem')}</li>
              <li>{t('googleBusinessItem')}</li>
              <li>{t('mobileDevItem')}</li>
              <li>{t('contactItem')}</li>
              <li>{t('seoOptimizationItem')}</li>
              <li>{t('socialMediaItem')}</li>
              <li>{t('webDevItem')}</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-column">
            <h4>{t('footerContact')}</h4>
            <div className="contact-info">
              <p className="contact-text">{t('footerGrowth')}</p>
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
                  {t('viewMap')}
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="footer-column social-column">
            <h4>{t('footerFollow')}</h4>
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
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;