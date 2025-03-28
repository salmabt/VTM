import React from 'react';
import { Alert, Card, Flex, Form, Typography, Input, Spin, Button, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import registerImage from '../assets/resized_iii.webp';
import useSignup from '../hooks/useSignup';

const { Option } = Select;

// Liste des villes de Tunisie (identique à celle dans TaskModal)
const cities = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
  'La Manouba', 'Le Kef', 'Mahdia', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
  'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
];

const Register = () => {
  const { loading, error, registerUser } = useSignup();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
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
      const result = await registerUser(values); // Attendre que l'enregistrement soit terminé

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
    <Card className="form-container">
      <Flex gap="large" align="stretch" className="main-flex">
        {/* Formulaire */}
        <Flex vertical flex={1} className="form-section">
          <Typography.Title level={2} strong className="title">
            Sign Up
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Join for exclusive access!
          </Typography.Text>
          <Form layout="vertical" onFinish={handleRegister} autoComplete="off">
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your full name!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Email!',
                },
                {
                  type: 'email',
                  message: 'The input is not valid Email!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: 'Please input your Role!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter your role" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter your phone number" />
            </Form.Item>

            {/* Sélection de la localisation */}
            <Form.Item
              label="Address"
              name="Address"
              rules={[
                {
                  required: true,
                  message: 'Please select your location!',
                },
              ]}
            >
              <Select size="large" placeholder="Select your location">
                {cities.map((city, index) => (
                  <Option key={index} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Sélection des compétences */}
            <Form.Item
              label="Skills"
              name="skills"
              rules={[
                {
                  required: true,
                  message: 'Please select your skills!',
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Select your skills"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="passwordConfirm"
              dependencies={['password']} // Dépendance pour la validation
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="Re-enter your password" />
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
    {loading ? <Spin /> : 'Create Account'}
  </Button>
            </Form.Item>

            <Form.Item>
             
              <Typography.Text style={{ color: '#666', marginRight: '20px' }}>
                            Already have an account?
               </Typography.Text>
              <Link to="/login" style={{ fontWeight: 500 }}>
                              Sign in
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
          .page-container {
              border-radius: 0 !important; 
              background-color: #a5c3e8;
              min-height: 100vh;
              height: 100vh;
              padding: 0 !important;
              margin: 0 !important;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .form-container {
              background-color: white;
              width: 100%;
              max-width: 1200px;
              border-radius:0;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              padding: 0 !important;
              margin: 0 !important;
               max-height: 100vh;
            }
            
            .main-flex {
                height: auto; /* Remplacez 95vh par auto pour éviter de forcer une hauteur fixe */
                margin: 0 !important;
                min-height: 0; 
            }
            
            .form-section {
              padding: 10px;
              max-height: calc(100vh - 40px); 
              overflow-y: auto;
              animation: fadeIn 0.5s ease-out;
            }
            .ant-form-item {
              margin-bottom: 12px !important; /* Réduit l'espace entre les champs */
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
            padding: 10px 15px !important;
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
              background-color: #ff7b9c !important;
              border-color: #ff7b9c !important;
                height: 45px;
            font-size: 1rem;
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
        a {
          color: #3498db !important;
          font-weight: 500;
        }

        a:hover {
          color: #2980b9 !important;
          text-decoration: underline !important;
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
                flex-direction: column;
              }
              
              .image-container {
                border-left: none;
                border-top: 1px solid #f0f0f0;
                height: 300px;
              }
              
              .register-image {
                max-height: 250px;
              }
            }
        `}
      </style>
    </Card>
    </div>

  );
};

export default Register;
