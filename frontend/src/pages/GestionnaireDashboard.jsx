import React, { useState, useEffect } from 'react';
import { 
  Layout, Menu, Input, DatePicker, Typography, Button, Card, List, 
  Select, message, Spin, Tag 
} from 'antd';
import { 
  CalendarOutlined, FileTextOutlined, 
  UnorderedListOutlined, LogoutOutlined, CarOutlined 
} from '@ant-design/icons';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../contexts/AuthContext';
import vehiculesApi from '../api/vehicules';
import techniciensApi from '../api/techniciens';
import tasksApi from '../api/tasks';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const localizer = momentLocalizer(moment);

moment.locale('fr');

const GestionnaireDashboard = () => {
  const { userData, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [loading, setLoading] = useState(false);
  const [techniciens, setTechniciens] = useState([]);
  const [vehiculesList, setVehiculesList] = useState([]);

  // États pour les véhicules
  const [vehicules, setVehicules] = useState([]);
  const [newVehicule, setNewVehicule] = useState({
    registration: '',
    model: '',
    status: 'disponible'
  });
  
  // États pour les tâches
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    client: '',
    location: '',
    startDate: null,
    endDate: null,
    technicien: '',
    vehicule: '',
    status: 'planifié'
  });
  const TechnicienList = () => {
    const [techniciens, setTechniciens] = useState([]);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          const response = await techniciensApi.getAllTechniciens();
          setTechniciens(response.data);
        } catch (error) {
          console.error('Erreur de chargement:', error);
        }
      };
      loadData();
    }, []);
  
    return (
      <div>
        {techniciens.map(tech => (
          <div key={tech._id}>
            <h3>{tech.name}</h3>
            <p>Compétences: {tech.skills?.join(', ') || 'Aucune'}</p>
          </div>
        ))}
      </div>
    );
  };

  // Chargement des données initiales
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [tasksRes, techRes, vehRes] = await Promise.all([
          tasksApi.getAllTasks(),
          techniciensApi.getAllTechniciens(),
          vehiculesApi.getAllVehicules()
        ]);

        setTasks(tasksRes.data);
        setTechniciens(techRes.data);
        setVehiculesList(vehRes.data);
        setVehicules(vehRes.data);
      } catch (error) {
        console.error('Erreur initiale:', error);
        message.error(error.response?.data?.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Chargement des données selon le menu
  useEffect(() => {
    const loadMenuData = async () => {
      if (selectedMenu === '3' || selectedMenu === '4') {
        setLoading(true);
        try {
          if (selectedMenu === '3') {
            const { data } = await tasksApi.getAllTasks();
            setTasks(data);
          }
          if (selectedMenu === '4') {
            const { data } = await vehiculesApi.getAllVehicules();
            setVehicules(data);
          }
        } catch (error) {
          message.error(error.response?.data?.message || 'Erreur de chargement');
        } finally {
          setLoading(false);
        }
      }
    };
    loadMenuData();
  }, [selectedMenu]);

  // Gestion véhicules
  const handleAddVehicule = async () => {
    try {
      const { data } = await vehiculesApi.createVehicule(newVehicule);
      setVehicules([...vehicules, data]);
      setNewVehicule({ registration: '', model: '', status: 'disponible' });
      message.success('Véhicule ajouté avec succès');
    } catch (error) {
      message.error(error.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const handleDeleteVehicule = async (id) => {
    try {
      await vehiculesApi.deleteVehicule(id);
      setVehicules(vehicules.filter(v => v._id !== id));
      message.success('Véhicule supprimé avec succès');
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur de suppression');
    }
  };

  // Gestion tâches
  const handleCreateTask = async () => {
    try {
      if (!newTask.startDate || !newTask.endDate) {
        return message.error('Sélectionnez une plage horaire');
      }

      const taskData = {
        ...newTask,
        startDate: moment(newTask.startDate).toISOString(),
        endDate: moment(newTask.endDate).toISOString()
      };
      
      const { data } = await tasksApi.createTask(taskData);
      setTasks([...tasks, data]);
      setNewTask({
        title: '',
        description: '',
        client: '',
        location: '',
        startDate: null,
        endDate: null,
        technicien: '',
        vehicule: '',
        status: 'planifié'
      });
      message.success('Tâche créée avec succès');
    } catch (error) {
      console.error('Erreur création:', error.response?.data);
      message.error(error.response?.data?.message || "Erreur de création");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      message.success('Tâche supprimée avec succès');
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur de suppression');
    }
  };

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <FileTextOutlined />, label: 'Rapports' },
    { key: '3', icon: <UnorderedListOutlined />, label: 'Tâches' },
    { key: '4', icon: <CarOutlined />, label: 'Voitures' },
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
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text strong>Connecté en tant que : {userData?.name}</Text>
          </div>
          <Button icon={<LogoutOutlined />} onClick={logout}>Déconnexion</Button>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {loading ? (
            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          ) : (
            <>
              {selectedMenu === '1' && (
                <Card title="Calendrier des interventions" bordered={false}>
                  <Calendar
                    localizer={localizer}
                    events={tasks.map(task => ({
                      title: task.title,
                      start: new Date(task.startDate),
                      end: new Date(task.endDate),
                      allDay: false,
                      resource: task
                    }))}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    messages={{
                      today: "Aujourd'hui",
                      previous: 'Précédent',
                      next: 'Suivant'
                    }}
                  />
                </Card>
              )}

              {selectedMenu === '2' && (
                <Card title="Rapports d'intervention" bordered={false}>
                  <List
                    dataSource={tasks.filter(t => t.report)}
                    renderItem={task => (
                      <List.Item>
                        <List.Item.Meta
                          title={task.title}
                          description={
                            <div>
                              <Text strong>Technicien: </Text>
                              <Text>{task.technicien?.user?.name || 'Non assigné'}</Text><br />
                              <Text strong>Durée: </Text>
                              <Text>{task.report?.timeSpent}h</Text><br />
                              <Text strong>Résolution: </Text>
                              <Text>{task.report?.resolution}</Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              )}

              {selectedMenu === '3' && (
                <Card title="Gestion des tâches" bordered={false}>
                  <div style={{ marginBottom: 16, display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    <Input
                      placeholder="Titre *"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                    <Input.TextArea
                      placeholder="Description détaillée *"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      rows={3}
                    />
                    <Input
                      placeholder="Client *"
                      value={newTask.client}
                      onChange={(e) => setNewTask({...newTask, client: e.target.value})}
                    />
                    <Input
                      placeholder="Localisation"
                      value={newTask.location}
                      onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    />
                                      <RangePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            onChange={(dates) => setNewTask({
                              ...newTask,
                              startDate: dates?.[0]?.toISOString(),
                              endDate: dates?.[1]?.toISOString()
                            })}
                            disabledDate={(current) => {
                              // Interdit les dates avant le 1er janvier 2025 et après le 30 décembre 2025
                              return current && (current < moment('2025-01-01', 'YYYY-MM-DD') || current > moment('2025-12-30', 'YYYY-MM-DD'));
                            }}
                          />


      
                    <Select
                      placeholder="Sélectionner un technicien *"
                      loading={!techniciens.length}
                      // Modifiez les options des techniciens :
                      options={techniciens.map(t => ({
                        label: `${t.name}${t.skills?.length ? ` (${t.skills.join(', ')})` : ''}`,
                        value: t._id
                      }))}
                      onChange={value => setNewTask({...newTask, technicien: value})}
                    />
                    <Select
                      placeholder="Sélectionner un véhicule *"
                      onChange={(value) => setNewTask({...newTask, vehicule: value})}
                    >
                      {vehiculesList.map(veh => (
                        <Option key={veh._id} value={veh._id}>
                          {veh.model} ({veh.registration})
                        </Option>
                      ))}
                    </Select>
                    <Button 
                      type="primary" 
                      onClick={handleCreateTask}
                      disabled={!newTask.title || !newTask.description || !newTask.technicien}
                    >
                      Créer Tâche
                    </Button>
                  </div>

                  <List
                    dataSource={tasks}
                    renderItem={task => (
                      <List.Item
                        actions={[
                          <Button danger onClick={() => handleDeleteTask(task._id)}>
                            Supprimer
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={<Text strong>{task.title}</Text>}
                          description={
                            <div>
                              <Text>Client: {task.client}</Text><br />
                              <Text>Localisation: {task.location}</Text><br />
                              <Text>Statut: <Tag color={
                                task.status === 'planifié' ? 'blue' : 
                                task.status === 'en cours' ? 'orange' : 'green'
                              }>{task.status}</Tag></Text><br />
                              <Text>Période: {moment(task.startDate).format('DD/MM HH:mm')} - {moment(task.endDate).format('DD/MM HH:mm')}</Text><br />
                              <Text>Technicien: {task.technicien?.name || 'Non assigné'}</Text><br />
                              <Text>Véhicule: {task.vehicule?.model} ({task.vehicule?.registration})</Text>
                              {task.report && (
                                <div style={{ marginTop: 10, padding: 10, background: '#f6f6f6', borderRadius: 4 }}>
                                  <Text strong>Rapport d'intervention:</Text><br />
                                  <Text>Temps passé: {task.report.timeSpent}h</Text><br />
                                  <Text>Problèmes: {task.report.issues}</Text><br />
                                  <Text>Résolution: {task.report.resolution}</Text>
                                </div>
                              )}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              )}

              {selectedMenu === '4' && (
                <Card title="Gestion des véhicules" bordered={false}>
                  <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Input
                      placeholder="Immatriculation *"
                      value={newVehicule.registration}
                      onChange={(e) => setNewVehicule({...newVehicule, registration: e.target.value})}
                      style={{ width: 200 }}
                    />
                    <Input
                      placeholder="Modèle *"
                      value={newVehicule.model}
                      onChange={(e) => setNewVehicule({...newVehicule, model: e.target.value})}
                      style={{ width: 200 }}
                    />
                    <Select
                      value={newVehicule.status}
                      onChange={(value) => setNewVehicule({...newVehicule, status: value})}
                      style={{ width: 150 }}
                    >
                      <Option value="disponible">Disponible</Option>
                      <Option value="en entretien">En entretien</Option>
                      <Option value="réservé">Réservé</Option>
                    </Select>
                    <Button 
                      type="primary" 
                      onClick={handleAddVehicule}
                      disabled={!newVehicule.registration || !newVehicule.model}
                      style={{ minWidth: 150 }}
                    >
                      Ajouter Véhicule
                    </Button>
                  </div>
                  <List
                    dataSource={vehicules}
                    renderItem={vehicule => (
                      <List.Item
                        actions={[
                          <Button danger onClick={() => handleDeleteVehicule(vehicule._id)}>
                            Supprimer
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Text strong>
                              {vehicule.model} ({vehicule.registration})
                            </Text>
                          }
                          description={
                            <Text 
                              type={vehicule.status === 'disponible' ? 'success' : 'warning'}
                            >
                              Statut: {vehicule.status}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default GestionnaireDashboard;