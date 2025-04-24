// About.jsx
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import SuiviIcon from '../assets/icon-suivi.png';
import RapportIcon from '../assets/icon-rapport.png';
import logo from '../assets/VTM-logo.png';
import InnovationIcon from '../assets/innovation-icon.png';
import TransparenceIcon from '../assets/transparence-icon.png';
import ExcellenceIcon from '../assets/excellence-icon.png';
import { useState, useEffect } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { translations, languageNames } from './translations';

const About = () => {
  const [language, setLanguage] = useState('fr');

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
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Digital Market Logo" className="logo-image" />
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

      <section className="results-section">
        <div className="results-header">
          <h1>{t('resultsTitle')}</h1>
          <h2>{t('resultsSubtitle')}</h2>
          
          <div className="about-content">
            <p>{t('aboutText1')}</p>
            <p>{t('aboutText2')}</p>
            
            <div className="about-features">
              <div className="feature-item">
                <img src={SuiviIcon} alt="Suivi" className="feature-icon" />
                <h3>{t('deepAnalysis')}</h3>
                <p>{t('deepAnalysisDesc')}</p>
              </div>
              
              <div className="feature-item">
                <img src={RapportIcon} alt="Optimisation" className="feature-icon" />
                <h3>{t('continuousOptimization')}</h3>
                <p>{t('continuousOptimizationDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-content">
          <h2>{t('ourValues')}</h2>
          
          <div className="values-grid">
            <div className="value-item">
              <img src={InnovationIcon} alt="Innovation" className="value-icon" />
              <h3>{t('innovation')}</h3>
              <p>{t('innovationDesc')}</p>
            </div>

            <div className="value-item">
              <img src={TransparenceIcon} alt="Transparence" className="value-icon" />
              <h3>{t('transparency')}</h3>
              <p>{t('transparencyDesc')}</p>
            </div>

            <div className="value-item">
              <img src={ExcellenceIcon} alt="Excellence" className="value-icon" />
              <h3>{t('excellence')}</h3>
              <p>{t('excellenceDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          {/* Solutions Column */}
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

export default About;