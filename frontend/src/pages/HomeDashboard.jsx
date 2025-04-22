import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Row, Col, Statistic, Typography, Button, Modal, message, Select } from 'antd';
import { UserOutlined, UnorderedListOutlined, FilterOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Content } = Layout;
const { Text, Title } = Typography;

// Palette de couleurs modernes
const colors = {
  primary: '#6C5CE7',
  secondary: '#00CEFF',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#FF7675',
  info: '#A29BFE',
  dark: '#2D3436',
  light: '#DFE6E9',
  background: '#C8DED',
  chartPrimary: '#8884d8',
  chartSecondary: '#82CA9D',
  cardBorder: '#E0E0E0' // Couleur de bordure claire
};

const TaskBarChart = ({ data }) => {
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.light} />
        <XAxis
          dataKey="month"
          tickFormatter={(month) => monthNames[month - 1]}
          tick={{ fill: colors.dark }}
          axisLine={{ stroke: colors.light }}
        />
        <YAxis tick={{ fill: colors.dark }} axisLine={{ stroke: colors.light }} />
        <Tooltip
          labelFormatter={(monthNumber) => monthNames[monthNumber - 1]}
          formatter={(value) => [value, 'Tâches']}
          contentStyle={{
            background: colors.dark,
            border: 'none',
            borderRadius: 6,
            color: 'white'
          }}
        />
        <Bar
          dataKey="count"
          fill={colors.primary}
          name="Tâches/Mois"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const normalizedStatus = (status) => {
  return status.trim().toLowerCase().replace(/ée$/, 'é');
};

const getVehicleStatusColor = (status) => {
  switch (normalizedStatus(status)) {
    case 'disponible':
      return colors.success;
    case 'réservé':
      return colors.danger;
    case 'en entretien':
      return colors.warning;
    default:
      return colors.info;
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchVehicules = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vehicules');
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
    
        const [techniciensRes, gestionnairesRes, tasksMonthRes, tasksRes, bestTechRes, tasksListRes] = await Promise.all([
          axios.get('http://localhost:3000/api/techniciens/count', { params }),
          axios.get('http://localhost:3000/api/gestionnaires/count', { params }),
          axios.get('http://localhost:3000/api/tasks/count-by-month', { params: { year: selectedYear } }),
          axios.get('http://localhost:3000/api/tasks/count', { params }),
          axios.get('http://localhost:3000/api/techniciens/bestTechnician', { params }),
          axios.get('http://localhost:3000/api/tasks', { params })
        ]);

        setTotalEmployees(techniciensRes.data.totalTechniciens);
        setTotalGestionnaires(gestionnairesRes.data.totalGestionnaires);
        
        const formattedTasksPerMonth = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          count: tasksMonthRes.data.find(item => item.month === i + 1)?.count || 0
        }));
        setTasksPerMonth(formattedTasksPerMonth);
        
        setTotalTasks(tasksRes.data.totalTasks);
        setBestTechnician(bestTechRes.data?.name || 'Aucun');
        setTasks(tasksListRes.data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchData();
    fetchVehicules();
  }, [startDate, endDate, selectedYear]);

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
    const status = normalizedStatus(veh.status);
    const exist = acc.find((item) => item.name === status);
    if (exist) exist.value++;
    else acc.push({ name: status, value: 1 });
    return acc;
  }, []);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: colors.background 
    }}>
      <Content style={{ 
        margin: '24px 16px', 
        padding: 24, 
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24
        }}>
          <Title level={3} style={{ margin: 0, color: colors.dark }}>Tableau de Bord</Title>
          <Button 
            type="primary" 
            icon={<FilterOutlined />} 
            onClick={() => setVisible(true)}
            style={{
              background: colors.primary,
              borderColor: colors.primary,
              boxShadow: '0 2px 8px rgba(108,92,231,0.2)'
            }}
          >
            Filtrer
          </Button>
        </div>

        <Modal
          title="Filtrer par période"
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={() => setVisible(false)}
          footer={[
            <Button key="back" onClick={() => setVisible(false)}>
              Annuler
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={() => setVisible(false)}
              style={{ background: colors.primary, borderColor: colors.primary }}
            >
              Appliquer
            </Button>,
          ]}
        >
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            style={{ width: '100%' }}
          />
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: '100%', marginTop: 16 }}
            placeholder="Sélectionner une année"
          >
            {years.map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </Modal>

        <Row gutter={[16, 16]}>
          {[
            { 
              title: "Total Technicians", 
              value: totalEmployees, 
              color: colors.primary, 
              icon: <UserOutlined />,
              border: `2px solid ${colors.primary}`,
              bg: '#F3F0FF'
            },
            { 
              title: "Best Technician", 
              value: bestTechnician, 
              color: colors.success, 
              icon: <UserOutlined />,
              border: `2px solid ${colors.success}`,
              bg: '#E6F7F0'
            },
            { 
              title: "Total Gestionnaires", 
              value: totalGestionnaires, 
              color: colors.secondary, 
              icon: <UserOutlined />,
              border: `2px solid ${colors.secondary}`,
              bg: '#E6F7FF'
            },
            { 
              title: "Total Tasks", 
              value: totalTasks, 
              color: colors.warning, 
              icon: <UnorderedListOutlined />,
              border: `2px solid ${colors.warning}`,
              bg: '#FFF7E6'
            }
          ].map((item, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  background: item.bg,
                  textAlign: 'center',
                  border: item.border,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderRadius: 12,
                  padding: 0
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div style={{
                  border: `1px solid ${item.color}33`,
                  borderRadius: 8,
                  padding: 16,
                  background: 'white'
                }}>
                  <Statistic 
                    title={<Text style={{ color: colors.dark, fontWeight: 500 }}>{item.title}</Text>}
                    value={item.value} 
                    prefix={React.cloneElement(item.icon, { 
                      style: { 
                        color: item.color,
                        backgroundColor: `${item.color}20`,
                        borderRadius: '50%',
                        padding: 8,
                        fontSize: 18
                      } 
                    })}
                    valueStyle={{ 
                      color: colors.dark,
                      fontSize: 24,
                      fontWeight: 600
                    }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {/* Statut des Véhicules */}
          <Col xs={24} md={8}>
            <div style={{
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 12,
              padding: 16,
              height: '100%',
              background: '',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Card 
                title="📊 Statut des Véhicules" 
                style={{ 
                  height: '100%',
                  border: 'none',
                  boxShadow: 'none'
                }}
                headStyle={{ 
                  borderBottom: 0,
                  padding: 0,
                  marginBottom: 16
                }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getVehicleStatusColor(entry.name)} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          value, 
                          props.payload.name
                        ]}
                        contentStyle={{
                          background: colors.dark,
                          border: 'none',
                          borderRadius: 6,
                          color: 'white'
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        formatter={(value) => (
                          <span style={{ color: colors.dark }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </Col>

          {/* Répartition des Tâches */}
          <Col xs={24} md={8}>
            <div style={{
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 12,
              padding: 16,
              height: '100%',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Card 
                title="📌 Répartition des Tâches" 
                style={{ 
                  border: 'none',
                  boxShadow: 'none'
                }}
                headStyle={{ 
                  borderBottom: 0,
                  padding: 0,
                  marginBottom: 16
                }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 180,
                      height: 180,
                      borderRadius: '50%',
                      background: `conic-gradient(
                        ${colors.danger} 0deg ${completedTasksPercent * 3.6}deg,
                        ${colors.warning} ${completedTasksPercent * 3.6}deg ${(completedTasksPercent + plannedTasksPercent) * 3.6}deg,
                        ${colors.success} ${(completedTasksPercent + plannedTasksPercent) * 3.6}deg 360deg
                      )`,
                      margin: '0 auto 24px',
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
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1) inset'
                      }}
                    >
                      <Text strong style={{ fontSize: 24, color: colors.dark }}>
                        {`${completedTasksPercent}%`}
                      </Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Terminées', value: completedTasksPercent, color: colors.danger },
                      { label: 'Planifiées', value: plannedTasksPercent, color: colors.warning },
                      { label: 'En cours', value: activeTasksPercent, color: colors.success }
                    ].map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: item.color,
                          marginRight: 8
                        }} />
                        <Text style={{ color: colors.dark }}>
                          {item.label} ({item.value}%)
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          {/* Tâches par Mois */}
          <Col xs={24} md={8}>
            <div style={{
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 12,
              padding: 16,
              height: '100%',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Card 
                title="📅 Tâches par Mois" 
                style={{ 
                  border: 'none',
                  boxShadow: 'none'
                }}
                headStyle={{ 
                  borderBottom: 0,
                  padding: 0,
                  marginBottom: 16
                }}
                bodyStyle={{ padding: 0 }}
                extra={
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: 100 }}
                    size="small"
                  >
                    {years.map((year) => (
                      <Select.Option key={year} value={year}>
                        {year}
                      </Select.Option>
                    ))}
                  </Select>
                }
              >
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <TaskBarChart data={tasksPerMonth} />
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomeDashboard;