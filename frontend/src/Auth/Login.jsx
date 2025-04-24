//frontend/src/Auth/Login.jsx
import React from 'react';
import { Alert, Card, Flex, Form, Typography, Input, Spin, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/resized_iii.webp';
import useLogin from '../hooks/useLogin';
import logo from '../assets/logo-digital-market.png';

const Login = () => {
  const { loading, error, loginUser } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      console.log('Logging in user with values:', values);
      const result = await loginUser(values);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Digital Market Logo" className="logo-image" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/about">À propos</Link>
          <Link to="/login">Connexion</Link>
        </div>
        </div>
      </nav>
      
      <Card className="form-container">
        <Flex gap="large" align="stretch" className="main-flex" wrap="wrap-reverse">
          {/* Formulaire */}
          <Flex vertical flex={1} className="form-section">
            <Typography.Title level={2} strong className="title">
              Se connecter
            </Typography.Title>
            <Typography.Text type="secondary" strong className="slogan">
              Ravie de vous revoir ! Veuillez vous connecter pour continuer.
            </Typography.Text>
            <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
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
                label="Mot de passe"
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
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className={`btn ${loading ? 'loading' : ''}`}
                >
                  {loading ? <Spin /> : 'Connexion'}
                </Button>
              </Form.Item>

              <Form.Item>
                <Typography.Text style={{ color: '#666', marginRight: '20px' }}>
                  Vous n'avez pas de compte ?
                </Typography.Text>
                <Link to="/register" style={{ fontWeight: 500 }}>
                  Créer un compte
                </Link>
              </Form.Item>
            </Form>
          </Flex>

          {/* Image Container */}
          <Flex flex={1} className="image-container">
            <div className="image-wrapper">
              <img 
                src={loginImage} 
                className="auth-image"
                alt="Connexion"
              />
            </div>
          </Flex>
        </Flex>

        <style>
          {`
            /* Modified page-container */
            .page-container {
              background-color: #d4e1dc;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 70px 20px 20px;
              margin: 0;
            }
/* Styles de la navbar améliorée */
          .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 10px 0;
          }
          
          .navbar-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            width: 100%;
          }
          
          .logo-image {
            height: 40px;
            width: auto;
            max-width: 200px; /* Ajusté pour mieux s'adapter */
          }
          
          .nav-links {
            display: flex;
            align-items: center;
          }
          
          .nav-links a {
            text-decoration: none;
            color: #2c3e50;
            font-weight: 500;
            padding: 8px 12px;
            margin: 0;
            white-space: nowrap;
            position: relative;
          }
          
          /* Séparateur minimal entre les liens */
          .nav-links a + a::before {
            content: "";
            position: absolute;
            left: -1px;
            top: 25%;
            height: 50%;
            width: 1px;
            background-color: #eee;
          }
          
          .nav-links a:hover {
            color: #8db7e7;
          }

            .form-container {
              background-color: white;
              width: 90%;
              max-width: 1200px;
              border-radius: 0;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              padding: 0;
              margin: 20px 0;
            }
              
            .main-flex {
              height: 100%;
              min-height: auto;
            }

            .image-container {
              position: relative;
              background-color: #fafafa;
              min-height: 300px;
            }

            .image-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: auto;
            }

            .auth-image {
              width: 100%;
              height: auto;
              max-height: none;
              object-fit: contain;
            }

            .form-section {
              padding: 30px;
              min-width: 300px;
            }

            .title {
              font-size: 1.8rem !important;
              color: #2c3e50 !important;
            }

            .btn.ant-btn-primary {
              background-color: #8db7e7 !important;
              border-color: #8db7e7 !important;
              width: 100%;
            }

            /* Mobile styles */
            @media (max-width: 767px) {
              .page-container {
                padding: 70px 10px 10px;
                align-items: flex-start;
              }
              
              .form-container {
                width: 100%;
                margin: 10px 0;
              }
              
              .form-section {
                padding: 20px;
                min-width: auto;
              }
              
              .image-container {
                border-top: 1px solid #f0f0f0;
                border-left: none;
                height: auto;
                min-height: 250px;
              }
              
              .title, .slogan {
                text-align: center;
              }
              
              .main-flex {
                flex-direction: column-reverse;
              }
            }

            /* Desktop styles */
            @media (min-width: 768px) {
              .image-container {
                border-left: 1px solid #f0f0f0;
                border-top: none;
              }
              
              .image-wrapper {
                position: absolute;
                height: 100%;
              }
              
              .auth-image {
                height: 100%;
                object-fit: cover;
              }

              .navbar-container {
        padding: 0 10px;
      }
      
      .nav-links a {
        padding: 8px 10px;
        font-size: 14px;
      }
      
      .nav-links a::before {
        top: 20%;
        height: 60%;
      }
              
            }
             @media (max-width: 480px) {
            .nav-links {
              flex-wrap: wrap;
            }
            
            .nav-links a {
              font-size: 13px;
              padding: 6px 3px;
            }
          }
          `}
        </style>
      </Card>
    </div>
  );
};

export default Login;