//frontend/src/pages/gestionnairedashboard
import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Input, DatePicker, Typography, Button, Card, List,
  Select, message, Spin, Tag, Modal,Badge ,Popover
} from 'antd';
import {
  CalendarOutlined, FileTextOutlined,
  UnorderedListOutlined, LogoutOutlined, CarOutlined, ClockCircleOutlined, BellOutlined 
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
    status: 'planifié',
    files: []
  });
  // Ajoute ces états pour le modal et la date sélectionnée
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [noteNotifications, setNoteNotifications] = useState([]);
  ///////editvoiture/////////
  const [editingVehicule, setEditingVehicule] = useState(null);
const [isEditModalVisible, setIsEditModalVisible] = useState(false);

//////////////////
const [calendarDate, setCalendarDate] = useState(new Date());
const [calendarView, setCalendarView] = useState('month');


const [editingTask, setEditingTask] = useState(null); // Pour stocker la tâche en cours de modification
const [isTaskEditModalVisible, setIsTaskEditModalVisible] = useState(false); // Pour gérer la visibilité du modal
const [existingAttachments, setExistingAttachments] = useState([]); // Pour les pièces jointes existantes
const [newFiles, setNewFiles] = useState([]); // Pour les nouveaux fichiers
useEffect(() => {
  const unreadNotifications = noteNotifications.filter(n => !n.read);
  setNoteNotifications(unreadNotifications);
}, [noteNotifications]);
useEffect(() => {
  const loadNoteNotifications = async () => {
    try {
      const response = await axios.get('/api/notes/notifications', {
        params: {
          role: 'gestionnaire',
          read: false
        }
      });
      setNoteNotifications(response.data);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };
  loadNoteNotifications();
}, []);

// Connexion SSE
useEffect(() => {
  const sse = new EventSource('http://localhost:3000/api/notes/notifications/sse', {
    withCredentials: true // Inclure les cookies d'authentification
  });

  const handleNotification = (e) => {
    try {
      const newNotif = JSON.parse(e.data);
      
      // Vérifier que la notification ne vient pas de l'utilisateur courant
      if (newNotif.senderId !== userData._id) {
        setNoteNotifications(prev => [
          { 
            ...newNotif,
            createdAt: new Date(newNotif.createdAt),
            read: false
          },
          ...prev
        ]);
        message.info('Nouvelle notification de note !');
      }
    } catch (error) {
      console.error('Erreur parsing SSE:', error);
    }
  };

  sse.addEventListener('notification', handleNotification);
  
  return () => {
    sse.removeEventListener('notification', handleNotification);
    sse.close();
  };
}, [userData._id]); // Dépendance sur l'ID utilisateur
const handleAddNote = async () => {
  if (newNote.trim()) {
    try {
      await notesApi.createNote({
        content: newNote,
        author: userData.name,
        userId: userData._id
      });

      setNewNote('');

      // Rafraîchir immédiatement la liste des notes après l'ajout
      const updatedNotes = await notesApi.getAllNotes();
      setNotes(updatedNotes);

      message.success('Note ajoutée avec succès');
    } catch (error) {
      message.error('Erreur lors de l\'ajout de la note');
    }
  }
};


  


  // Exemple d'utilisation pour charger les notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await notesApi.getAllNotes();
        if (Array.isArray(response)) {
          setNotes(response);
        }
      } catch (error) {
        console.error('Erreur de chargement des notes:', error);
      }
    };
  
    // Chargement initial
    loadNotes();
  
    // Configurer le polling toutes les 5 secondes
    const interval = setInterval(loadNotes, 5000);
  
    // Nettoyer l'intervalle à la destruction du composant
    return () => clearInterval(interval);
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
        // Garder le statut réservé si une tâche existe
        const updated = data.map(veh => {
          // Vérifiez si le véhicule est associé à une tâche active
          const associatedTask = tasks.find(t => t.vehicule === veh._id && t.status !== 'terminé');
          return {
            ...veh,
            status: associatedTask ? 'réservé' : veh.status // Seulement si la tâche n'est pas terminée
          };
        });
        setVehiculesList(updated);
        setVehicules(updated);
      } catch (error) {
        console.error('Sync error:', error);
      }
    }, 5000); // Synchroniser toutes les 5 secondes
  
    return () => clearInterval(interval);
  }, [tasks]);
  
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
// Remplacer l'effet existant par :
useEffect(() => {
  if (selectedTask) {
    const loadTaskDetails = async () => {
      try {
        // Chargement direct depuis l'API sans dépendre du state tasks
        const response = await tasksApi.getTaskById(selectedTask._id);
        setSelectedTask({
          ...response.data,
          // Garder les données locales si nécessaire
          technicien: selectedTask.technicien, 
          vehicule: selectedTask.vehicule
        });
      } catch (error) {
        message.error('Erreur de chargement des détails');
      }
    };
    loadTaskDetails();
  }
}, [selectedTask?._id]); // Déclenché quand l'ID de la tâche change // Se déclenche quand la liste des tâches change
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
  const handleUpdateVehicule = async () => {
    try {
      const { data } = await vehiculesApi.updateVehicule(editingVehicule._id, editingVehicule);
      setVehicules(prev => 
        prev.map(v => v._id === data._id ? data : v)
      );
      setVehiculesList(prev => 
        prev.map(v => v._id === data._id ? data : v)
      );
      message.success('Véhicule modifié avec succès');
      setIsEditModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.error || 'Erreur lors de la modification');
    }
  };
  // Gestion tâches
  const handleCreateTask = async () => {
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
  
      // Création du FormData
      const formData = new FormData();
      formData.append('title', newTask.title);
      formData.append('description', newTask.description);
      formData.append('client', newTask.client);
      formData.append('location', newTask.location);
      formData.append('technicien', newTask.technicien);
      formData.append('vehicule', newTask.vehicule);
      formData.append('startDate', start.toISOString());
      formData.append('endDate', end.toISOString());
  
      // Dans handleCreateTask, modifier la section des fichiers :
      if (newTask.files?.length > 0) {
        newTask.files.forEach(file => {
          console.log(file);  // Vérifier chaque fichier ajouté
          formData.append('attachments', file);
        });
      }
  
      // Envoi de la requête
      const response = await tasksApi.createTask(formData);
      const createdTask = response.data;
  
      // Mise à jour optimiste
      setVehiculesList(prev => 
        prev.map(veh => 
          veh._id === newTask.vehicule 
            ? { ...veh, status: 'réservé' } 
            : veh
        )
      );
      setVehicules(prev => 
        prev.map(veh => 
          veh._id === newTask.vehicule 
            ? { ...veh, status: 'réservé' } 
            : veh
        )
      );
  
      setTasks(prev => [
        ...prev,
        {
          ...createdTask,
          technicien: createdTask.technicien?._id,
          vehicule: createdTask.vehicule?._id
        }
      ]);
  
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
        status: 'planifié',
        files: []
      });
  
      setIsModalVisible(false);
      message.success('Tâche créée avec succès !');
  
      // Rafraîchir les données des véhicules depuis le backend
      const updatedVehiculesResponse = await vehiculesApi.getAllVehicules();
      setVehicules(updatedVehiculesResponse.data);
      setVehiculesList(updatedVehiculesResponse.data);
  
    } catch (error) {
      // Gestion des erreurs
      const errorMessage = error.response?.data?.message ||
        (error.code === 'ECONNABORTED' 
          ? 'Timeout - Vérifiez votre connexion' 
          : 'Erreur technique');
  
      console.error('Échec de création:', error);
      message.error(`Échec : ${errorMessage}`);
    }
  };


  const handleUpdateTask = async () => {
    try {
      // Validation des champs obligatoires
      const requiredFields = {
        title: 'Titre',
        description: 'Description',
        technicien: 'Technicien',
        vehicule: 'Véhicule',
        startDate: 'Date de début',
        endDate: 'Date de fin',
      };
  
      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !editingTask[key])
        .map(([, value]) => value);
  
      if (missingFields.length > 0) {
        return message.error(`Champs requis manquants : ${missingFields.join(', ')}`);
      }
  
      // Validation des dates
      const start = moment(editingTask.startDate);
      const end = moment(editingTask.endDate);
      
  
  
      if (!start.isValid() || !end.isValid()) {
        return message.error('Format de date invalide');
      }
  
      if (end.isBefore(start)) {
        return message.error('La date de fin doit être après la date de début');
      }
  
      // Création du FormData pour la mise à jour
      const formData = new FormData();
      formData.append('title', editingTask.title);
      formData.append('description', editingTask.description);
      formData.append('client', editingTask.client);
      formData.append('location', editingTask.location);
      formData.append('technicien', editingTask.technicien);
      formData.append('vehicule', editingTask.vehicule);
      formData.append('startDate', start.toISOString());
      formData.append('endDate', end.toISOString());
  

      
      // Ajout des nouveaux fichiers
      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          formData.append('attachments', file);
        });
      }
  
      // Envoi de la requête de mise à jour
      const response = await tasksApi.updateTask(editingTask._id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedTask = response.data;
  
      // Mise à jour optimiste de l'état des tâches
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id
            ? {
                ...updatedTask,
                technicien: updatedTask.technicien?._id,
                vehicule: updatedTask.vehicule?._id,
              }
            : task
        )
      );
  
      // Fermeture du modal et réinitialisation des états
      setIsTaskEditModalVisible(false);
      setExistingAttachments([]);
      setNewFiles([]);
      message.success('Tâche modifiée avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification de la tâche:', error);
      message.error(
        error.response?.data?.message || 'Erreur lors de la modification de la tâche'
      );
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
    <Title level={4} style={{ margin: 0 }}>Gestionnaire</Title>
  </div>
  <Menu
    theme="light"
    mode="inline"
    selectedKeys={[selectedMenu]}
    onSelect={({ key }) => setSelectedMenu(key)}
  >
    <Menu.Item key="1" icon={<CalendarOutlined />}>Calendrier</Menu.Item>
    <Menu.Item key="3" icon={<UnorderedListOutlined />}>Tâches</Menu.Item>
    <Menu.Item key="4" icon={<CarOutlined />}>Voitures</Menu.Item>
    <Menu.Item key="5" icon={<ClockCircleOutlined />}>
      Chronologie
      {notes.length > 0 && (
        <sup style={{ 
          color: 'red', 
          marginLeft: '5px',
          animation: 'blink 1s infinite',
          fontSize: '0.8em'
        }}>
          {notes[0].author}
        </sup>
      )}
    </Menu.Item>
  </Menu>
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
    
    {/* Modification ici pour afficher seulement l'heure */}
   {/* Modifier l'affichage de la période */}
   <Text strong>Peroide : </Text>
  
   
<Text>
  {moment(selectedTask.startDate).format("DD/MM/YYYY HH:mm")} - 
  {moment(selectedTask.endDate).format("DD/MM/YYYY HH:mm")}
</Text>




    <br/>
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
    <Text strong>Pièces jointes :</Text>
{selectedTask.attachments?.map(attachment => (
  <div key={attachment.filename}>
    <a 
      href={`http://localhost:3000/uploads/${attachment.filename}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      📄 {attachment.originalName} ({Math.round(attachment.size/1024)}KB)
    </a>
  </div>
))}
  </div>
  <div style={{ marginTop: 20 }}>
      <Title level={5}>Rapports d'intervention</Title>
      {selectedTask.reports?.length > 0 ? (
        selectedTask.reports.map(report => (
          <Card 
            key={report._id} 
            style={{ marginBottom: 16, backgroundColor: '#fafafa' }}
          >
            <Text strong>{report.title}</Text>
            <div style={{ marginTop: 8 }}>
              <Text>Statut final: </Text>
              <Tag color={report.finalStatus === 'reussi' ? 'green' : 'red'}>
                {report.finalStatus}
              </Tag>
            </div>
            <Text>Durée: {report.timeSpent} heures</Text><br/>
            <Text>Description: {report.description}</Text><br/>
            <Text>Problèmes: {report.issuesEncountered}</Text><br/>
            <Text>Date: {new Date(report.createdAt).toLocaleDateString()}</Text>
          </Card>
        ))
      ) : (
        <Text type="secondary">Aucun rapport soumis pour cette tâche</Text>
      )}
    </div>
</Modal>

)}
        <Layout>
          <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Text strong>Connecté en tant que : {userData?.name}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notification Button with Badge */}
            <Badge count={noteNotifications.filter(n => !n.read).length}>
  <Popover
    title="Notifications de notes"
    content={
      <List
        dataSource={noteNotifications}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.message}
              description={moment(item.createdAt).format('DD/MM HH:mm')}
            />
          </List.Item>
        )}
      />
    }
  >
    <Button icon={<BellOutlined />} shape="circle" />
  </Popover>
</Badge>
           
            <Button icon={<LogoutOutlined />} onClick={logout}>Déconnexion</Button>
            </div>
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
                     date={calendarDate}
                     view={calendarView}
                     onNavigate={(date) => setCalendarDate(date)}
                     onView={(view) => setCalendarView(view)}
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
                            // Dans le composant Calendar
                             // Modifier onSelectSlot dans le composant Calendar
                              onSelectSlot={(slotInfo) => {
                                setNewTask({ 
                                  ...newTask,
                                  startDate: slotInfo.start,
                                  endDate: slotInfo.end
                                });
                                setIsModalVisible(true);
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
      (veh.status === 'disponible' && 
       !tasks.some(t => 
         t.vehicule === veh._id && 
         t.status !== 'terminé' // Nouvelle condition
       )) || 
      veh._id === newTask.vehicule
    )
    .map(veh => (
      <Option key={veh._id} value={veh._id}>
        {veh.model} ({veh.registration}) - {veh.status}
      </Option>
    ))}
    </Select>
    <Input
        type="file"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files);
          console.log(files);  // Vérifier si les fichiers sont correctement capturés
          setNewTask({...newTask, files});
        }}

        style={{ marginBottom: 16 }}
      />
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
                            <Button
                              onClick={() => {
                                setEditingTask(task);
                                setExistingAttachments(task.attachments || []); // Initialiser les pièces jointes existantes
  setNewFiles([]); // Réinitialiser les nouveaux fichiers
                                setIsTaskEditModalVisible(true);
                              }}
                            >
                              Modifier
                            </Button>,
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
                                  {task.attachments?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Text strong>Pièces jointes :</Text>
                      {task.attachments.map(attachment => (
                        <div key={attachment.filename}>
                          <a
                            href={`http://localhost:3000/uploads/${attachment.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'block' }}
                          >
                            📎 {attachment.originalName} ({Math.round(attachment.size/1024)}KB)
                          </a>
                        </div>
                      ))}
                    </div>)}
                              </div>
                              
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                </Card>
              )}

{isEditModalVisible && (
  <Modal
    title="Modifier le véhicule"
    visible={isEditModalVisible}
    onCancel={() => setIsEditModalVisible(false)}
    onOk={handleUpdateVehicule}
    okText="Enregistrer"
    cancelText="Annuler"
  >
    <Input
      placeholder="Immatriculation"
      value={editingVehicule?.registration || ''}
      onChange={e => setEditingVehicule({...editingVehicule, registration: e.target.value})}
      style={{ marginBottom: 16 }}
    />
    <Input
      placeholder="Modèle"
      value={editingVehicule?.model || ''}
      onChange={e => setEditingVehicule({...editingVehicule, model: e.target.value})}
      style={{ marginBottom: 16 }}
    />
    <Select
      value={editingVehicule?.status || 'disponible'}
      onChange={value => setEditingVehicule({...editingVehicule, status: value})}
      style={{ width: '100%' }}
    >
      <Option value="disponible">Disponible</Option>
      <Option value="en entretien">En entretien</Option>
      <Option value="réservé">Réservé</Option>
    </Select>
  </Modal>
)}

{isTaskEditModalVisible && (
  <Modal
    title="Modifier la tâche"
    visible={isTaskEditModalVisible}
    onCancel={() => {
      setIsTaskEditModalVisible(false);
      setExistingAttachments([]); // Réinitialiser les pièces jointes existantes
      setNewFiles([]); // Réinitialiser les nouveaux fichiers
    }}
    onOk={handleUpdateTask}
    okText="Enregistrer"
    cancelText="Annuler"
    width={800}
  >
    <Input
      placeholder="Titre"
      value={editingTask?.title || ''}
      onChange={(e) =>
        setEditingTask({ ...editingTask, title: e.target.value })
      }
      style={{ marginBottom: 16 }}
    />
    <Input.TextArea
      placeholder="Description"
      value={editingTask?.description || ''}
      onChange={(e) =>
        setEditingTask({ ...editingTask, description: e.target.value })
      }
      rows={4}
      style={{ marginBottom: 16 }}
    />
    <Input
      placeholder="Client"
      value={editingTask?.client || ''}
      onChange={(e) =>
        setEditingTask({ ...editingTask, client: e.target.value })
      }
      style={{ marginBottom: 16 }}
    />
    <Input
      placeholder="Localisation"
      value={editingTask?.location || ''}
      onChange={(e) =>
        setEditingTask({ ...editingTask, location: e.target.value })
      }
      style={{ marginBottom: 16 }}
    />

    {/* Gestion des dates (startDate et endDate) */}
    <RangePicker
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      onChange={(dates) =>setEditingTask({
                        ...editingTask,
                        startDate: dates[0].toISOString(),
                        endDate: dates[1].toISOString()
                      })}
                    />
   

    <Select
      placeholder="Sélectionner un technicien"
      value={editingTask?.technicien || ''}
      onChange={(value) =>
        setEditingTask({ ...editingTask, technicien: value })
      }
      style={{ width: '100%', marginBottom: 16 }}
    >
      {techniciens.map((tech) => (
        <Option key={tech._id} value={tech._id}>
          {tech.name}
        </Option>
      ))}
    </Select>

    <Select
      placeholder="Sélectionner un véhicule"
      value={editingTask?.vehicule || ''}
      onChange={(value) =>
        setEditingTask({ ...editingTask, vehicule: value })
      }
      style={{ width: '100%', marginBottom: 16 }}
    >
      {vehiculesList
        .filter((veh) => veh.status === 'disponible')
        .map((veh) => (
          <Option key={veh._id} value={veh._id}>
            {veh.model} ({veh.registration})
          </Option>
        ))}
    </Select>

    {/* Affichage des pièces jointes existantes */}
    <div style={{ marginBottom: 16 }}>
      <Text strong>Pièces jointes existantes :</Text>
      {editingTask.attachments?.map((attachment) => (
        <div key={attachment.filename} style={{ marginTop: 8 }}>
          <a
            href={`http://localhost:3000/uploads/${attachment.filename}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 {attachment.originalName} ({Math.round(attachment.size / 1024)}KB)
          </a>
        </div>
      ))}
    </div>

    {/* Champ pour ajouter de nouveaux fichiers */}
    <Input
      type="file"
      multiple
      onChange={(e) => {
        const files = Array.from(e.target.files);
        setNewFiles(files); // Stocker les nouveaux fichiers
      }}
      style={{ marginBottom: 16 }}
    />
  </Modal>
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
                        <Button 
                          onClick={() => {
                            setEditingVehicule(vehicule);
                            setIsEditModalVisible(true);
                          }}
                        >
                          Modifier
                        </Button>,
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
  dataSource={notes}
  renderItem={(note, index) => {
    const isNew = index === 0 && Date.now() - new Date(note.timestamp).getTime() < 5000;
    
    return (
      <List.Item
        key={note._id}
        style={{
          animation: isNew ? 'highlight 2s ease-out' : 'none',
          borderLeft: isNew ? '4px solid #1890ff' : 'none',
          paddingLeft: '10px'
        }}
      >
        <List.Item.Meta
          title={<Text strong>{note.author}</Text>}
          description={
            <>
              <Text>{note.content}</Text>
              <br />
              <Text type="secondary">
                {moment(note.timestamp).format('DD/MM/YYYY HH:mm')}
              </Text>
            </>
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