import React from 'react';
import { Card, Flex, Form, Typography,Input } from 'antd';

const Register = () => {
  const handleRegister =(values) => {
    console.lof(values);
  };
  return (
    <Card className="form-container">
      <Flex >
        {/* form */}
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
                <Input placeholder="Enter your full name" />
            </Form.Item>
        </Form>
        </Flex>

        {/* Image */}
        <Flex></Flex>
      </Flex>
    </Card>
  );
};

export default Register;