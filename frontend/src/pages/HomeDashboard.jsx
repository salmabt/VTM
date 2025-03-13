import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Row, Col, Statistic, Typography, Progress } from 'antd';
import { UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
const TaskBarChart = ({ data }) => {
  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(month) => monthNames[month - 1]}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => monthNames[value - 1]}
          formatter={(value) => [value, 'Tâches']}
        />
        <Bar
          dataKey="count"
          fill="#8884D8"
          name="Tâches/Mois"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
const { Content } = Layout;
const { Text } = Typography;
const HomeDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [bestTechnician, setBestTechnician] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalGestionnaires, setTotalGestionnaires] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [tasksPerMonth, setTasksPerMonth] = useState([]);
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
    axios.get('http://localhost:3000/api/tasks')
    .then(response => {
      setTasks(response.data); // Stocker les tâches dans l'état
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des tâches:', error);
    });
     // Fetch tasks per month
     axios.get('http://localhost:3000/api/tasks/count-by-month')
     .then(response => {
       setTasksPerMonth(response.data);
     })
     .catch(error => {
       console.error('Erreur lors de la récupération des tâches par mois:', error);
     });
  }, []);
  // Calculer le pourcentage de tâches actives, terminées, etc.
  const activeTasks = tasks.filter(task => task.status === 'en cours').length;
  const completedTasks = tasks.filter(task => task.status === 'terminé').length;
  const plannedTasks = tasks.filter(task => task.status === 'planifié').length;
  const totalTasksCount = tasks.length;
  // Pourcentages des tâches
  const activeTasksPercent = totalTasksCount > 0 ? Math.round((activeTasks / totalTasksCount) * 100) : 0;
  const completedTasksPercent = totalTasksCount > 0 ? Math.round((completedTasks / totalTasksCount) * 100) : 0;
  const plannedTasksPercent = totalTasksCount > 0 ? Math.round((plannedTasks / totalTasksCount) * 100) : 0;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#F5F5F5' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card style={{ background: '#FFF5CC', textAlign: 'center' }}>
              <Statistic
                title="Total Technicians"
                value={totalEmployees}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ background: '#FDE2E2', textAlign: 'center' }}>
              <Statistic
                title="Best Technician"
                value={bestTechnician}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ background: '#D4EDDA', textAlign: 'center' }}>
              <Statistic
                title="Total Gestionnaires"
                value={totalGestionnaires}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ background: '#E0F7FA', textAlign: 'center' }}>
              <Statistic
                title="Total Tasks"
                value={totalTasks}
                prefix={<UnorderedListOutlined />}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
            <Card title="Tasks Per Month">
              <TaskBarChart data={tasksPerMonth} />
            </Card>
          </Col>
          <Col span={12}>
          
          <Card title="Tasks">
  <div style={{ textAlign: 'center' }}>
    <div 
      style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `conic-gradient(
          #FF4D4F 0deg ${completedTasksPercent * 3.6}deg,
          #FAAD14 ${completedTasksPercent * 3.6}deg ${(completedTasksPercent + plannedTasksPercent) * 3.6}deg,
          #52C41A ${(completedTasksPercent + plannedTasksPercent) * 3.6}deg 360deg
        )`,
        margin: '0 auto',
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text strong>{`${completedTasksPercent}%`}</Text>
      </div>
    </div>
    <div style={{ marginTop: 16 }}>
      <Text type="danger">● Terminées ({completedTasksPercent}%)</Text><br />
      <Text type="warning">● Planifiées ({plannedTasksPercent}%)</Text><br />
      <Text type="success">● En cours ({activeTasksPercent}%)</Text><br />
    </div>
  </div>
</Card>

          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
export default HomeDashboard;