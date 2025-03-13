import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Row, Col, Statistic, Typography, Progress } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Text } = Typography;

const HomeDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [bestTechnician, setBestTechnician] = useState(null);

  const [totalTasks, setTotalTasks] = useState(0);
  const [totalGestionnaires, setTotalGestionnaires] = useState(0);


  useEffect(() => {
    // Récupérer le nombre total de techniciens (employés)
    axios.get('http://localhost:3000/api/techniciens/count')
      .then(response => {
        setTotalEmployees(response.data.totalTechniciens);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du nombre de techniciens:', error);
      });

    // Récupérer le nombre total de gestionnaires
    axios.get('http://localhost:3000/api/gestionnaires/count')
    .then(response => {
      setTotalGestionnaires(response.data.totalGestionnaires);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du nombre de gestionnaires:', error);
    });
  
    axios.get('http://localhost:3000/api/tasks/count')
    .then(response => {
      setTotalTasks(response.data.totalTasks); 
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du nombre de tâches:', error);
    });

    axios.get('http://localhost:3000/api/techniciens/bestTechnician')
    .then(response => {
      setBestTechnician(response.data.name);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du meilleur technicien:', error);
    });


    }, []);
    
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card style={{ background: '#fff5cc', textAlign: 'center' }}>
              <Statistic
                title="Total Technicians"
                value={totalEmployees}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ background: '#fde2e2', textAlign: 'center' }}>
              <Statistic
                title="Best Technician"
                value={bestTechnician}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ background: '#d4edda', textAlign: 'center' }}>
            <Statistic
              title="Total Gestionnaires"
              value={totalGestionnaires}
              prefix={<UserOutlined />}
            />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ background: '#e0f7fa', textAlign: 'center' }}>
              <Statistic
                title="Total Tasks"
                value={totalTasks}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="Tasks">
              <div style={{ textAlign: 'center' }}>
                <Progress type="circle" percent={60} strokeColor="#52c41a" />
              </div>
              <div style={{ marginTop: 16 }}>
                <Text type="warning">● Active</Text><br />
                <Text type="success">● Completed</Text><br />
                <Text type="danger">● Ended</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomeDashboard;
