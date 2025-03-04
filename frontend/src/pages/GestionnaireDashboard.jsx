import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Input, DatePicker, Typography, Button, Card, List,
  Select, message, Spin, Tag, Modal
} from 'antd';
import {
  CalendarOutlined, FileTextOutlined,
  UnorderedListOutlined, LogoutOutlined, CarOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../contexts/AuthContext';
import vehiculesApi from '../api/vehicules';
import techniciensApi from '../api/techniciens';
import tasksApi from '../api/tasks';
import notesApi from '../api/notes'; 
import TaskModal from '../components/TaskModal';
import TechniciensSection from '../components/TechniciensSection';

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
  const [vehicules, setVehicules] = useState([]);
  const [newVehicule, setNewVehicule] = useState({
    registration: '',
    model: '',
    status: 'disponible'
  });
  // États pour les tâches
  // Ajoutez ces états dans le composant parent
const [selectedTask, setSelectedTask] = useState(null);
const [selectedTech, setSelectedTech] = useState(null);
const [techTasks, setTechTasks] = useState([]);
const [assignedVehicles, setAssignedVehicles] = useState([]);
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
  // Ajoute ces états pour le modal et la date sélectionnée
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  
  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await notesApi.createNote({
          content: newNote,
          author: userData.name,
          timestamp: new Date(),
        });
        // Ici, response est directement la note créée
        if (response && response._id) {
          setNotes((prevNotes) => [...(prevNotes || []), response]);
          setNewNote('');
          message.success('Note ajoutée avec succès');
        } else {
          console.error('Réponse de l\'API invalide:', response);
          message.error('Erreur lors de l\'ajout de la note');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la note:', error);
        message.error('Erreur lors de l\'ajout de la note');
      }
    } else {
      message.warning('Veuillez écrire une note avant de l\'ajouter.');
    }
  };
  


  // Exemple d'utilisation pour charger les notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await notesApi.getAllNotes();
        console.log('Réponse complète de l\'API:', response);
  
        // Ici, response est déjà le tableau de notes
        if (Array.isArray(response)) {
          setNotes(response);
        } else {
          console.error('Réponse de l\'API invalide:', response);
          message.error('Les données reçues ne sont pas valides.');
        }
      } catch (error) {
        console.error('Erreur de chargement des notes:', error);
        message.error('Erreur de chargement des notes');
      }
    };
  
    loadNotes();
  }, []);
  

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
  // Ajouter ce useEffect pour synchroniser périodiquement
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const { data } = await vehiculesApi.getAllVehicules();
      setVehiculesList(data);
    } catch (error) {
      console.error('Sync error:', error);
    }
  }, 5000); // Toutes les 5 secondes

  return () => clearInterval(interval);
}, []);
// Modification du chargement initial
useEffect(() => {
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [tasksRes, techRes, vehRes] = await Promise.all([
        tasksApi.getAllTasks(),
        techniciensApi.getAllTechniciens(),
        vehiculesApi.getAllVehicules()
      ]);
      
      // Normalisation renforcée
      const normalizedTasks = tasksRes.data.map(task => ({
        ...task,
        technicien: task.technicien?._id || task.technicien,
        vehicule: task.vehicule?._id || task.vehicule
      }));

      setTasks(normalizedTasks);
      setTechniciens(techRes.data);
      setVehicules(vehRes.data);
      setVehiculesList(vehRes.data);

    } catch (error) {
      console.error('Erreur initiale:', error);
      message.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };
  loadAllData();
}, []);
 // Remplacer l'effet existant par ceci
useEffect(() => {
  const updateTechnicianData = () => {
    if (!selectedTech) return;
    
    const validTasks = tasks.filter(task => 
      task.technicien === selectedTech._id && 
      vehicules.some(v => v._id === task.vehicule)
    );

    setTechTasks(validTasks);
    setAssignedVehicles(
      vehicules.filter(v => 
        validTasks.some(task => task.vehicule === v._id)
      )
    );
  };

  updateTechnicianData();
}, [tasks, vehicules, selectedTech]); // Déclenché après CHAQUE mise à jour
  // Chargement des données selon le menu
  // Modifier l'effet du menu
useEffect(() => {
  const loadMenuData = async () => {
    if (selectedMenu === '3' || selectedMenu === '4') {
      setLoading(true);
      try {
        if (selectedMenu === '3') {
          const { data } = await tasksApi.getAllTasks();
          setTasks(data.map(t => ({
            ...t,
            technicien: t.technicien?._id || t.technicien,
            vehicule: t.vehicule?._id || t.vehicule
          })));
        }
        if (selectedMenu === '4') {
          const { data } = await vehiculesApi.getAllVehicules();
          setVehicules(data);
        }
      } catch (error) {
        message.error('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    }
  };
  loadMenuData();
}, [selectedMenu]);
  // Ajoutez cet effet pour maintenir les données
useEffect(() => {
  if (selectedTech) {
    const filteredTasks = tasks.filter(task => 
      task.technicien === selectedTech._id && 
      vehicules.some(v => v._id === task.vehicule)
    );
    setTechTasks(filteredTasks);
    const vehicleIds = filteredTasks.map(task => task.vehicule);
    setAssignedVehicles(vehicules.filter(veh => vehicleIds.includes(veh._id)));
  }
}, [tasks, vehicules]); // Déclenché à chaque changement de tâches ou véhicules
  // Gestion véhicules
  const handleAddVehicule = async () => {
    try {
      const { data } = await vehiculesApi.createVehicule(newVehicule);
      setVehicules(prev => [...prev, data]);
      setVehiculesList(prev => [...prev, data]);
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
    let normalizedTask; // Déclarer la variable en haut
    let createdTask; // Déclarer la variable pour le rollback
  
    try {
      // Validation des champs obligatoires
      const requiredFields = {
        title: 'Titre',
        description: 'Description',
        technicien: 'Technicien',
        vehicule: 'Véhicule',
        startDate: 'Date de début',
        endDate: 'Date de fin'
      };
  
      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !newTask[key])
        .map(([, value]) => value);
  
      if (missingFields.length > 0) {
        return message.error(`Champs requis manquants : ${missingFields.join(', ')}`);
      }
  
      // Validation des dates
      const start = moment(newTask.startDate);
      const end = moment(newTask.endDate);
  
      if (!start.isValid() || !end.isValid()) {
        return message.error('Format de date invalide');
      }
  
      if (end.isBefore(start)) {
        return message.error('La date de fin doit être après la date de début');
      }
  
      // Création de l'objet normalisé
      normalizedTask = {
        ...newTask,
        technicien: newTask.technicien,
        vehicule: newTask.vehicule,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      };
  
      // Mise à jour optimiste IMMÉDIATE du statut du véhicule
      setVehiculesList(prev => 
        prev.map(veh => 
          veh._id === normalizedTask.vehicule 
            ? { ...veh, status: 'réservé' } 
            : veh
        )
      );
  
      // Création de la tâche
      const response = await tasksApi.createTask(normalizedTask);
      createdTask = response.data;
  
      // Mise à jour optimiste des tâches
      setTasks(prev => [
        ...prev,
        {
          ...createdTask,
          technicien: createdTask.technicien?._id || createdTask.technicien,
          vehicule: createdTask.vehicule?._id || createdTask.vehicule
        }
      ]);
  
      // Mise à jour API du statut du véhicule
      await vehiculesApi.updateVehicule(normalizedTask.vehicule, {
        status: 'réservé'
      });
  
      // Réinitialisation du formulaire
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
  
      // Fermeture du modal
      setTimeout(() => setIsModalVisible(false), 300);
      message.success('Tâche créée avec succès !');
  
    } catch (error) {
      // Rollback en cas d'erreur
      if (normalizedTask) {
        setVehiculesList(prev => 
          prev.map(veh => 
            veh._id === normalizedTask.vehicule 
              ? { ...veh, status: 'disponible' } 
              : veh
          )
        );
      }
  
      if (createdTask?._id) {
        setTasks(prev => prev.filter(t => t._id !== createdTask._id));
      }
  
      // Gestion des erreurs
      const errorMessage = error.response?.data?.message ||
        (error.code === 'ECONNABORTED' 
          ? 'Timeout - Vérifiez votre connexion' 
          : 'Erreur technique');
  
      console.error('Échec de création:', error);
      message.error(`Échec : ${errorMessage}`);
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
    { key: '5', icon: <ClockCircleOutlined />, label: 'Chronologie' },
  ];
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#f0f0f', // Couleur de fond
        border: '1px solid #ccc', // Bordure
        borderRadius: '4px', // Coins arrondis
        padding: '4px', // Espacement interne
      },
    };
  };
  // Composant personnalisé pour afficher les événements
  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <div>{event.resource.technicien?.name || 'Non assigné'}</div>
    </div>
    );
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible theme="light">
          <div className="logo" style={{ padding: 16, textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedMenu]}
            items={menuItems || []}
            onSelect={({ key }) => setSelectedMenu(key)}
          />
        </Sider>
        {selectedTask && (
  <Modal
    title="Détails de la tâche"
    visible={!!selectedTask}
    onCancel={() => setSelectedTask(null)}
    footer={[
      <Button key="close" onClick={() => setSelectedTask(null)}>
        Fermer
      </Button>
    ]}
  >
    <div>
      <Text strong>Titre : </Text>
      <Text>{selectedTask.title}</Text><br/>
      
      <Text strong>Client : </Text>
      <Text>{selectedTask.client}</Text><br/>
      
      <Text strong>Localisation : </Text>
      <Text>{selectedTask.location}</Text><br/>
      
      <Text strong>Période : </Text>
      <Text>
        {moment(selectedTask.startDate).format('DD/MM HH:mm')} - 
        {moment(selectedTask.endDate).format('DD/MM HH:mm')}
      </Text><br/>
      
      <Text strong>Technicien : </Text>
      <Text>
        {selectedTask.technicien?.name || 'Non assigné'}
      </Text><br/>
      
      <Text strong>Véhicule : </Text>
      <Text>
      {selectedTask.vehicule?.model || 'Non assigné'}
      </Text><br/>
      
      <Text strong>Statut : </Text>
      <Tag color={
        selectedTask.status === 'planifié' ? 'blue' :
        selectedTask.status === 'en cours' ? 'orange' : 'green'
      }>
        {selectedTask.status}
      </Tag>
    </div>
  </Modal>
)}
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
                    <TechniciensSection 
                      techniciens={techniciens}
                      tasks={tasks}
                      vehicules={vehicules}
                      // Passez les états et setters
                      selectedTech={selectedTech}
                      onTechSelect={setSelectedTech}
                      techTasks={techTasks}
                      onTasksUpdate={setTechTasks}
                      assignedVehicles={assignedVehicles}
                      onVehiclesUpdate={setAssignedVehicles}
                    />
    
                    <Calendar
                     localizer={localizer}
                     events={tasks.map(task => {
                       const tech = techniciens.find(t => t._id === task.technicien);
                       const veh = vehicules.find(v => v._id === task.vehicule);
                       return {
                         title: `${task.title} - ${tech?.name || 'Non assigné'}`,
                         start: new Date(task.startDate),
                         end: new Date(task.endDate),
                         allDay: false,
                         resource: { ...task, technicien: tech, vehicule: veh }
                       };
                     })}
                     onSelectEvent={(event) => setSelectedTask(event.resource)}
                              startAccessor="start"
                              endAccessor="end"
                              style={{ height: 600 }}
                              views={['month', 'week', 'day', 'agenda']}
                              messages={{
                                today: "Aujourd'hui",
                                previous: 'Précédent',
                                next: 'Suivant',
                                month: 'Mois',
                                week: 'Semaine',
                                day: 'Jour',
                                agenda: 'Agenda',
                              }}
                              formats={{
                                agendaHeaderFormat: ({ start, end }) =>
                                  `${moment(start).format("DD/MM/YYYY")} – ${moment(end).format("DD/MM/YYYY")}`
                              }}
                              selectable
                              onSelectSlot={(slotInfo) => {
                                  setSelectedDate(slotInfo.start);
                                  setNewTask({ ...newTask, startDate: slotInfo.start });
                                  setIsModalVisible(true);
                              }}
                              eventPropGetter={eventStyleGetter} // Appliquer le style personnalisé
                              components={{
                                event: CustomEvent // Utiliser le composant personnalisé pour les événements
                              }}
                            />
                            </Card>
                            )}
                            {/* Affichage du modal pour ajouter une tâche */}
                              <TaskModal
                                isModalVisible={isModalVisible}
                                setIsModalVisible={setIsModalVisible}
                                newTask={newTask}
                                setNewTask={setNewTask}
                                handleCreateTask={handleCreateTask}
                                techniciens={techniciens}
                                vehiculesList={vehiculesList}
                              />
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
                    {/* Les champs de formulaire restent inchangés */}
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
                    />
                    <Select
                      placeholder="Sélectionner un technicien *"
                      loading={!techniciens.length}
                      options={techniciens.map(t => ({
                        label: `${t.name}${t.skills?.length ? ` (${t.skills.join(', ')})` : ''}`,
                        value: t._id
                      }))}
                      onChange={value => setNewTask({...newTask, technicien: value})}
                    />
                 <Select
  placeholder="Sélectionner un véhicule *"
  onChange={(value) => setNewTask({...newTask, vehicule: value})}
  value={newTask.vehicule}
  showSearch
  optionFilterProp="children"
  filterOption={(input, option) => 
    option.children.toLowerCase().includes(input.toLowerCase())
  }
  allowClear
  style={{ width: '100%' }}
>
  {vehiculesList
    .filter(veh => 
      veh.status === 'disponible' || 
      veh._id === newTask.vehicule // Garde le véhicule sélectionné visible
    )
    .map(veh => (
      <Option key={veh._id} value={veh._id}>
        {veh.model} ({veh.registration}) - {veh.status}
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
                    renderItem={task => {
                      // Ajout des constantes ici
                      const assignedTechnicien = techniciens.find(t => t._id === task.technicien);
                      const assignedVehicule = vehicules.find(v => v._id === task.vehicule);

                      return (
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
                                {/* Modification ici */}
                                <Text>Technicien: {assignedTechnicien?.name || 'Non assigné'}</Text><br />
                                {/* Et ici */}
                                <Text>Véhicule: {assignedVehicule?.model} ({assignedVehicule?.registration || 'N/A'})</Text>
                                {task.report && (
                                  <div style={{ marginTop: 10, padding: 10, background: '#F6F6F6', borderRadius: 4 }}>
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
                      );
                    }}
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

          {selectedMenu === '5' && ( // Section Chronologie
            <Card title="Chronologie des notes" bordered={false}>
              <Input.TextArea
                rows={4}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Écrire une note..."
                style={{ marginBottom: 16 }}
              />
              <Button type="primary" onClick={handleAddNote}>
                Ajouter une note
              </Button>

              {/* Ajoutez un indicateur de chargement */}
              {loading ? (
                <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
              ) : (
                <List
                  dataSource={notes || []} // Assurez-vous que notes est toujours un tableau
                  renderItem={note => {
                    if (!note) return null; // Ignore les notes invalides
                    return (
                      <List.Item key={note._id || note.timestamp}>
                        <List.Item.Meta
                          title={<Text strong>{note.author}</Text>}
                          description={
                            <div>
                              <Text>{note.content || 'Pas de contenu'}</Text>
                              <br />
                              <Text type="secondary">
                                {new Date(note.timestamp).toLocaleString()}
                              </Text>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              )}
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