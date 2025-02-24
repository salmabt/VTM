import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, Spin, message } from 'antd';
import { 
  CalendarOutlined, FileTextOutlined,
  UnorderedListOutlined, LogoutOutlined, CarOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import vehiculesApi from '../api/vehicules';
import techniciensApi from '../api/techniciens';
import tasksApi from '../api/tasks';
import Calendrier from './Gestionnaire/Calendrier';
import Rapports from './Gestionnaire/Rapports';
import Taches from './Gestionnaire/Taches';
import Vehicules from './Gestionnaire/Vehicules';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const GestionnaireDashboard = () => {
  const { userData, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [loading, setLoading] = useState(false);
  const [techniciens, setTechniciens] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [techTasks, setTechTasks] = useState([]);
  const [assignedVehicles, setAssignedVehicles] = useState([]);

  // Chargement initial des données
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [tasksRes, techRes, vehRes] = await Promise.all([
          tasksApi.getAllTasks(),
          techniciensApi.getAllTechniciens(),
          vehiculesApi.getAllVehicules()
        ]);
        
        // Normalisation des données
        const normalizedTasks = (tasksRes.data || []).map(task => ({
          ...task,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate),
          technicien: task.technicien?._id || task.technicien,
          vehicule: task.vehicule?._id || task.vehicule
        }));

        setTasks(normalizedTasks);
        setTechniciens(techRes.data || []);
        setVehicules(vehRes.data || []);

      } catch (error) {
        console.error('Erreur de chargement:', error);
        message.error('Échec du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Mise à jour des données du technicien sélectionné
  useEffect(() => {
    const updateTechnicianData = () => {
      if (!selectedTech) {
        setTechTasks([]);
        setAssignedVehicles([]);
        return;
      }

      const validTasks = tasks.filter(task => 
        task.technicien === selectedTech._id && 
        vehicules.some(v => v._id === task.vehicule)
      );

      const vehicleIds = [...new Set(validTasks.map(t => t.vehicule))];
      const filteredVehicles = vehicules.filter(v => vehicleIds.includes(v._id));

      setTechTasks(validTasks);
      setAssignedVehicles(filteredVehicles);
    };

    updateTechnicianData();
  }, [tasks, vehicules, selectedTech]);

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <FileTextOutlined />, label: 'Rapports' },
    { key: '3', icon: <UnorderedListOutlined />, label: 'Tâches' },
    { key: '4', icon: <CarOutlined />, label: 'Véhicules' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light">
        <div className="logo" style={{ padding: 16, textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>VTM Dashboard</Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <Typography.Text strong>
            Connecté en tant que : {userData?.name || 'Utilisateur'}
          </Typography.Text>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={logout}
            danger
          >
            Déconnexion
          </Button>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          minHeight: 'calc(100vh - 112px)'
        }}>
          {loading ? (
            <Spin 
              size="large" 
              style={{ 
                display: 'block', 
                margin: '50px auto' 
              }} 
            />
          ) : (
            <>
              {selectedMenu === '1' && (
                <Calendrier 
                  techniciens={techniciens}
                  tasks={tasks}
                  vehicules={vehicules}
                  selectedTech={selectedTech}
                  setSelectedTech={setSelectedTech}
                  techTasks={techTasks}
                  assignedVehicles={assignedVehicles}
                />
              )}
              
              {selectedMenu === '2' && <Rapports tasks={tasks} />}
              
              {selectedMenu === '3' && (
                <Taches 
                  tasks={tasks}
                  setTasks={setTasks}
                  techniciens={techniciens}
                  vehicules={vehicules}
                />
              )}
              
              {selectedMenu === '4' && (
                <Vehicules 
                  vehicules={vehicules}
                  setVehicules={setVehicules}
                />
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default GestionnaireDashboard;