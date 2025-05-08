import React from 'react';
import { Card, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
  return (
    <Card className="form-container" style={{ textAlign: 'center' }}>
      <Typography.Title level={10} strong className="title">
      Compte en attente d'approbation
      </Typography.Title>

      <Typography.Text  type="secondary" strong className="slogan">

     <h4 style={{ color: 'red' }}>
  Votre compte est en attente d'approbation par l'administrateur. Vous recevrez un e-mail dès que votre compte sera approuvé.
</h4>

      </Typography.Text>
      <br />
      <Link to="/login">
        <Button type="primary" size="large" className="btn">
        Allez dans Connexion
        </Button>
      </Link>
    </Card>
  );
};

export default PendingApproval;