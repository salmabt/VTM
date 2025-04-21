import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Row, Col, Statistic, Typography, Button, Modal, message,Select} from 'antd';
import { UserOutlined, UnorderedListOutlined, FilterOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Content } = Layout;
const { Text } = Typography;


const TaskBarChart = ({ data }) => {
  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
  dataKey="month"
  tickFormatter={(month) => monthNames[month - 1]}
  domain={[1, 12]} // Forcer l'affichage de 12 mois
  interval={0} // Afficher toutes les étiquettes
  tick={{ fontSize: 12 }} // Réduire la taille
/>
        <YAxis />
        <Tooltip
          labelFormatter={(monthNumber) => monthNames[monthNumber - 1]}
          formatter={(value) => [value, 'Tâches']}
        />
        <Bar
          dataKey="count"
          fill="#8884d8"
          name="Tâches/Mois"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const normalizedStatus = (status) => {
  return status.trim().toLowerCase().replace(/ée$/, 'é'); // Normaliser "réservée" en "réservé"
};

const getVehicleStatusColor = (status) => {
  switch (normalizedStatus(status)) {
    case 'disponible':
      return 'green';
    case 'réservé':
      return 'red';
    case 'en entretien':
      return 'orange';
    default:
      return 'gray';
  }
};

const HomeDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [bestTechnician, setBestTechnician] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalGestionnaires, setTotalGestionnaires] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [tasksPerMonth, setTasksPerMonth] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vehicules, setVehicules] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2025)
  // Récupérer les véhicules
  const fetchVehicules = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vehicules');
      console.log('Données des véhicules:', response.data); // Log pour vérifier les données
      setVehicules(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      message.error('Erreur lors de la récupération des données des véhicules');
    }
  };
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { year: selectedYear };
        if (startDate && endDate) {
          params.startDate = startDate.toISOString();
          params.endDate = endDate.toISOString();
        }
    
        const techniciensRes = await axios.get('http://localhost:3000/api/techniciens/count', { params });
        setTotalEmployees(techniciensRes.data.totalTechniciens);

        const gestionnairesRes = await axios.get('http://localhost:3000/api/gestionnaires/count', { params });
        setTotalGestionnaires(gestionnairesRes.data.totalGestionnaires);

        const tasksMonthRes = await axios.get('http://localhost:3000/api/tasks/count-by-month', { 
          params: { year: selectedYear } // Add year parameter
        });
        const formattedTasksPerMonth = Array.from({ length: 12 }, (_, i) => {
          const match = tasksMonthRes.data.find(item => item.month === i + 1);
          return {
            month: i + 1, // Garder le numéro du mois (1-12)
            count: match ? match.count : 0
          };
        });
        setTasksPerMonth(formattedTasksPerMonth);
        

        const tasksRes = await axios.get('http://localhost:3000/api/tasks/count', { params });
        setTotalTasks(tasksRes.data.totalTasks);

        const bestTechRes = await axios.get('http://localhost:3000/api/techniciens/bestTechnician', { params });
        setBestTechnician(bestTechRes.data?.name || 'Aucun');

        const tasksListRes = await axios.get('http://localhost:3000/api/tasks', { params });
        setTasks(tasksListRes.data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchData();
    fetchVehicules();
  }, [startDate, endDate,selectedYear]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const activeTasks = tasks.filter(task => task.status === 'en cours').length;
  const completedTasks = tasks.filter(task => task.status === 'terminé').length;
  const plannedTasks = tasks.filter(task => task.status === 'planifié').length;
  const totalTasksCount = tasks.length;

  const activeTasksPercent = totalTasksCount > 0 ? Math.round((activeTasks / totalTasksCount) * 100) : 0;
  const completedTasksPercent = totalTasksCount > 0 ? Math.round((completedTasks / totalTasksCount) * 100) : 0;
  const plannedTasksPercent = totalTasksCount > 0 ? Math.round((plannedTasks / totalTasksCount) * 100) : 0;

  const pieData = vehicules.reduce((acc, veh) => {
    const status = normalizedStatus(veh.status); // Normaliser le statut
    const exist = acc.find((item) => item.name === status);
    if (exist) {
      exist.value++;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []);
  const years = Array.from({ length: 2050 - 2000 + 1 }, (_, i) => 2000 + i);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#F5F5F5' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<FilterOutlined />} 
            onClick={() => setVisible(true)}
          >
            Filtrer
          </Button>
        </div>

        <Modal
          title="Filtrer par période"
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={() => setVisible(false)}
        >
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            style={{ width: '100%' }}
          />
        </Modal>
        <Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={6}>
    <Card style={{ background: '#FFF5CC', textAlign: 'center' }}>
      <Statistic title="Total Technicians" value={totalEmployees} prefix={<UserOutlined />} />
    </Card>
  </Col>
  <Col xs={24} sm={12} md={6}>
    <Card style={{ background: '#FDE2E2', textAlign: 'center' }}>
      <Statistic title="Best Technician" value={bestTechnician} prefix={<UserOutlined />} />
    </Card>
  </Col>
  <Col xs={24} sm={12} md={6}>
    <Card style={{ background: '#D4EDDA', textAlign: 'center' }}>
      <Statistic title="Total Gestionnaires" value={totalGestionnaires} prefix={<UserOutlined />} />
    </Card>
  </Col>
  <Col xs={24} sm={12} md={6}>
    <Card style={{ background: '#E0F7FA', textAlign: 'center' }}>
      <Statistic title="Total Tasks" value={totalTasks} prefix={<UnorderedListOutlined />} />
    </Card>
  </Col>
</Row>

<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
  {/* Camembert Statut Véhicules */}
  <Col xs={2} md={8}>
    <Card title="📊 Statut des Véhicules" style={{ height: '100%' }}>
      <div style={{ width: '70%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              fill="#8884d8"
              label
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getVehicleStatusColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </Col>

  {/* Donut Tasks */}
  <Col xs={24} sm={12} md={8}>
  <Card title="📌Tasks" className="dashboard-card">

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 140,
            height: 250,
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
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
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

  {/* Bar Chart Tasks Per Month */}
  <Col xs={24} sm={12} md={8}>
  <Card title="📅Tasks Per Month" className="dashboard-chart">

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          style={{ width: '100%', maxWidth: 120 }}
          showSearch
          placeholder="Sélectionner une année"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toString().toLowerCase().includes(input.toLowerCase())
          }
        >
          {years.map((year) => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <TaskBarChart data={tasksPerMonth} />
        </ResponsiveContainer>
      </div>
    </Card>
  </Col>
</Row>

      </Content>
    </Layout>
  );
};

export default HomeDashboard;