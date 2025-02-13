import React from 'react';
import { Card, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
  return (
    <Card className="form-container" style={{ textAlign: 'center' }}>
      <Typography.Title level={3} strong className="title">
        Account Pending Approval
      </Typography.Title>
      <Typography.Text type="secondary" strong className="slogan">
        Your account is pending approval by the admin. You will receive an email once your account is approved.
      </Typography.Text>
      <br />
      <Link to="/login">
        <Button type="primary" size="large" className="btn">
          Go to Login
        </Button>
      </Link>
    </Card>
  );
};

export default PendingApproval;