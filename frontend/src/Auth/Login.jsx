import React from 'react';
import { Card, Flex, Form, Typography, Input, Spin, Button, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/sign in.png';
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
            Welcome
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Become a part of our community!
          </Typography.Text>
          <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
            <Form.Item
              label={<span style={{ color: '#666666' }}>Email</span>}
              name="email"
              required={false}
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
              label={<span style={{ color: '#666666' }}>Password</span>}
              name="password"
              required={false} // Désactive l'astérisque
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

            <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
              <Typography.Text style={{ color: '#666', marginRight: '8px' }}>
                Don't have an account?
              </Typography.Text>
              <Link to="/register" style={{ fontWeight: 500 }}>
                Sign up
              </Link>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Login;