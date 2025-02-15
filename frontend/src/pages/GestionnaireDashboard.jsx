import React, { useState } from 'react';

import { Layout, Menu, Input, Badge, Avatar, Typography, Button, Card, Popover, List } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  UnorderedListOutlined, 
  BellOutlined, 
  SearchOutlined,
  CarOutlined 
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const localizer = momentLocalizer(moment);

const GestionnaireDashboard = () => {
  const { userData, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [notifications] = useState([
    { id: 1, title: 'Nouveau rapport disponible', date: '2024-03-15' },
    { id: 2, title: 'Tâche échéance demain', date: '2024-03-16' },
  ]);
  
  // État pour la gestion des voitures
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ marque: '', modele: '', annee: '' });
  
  // État pour la gestion du calendrier
  const [events, setEvents] = useState([]);

  const handleLogout = () => logout();
//---------------------------



  // Configuration du menu
  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <FileTextOutlined />, label: 'Rapports' },
    { key: '3', icon: <UnorderedListOutlined />, label: 'Tâches' },
    { key: '4', icon: <CarOutlined />, label: 'Voitures' },
  ];

  // Gestion des voitures
  const handleAddCar = () => {
    if (newCar.marque && newCar.modele && newCar.annee) {
      setCars([...cars, { ...newCar, id: Date.now() }]);
      setNewCar({ marque: '', modele: '', annee: '' });
    }
  };

  const handleDeleteCar = (id) => {
    setCars(cars.filter(car => car.id !== id));
  };

  // Gestion du calendrier
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt('Entrez le titre de l\'événement:');
    if (title) {
      const newEvent = {
        title,
        start,
        end,
        id: Date.now()
      };
      setEvents([...events, newEvent]);
    }
  };

  const notificationsContent = (
    <List
      dataSource={notifications}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={item.date}
          />
        </List.Item>
      )}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light">
        <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4}>Tableau de Bord</Title>
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
          <Search
            placeholder="Rechercher..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Popover content={notificationsContent} trigger="click">
              <Badge count={notifications.length}>
                <Avatar 
                  icon={<BellOutlined />} 
                  style={{ cursor: 'pointer' }}
                />
              </Badge>
            </Popover>
            
            <Button type="primary" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {selectedMenu === '1' && (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              culture="fr"
              selectable
              onSelectSlot={handleSelectSlot}
              messages={{
                today: "Aujourd'hui",
                previous: 'Précédent',
                next: 'Suivant',
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                agenda: 'Agenda',
                date: 'Date',
                time: 'Heure',
                event: 'Événement',
              }}
            />
          )}

          {selectedMenu === '2' && (
            <Card title="Rapports">
              <p>Contenu des rapports...</p>
            </Card>
          )}

          {selectedMenu === '3' && (
            <Card title="Gestion des Tâches">
              <p>Liste des tâches...</p>
            </Card>
          )}

          {selectedMenu === '4' && (
            <Card title="Gestion des Voitures">
              <div style={{ marginBottom: 16 }}>
                <Input
                  placeholder="Marque"
                  value={newCar.marque}
                  onChange={(e) => setNewCar({ ...newCar, marque: e.target.value })}
                  style={{ width: 200, marginRight: 8 }}
                />
                <Input
                  placeholder="Modèle"
                  value={newCar.modele}
                  onChange={(e) => setNewCar({ ...newCar, modele: e.target.value })}
                  style={{ width: 200, marginRight: 8 }}
                />
                <Input
                  placeholder="Année"
                  type="number"
                  value={newCar.annee}
                  onChange={(e) => setNewCar({ ...newCar, annee: e.target.value })}
                  style={{ width: 100, marginRight: 8 }}
                />
                <Button type="primary" onClick={handleAddCar}>
                  Ajouter Voiture
                </Button>
              </div>
              <List
                dataSource={cars}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button danger onClick={() => handleDeleteCar(item.id)}>
                        Supprimer
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={`${item.marque} ${item.modele}`}
                      description={`Année: ${item.annee}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default GestionnaireDashboard;