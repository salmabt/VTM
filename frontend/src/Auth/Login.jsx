import React from 'react';
import { Card, Flex, Form, Typography,Input,Spin, Button } from 'antd';
import { Link } from 'react-router-dom';
import loginImage from '../assets/login.png';
import useLogin from '../hooks/useLogin';

const Login = () => {
  const { error, loading, loginUser } = useLogin();

  const handleLogin = async (values) => {
    await loginUser(values);
     // Si la connexion réussit, rediriger vers le tableau de bord
     
  };
  return (
    <Card className="form-container">
      <Flex gap="large" align="center">
        {/* Image */}
        <Flex flex={1}>
          <img src={loginImage} className="auth-image" />
        </Flex>
        {/* form */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className="title">
            Sign In
          </Typography.Title>
          <Typography.Text type="secondary" strong className="slogan">
            Unlock you world.
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
                type='error' 
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