//frontend/src/Auth/Register.jsx
import React from 'react';
import { Alert, Card, Flex, Form, Typography, Input, Spin, Button, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import registerImage from '../assets/signIn_signUp.avif';
import useSignup from '../hooks/useSignup';
import logo from '../assets/VTM-logo.png'; 
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

// Liste des villes de Tunisie (identique à celle dans TaskModal)
const cities = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
  'La Manouba', 'Le Kef', 'Mahdia', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
  'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
];

const Register = () => {
  const [form] = Form.useForm(); 
  const { loading, error, registerUser } = useSignup();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    // Ajouter le préfixe +216 avant l'envoi
    const cleanPhone = values.phone.replace(/\D/g, '');
  
    const formattedValues = {
      ...values,
      phone: cleanPhone // Garantir le format international
    };
   
    const validRoles = ['technicien']; // Liste des rôles valides
    const { role, password, passwordConfirm } = values;

    // Vérification du rôle
    if (!validRoles.includes(role.toLowerCase().trim())) {
      alert('Invalid role. Please choose a valid role: technicien.');
      return;
    }

    // Vérification des mots de passe
    if (password !== passwordConfirm) {
      alert('Passwords do not match. Please check your password and try again.');
      return;
    }

    console.log('Values being sent:', values); // Vérifiez que "location" est bien présent
    // Si le rôle et les mots de passe sont valides, appeler la fonction pour enregistrer l'utilisateur
    try {
     
      console.log('Registering user with values:', values); // Log des données envoyées
      const result = await registerUser(formattedValues); // Attendre que l'enregistrement soit terminé

      // Redirection vers la page d'attente après une inscription réussie
      if (result.success) {
        navigate('/pending-approval');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      alert('An error occurred during registration. Please try again later.'); // Afficher un message d'erreur à l'utilisateur
    }
  };

  return (
    <div className="page-container">
         {/* Added Navbar */}
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
    <Card className="form-container">
      <Flex gap="large" align="stretch" className="main-flex">
        {/* Formulaire */}
        <Flex vertical flex={1} className="form-section">
          <Typography.Title level={2} strong className="title">
            Créer un compte
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Inscrivez-vous pour accéder à nos services !
          </Typography.Text>
          <Form layout="vertical" onFinish={handleRegister} autoComplete="off" form={form}>
            <Form.Item
              label="Nom et prénom"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Veuillez saisir votre nom complet !',
                },
              ]}
            >
              <Input size="large" placeholder="Entrez votre nom complet" />
            </Form.Item>

         
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Veuillez saisir votre email !',
              },
              {
                type: 'email',
                message: 'Format email invalide !',
              },
              {
                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Adresse email non valide !'
              }
            ]}
          >
            <Input size="large" placeholder="exemple@domaine.com" />
          </Form.Item>


          <Form.Item
            label="Rôle"
            name="role"
            initialValue="technicien"
            rules={[
              {
                required: true,
                message: 'Veuillez sélectionner votre rôle !',
              },
            ]}
          >
            <Select size="large" disabled>
              <Option value="technicien">Technicien</Option>
            </Select>
          </Form.Item>

          <Form.Item
          label="Téléphone"
          name="phone"
          rules={[
            { required: true, message: 'Veuillez saisir votre numéro de téléphone !' },
            { pattern: /^\d{8}$/, message: '8 chiffres requis (ex: 23123502)' }
          ]}
        >
          <Input 
            size="large"
            placeholder="23123502"
            addonBefore="+216"
            maxLength={8}
            type="tel"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              const cleanedValue = e.target.value.replace(/\D/g, '');
              form.setFieldsValue({ phone: cleanedValue });
            }}
          />
        </Form.Item>

            {/* Sélection de la localisation */}
            <Form.Item
              label="Ville"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Veuillez sélectionner votre ville !',
                },
              ]}
            >
              <Select size="large" placeholder="Sélectionnez votre ville">
                {cities.map((city, index) => (
                  <Option key={index} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Sélection des compétences */}
            <Form.Item
              label="Compétences"
              name="skills"
              rules={[
                {
                  required: true,
                  message: 'Veuillez renseigner vos compétences !',
                },
              ]}
              extra={
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 5 }}>
              <InfoCircleOutlined /> Séparez les compétences par des virgules (ex: Plomberie, Électricité)
            </div>
          }
            >
              <Input
                size="large"
                placeholder="Entrez vos compétences"
              />
            </Form.Item>

           
<Form.Item
  label="Mot de passe"
  name="password"
  rules={[
    {
      required: true,
      message: 'Veuillez saisir votre mot de passe !',
    },
    () => ({
      validator(_, value) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value || passwordRegex.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial !'));
      },
    }),
  ]}
  help="Minimum 8 caractères avec majuscule, minuscule, chiffre et caractère spécial"
>
  <Input.Password size="large" placeholder="Entrez votre mot de passe" />
</Form.Item>

            <Form.Item
              label="Confirmez le mot de passe"
              name="passwordConfirm"
              dependencies={['password']} // Dépendance pour la validation
              rules={[
                {
                  required: true,
                  message: 'Veuillez confirmer votre mot de passe !',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Les mots de passe ne correspondent pas !'));
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="Confirmez votre mot de passe" />
            </Form.Item>

            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}

            <Form.Item>
            <Button
    type="primary" // Laissez-le comme "primary" pour que le bouton ait les styles par défaut d'Ant Design
    htmlType="submit"
    size="large"
    className={`btn ${loading ? 'loading' : ''}`} // Ajouter une classe dynamique selon l'état de chargement
  >
    {loading ? <Spin /> : 'Créer un compte'}
  </Button>
            </Form.Item>

            <Form.Item>
             
              <Typography.Text style={{ color: '#666', marginRight: '20px' }}>
                    Vous avez déjà un compte ?
               </Typography.Text>
              <Link to="/login" style={{ fontWeight: 500 }}>
                       Se connecter
                            </Link>
            </Form.Item>
          </Form>
        </Flex>

        {/* Image */}
        <Flex flex={1} className="image-container" style={{ padding: 0, margin: 0 }}>
  <div className="image-section" style={{ padding: 0, margin: 0 }}>
    <img 
      src={registerImage} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
      className="register-image"
      alt="Inscription"
    />
  </div>
</Flex>

      </Flex>

      {/* CSS styles */}
      <style>
        {`
          /* Conteneur principal */
          /* Modified page-container */
          .page-container {
            background-color:#d4e1dc;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 70px 0 0;
            margin: 0;
          }

          /* Added navbar styles */
        .navbar {
  position: fixed; /* Garde la navbar fixe en haut */
  top: 0;
  left: 0;
  width: 98%; /* Occupe toute la largeur */
  z-index: 1000; /* Assure qu'elle passe au-dessus du contenu */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px !important;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 90px;
}
             .logo-image {
            height: 250px;
          }

        .nav-links {
  display: flex;
  gap: 5px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s;
  padding: 10px 20px; 
}


.nav-links a:hover {
  color: #3498db;
}

            
            .form-container {
              background-color: white;
              width: 80%;
              max-width: 1200px;
              border-radius:0;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              padding: 0 !important;
              margin: 0 !important;
               max-height: 99vh;
            }
            
            .main-flex {
                height: auto; /* Remplacez 95vh par auto pour éviter de forcer une hauteur fixe */
                margin: 0 !important;
                min-height: 0; 
            }
            
            .form-section {
              padding: 10px;
             max-height: 87vh; 
              overflow-y: auto;
              animation: fadeIn 0.5s ease-out;
            }
            .ant-form-item {
              margin-bottom: 8px !important; /* Réduit l'espace entre les champs */
            }
                        
             .title {
        text-align: left !important;
        font-size: 2rem !important;
        margin-bottom: 10px !important;
        color: #2c3e50;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
            
       .slogan {
              text-align: left;
              margin-bottom: 20px;
              display: block;
              font-size: 1.1rem;
              color: #7f8c8d;
            }

            /* Champs de formulaire */
          .ant-form-item-label > label {
            color: #34495e !important;
            font-size: 1rem !important;
            font-weight: 500;
          }

          .ant-input, .ant-select-selector, .ant-input-password {
            border-radius: 6px !important;
            padding: 8px 12px !important;
            border: 1px solid #dfe6e9 !important;
          }
                    .ant-input:focus, .ant-select-focused .ant-select-selector {
            border-color: #3498db !important;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2) !important;
          }
            
            
           .image-container {
               position: relative;
              flex: 1;
              display: flex;
              overflow: hidden;
              background-color: #fafafa;
              border-left: 1px solid #f0f0f0;
               padding: 0 !important;
               margin: 0 !important;
            }
          .image-section {
             position: relative;
            flex: 1;
            min-width: 0;
            min-height: 0;
             padding: 0 !important;
          margin: 0 !important;
           display: flex; 
          }

         .register-image {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
          }
            /* Styles existants pour les boutons et autres éléments */
            .btn.ant-btn-primary {
              background-color:#8db7e7 !important;
              border-color: #8db7e7 !important;
                height: 40px;
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 6px;
            transition: all 0.3s;
            }
            
           .btn.ant-btn-primary:hover {
          background-color: #2980b9 !important;
          border-color: #2980b9 !important;
          transform: translateY(-2px);
        }
        .ant-typography {
          color: #7f8c8d;
        }
    
       
.alert {
  border-radius: 6px;
  margin-bottom: 20px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}


       @media (max-width: 768px) {
  .main-flex {
    flex-direction: column-reverse !important;
  }

  .image-container {
    position: relative;
    width: 100%;
    min-height: 250px;
    border: none;
    border-bottom: 1px solid #f0f0f0;
  }

  .register-image {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    max-height: 250px;
    
    display: block;
  }

.form-container {
    height: auto !important;
    max-height: none !important;
  }
  .form-section {
    max-height: none !important;
    overflow-y: visible !important;
  }
}


        `}
      </style>
      
    </Card>
    </div>

  );
};

export default Register;