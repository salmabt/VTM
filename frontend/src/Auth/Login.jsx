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
              Sign In
            </Typography.Title>
            <Typography.Text type="secondary" strong className="slogan">
              Welcome back! Please log in to continue.
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
                  {loading ? <Spin /> : 'Login'}
                </Button>
              </Form.Item>

              <Form.Item>
                <Typography.Text style={{ color: '#666', marginRight: '20px' }}>
                  Don't have an account?
                </Typography.Text>
                <Link to="/register" style={{ fontWeight: 500 }}>
                  Create an account
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
            background-color:#e1deed;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 70px 0 0;
            margin: 0;
          }

         /* Navbar styles */
           .navbar {
          position: fixed; /* Garde la navbar fixe en haut */
          top: 0;
          left: 0;
          width: 98%; /* Occupe toute la largeur */
          z-index: 1000; /* Assure qu'elle passe au-dessus du contenu */
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 30px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        } .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
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
              padding: 10px 15px; /* Ajoute un peu d'espace autour des liens */
          }

          .nav-links a:hover {
            color: #ff7b9c;
          }


            .form-container {
              background-color: white;
              width: 80%;
              max-width: 1200px;
              border-radius: 0;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              padding: 0;
              margin: 0;
            }
              

            .main-flex {
              height: 100%;
              min-height: 600px;
            }

            .image-container {
              position: relative;
              background-color: #fafafa;
              border-left: 1px solid #f0f0f0;
            }

            .image-wrapper {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              overflow: hidden;
            }

            .auth-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .form-section {
              padding: 40px;
              min-width: 400px;
            }

            .title {
              font-size: 2rem !important;
              color: #2c3e50 !important;
            }

            .btn.ant-btn-primary {
              background-color: #8db7e7 !important;
              border-color: #8db7e7 !important;
            }
          `}
        </style>
      </Card>
    </div>
  );
};

export default Login;