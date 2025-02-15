import React from 'react';
import { Card, Flex, Form, Typography, Input, Spin, Button, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/login.png';
import useLogin from '../hooks/useLogin';

const Login = () => {
  const { error, loading, loginUser } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const userData = await loginUser(values); // Assurez-vous que loginUser retourne les données de l'utilisateur
    if (userData) {
      const role = userData.role;

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'gestionnaire') {
        navigate('/gestionnaire-dashboard');
      } else if (role === 'technicien') {
        navigate('/technicien-dashboard');
      } else {
        navigate('/'); // Redirection par défaut si le rôle n'est pas reconnu
      }
    }
  };

  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        {/* Image */}
        <Flex flex={1}>
          <img src={loginImage} className="auth-image" alt="Login" />
        </Flex>
        {/* form */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Sign In
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Unlock your world.
          </Typography.Text>
          <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Emailll!',
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
                type={`${loading ? '' : 'primary'}`}
                htmlType="submit"
                size="large"
                className="btn"
              >
                {loading ? <Spin /> : 'Sign In'}
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/register">
                <Button size="large" className="btn">
                  Create an Account
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Login;