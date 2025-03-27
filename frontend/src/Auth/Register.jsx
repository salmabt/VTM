import React from 'react';
import { Alert, Card, Flex, Form, Typography, Input, Spin, Button, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import registerImage from '../assets/register.png';
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
    <Card className="form-container">
      <Flex gap="large" align="center">
        {/* Formulaire */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Create an account
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
              label="Location"
              name="location"
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
                type={`${loading ? '' : 'primary'}`}
                htmlType="submit"
                size="large"
                className="btn"
              >
                {loading ? <Spin /> : 'Create Account'}
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/login">
                <Button size="large" className="btn">
                  Sign In
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Flex>

        {/* Image */}
        <Flex flex={1}>
          <img src={registerImage} className="auth-image" />
        </Flex>
      </Flex>

      {/* CSS styles */}
      <style>
        {`
          .form-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }

          .title {
            text-align: center;
            margin-bottom: 10px;
          }

          .slogan {
            text-align: center;
            margin-bottom: 30px;
          }

          .auth-image {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
          }

          .btn {
            width: 100%;
            background-color: #1890ff;
            border-color: #1890ff;
          }

          .btn:hover {
            background-color: #40a9ff;
            border-color: #40a9ff;
          }

          .alert {
            margin-bottom: 20px;
          }
        `}
      </style>
    </Card>
  );
};

export default Register;
