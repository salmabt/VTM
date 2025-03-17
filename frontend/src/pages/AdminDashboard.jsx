import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, List, Card, Typography, message,Tag, Spin, Modal, Popconfirm, Tabs,Row,Col,Timeline,Statistic,Space,Tooltip,InputNumber } from 'antd';
import { CalendarOutlined, UndoOutlined, FileTextOutlined, UserOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { BarChart ,PieChart, CartesianGrid, XAxis, YAxis, Bar,Legend ,Pie,Cell } from 'recharts'; 

import { useAuth } from '../contexts/AuthContext';
import techniciensApi from '../api/techniciens';
import gestionnairesApi from '../api/gestionnaires';
import TechniciensSection from '../components/TechniciensSection';
import tasksApi from '../api/tasks';
import vehiculesApi from '../api/vehicules';
import reportsApi from '../api/reports';
import TaskModal from '../components/TaskModal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import HomeDashboard from './HomeDashboard'; // Assurez-vous que le chemin est correct
import AdminRapport from './AdminRapport';
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const localizer = momentLocalizer(moment);
moment.locale('fr');

const AdminDashboard = () => {
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{8}$/;
    return regex.test(phoneNumber);
  };

  const { userData, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [loading, setLoading] = useState(false);
  const [techniciens, setTechniciens] = useState([]);
  const [newTechnicien, setNewTechnicien] = useState({
    name: '',
    phone: '',
    email: '',
    skills: '',
  });
  const [gestionnaires, setGestionnaires] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [vehiculesList, setVehiculesList] = useState([]);
  const [newGestionnaire, setNewGestionnaire] = useState({
    name: '',
    email: '',
    password: '',
    role: 'gestionnaire',
  });
  const [editTechnicien, setEditTechnicien] = useState(null);
  const [isEditTechnicienModalVisible, setIsEditTechnicienModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isGestionnaireModalVisible, setIsGestionnaireModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTechnicienDetails, setSelectedTechnicienDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [archivedTechniciens, setArchivedTechniciens] = useState([]);
  const [editGestionnaire, setEditGestionnaire] = useState(null);
  const [filteredGestionnaires, setFilteredGestionnaires] = useState([]);
  const [isEditGestionnaireModalVisible, setIsEditGestionnaireModalVisible] = useState(false);
  const [showArchivedGestionnaires, setShowArchivedGestionnaires] = useState(false);
  const [archivedGestionnaires, setArchivedGestionnaires] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [techTasks, setTechTasks] = useState([]);
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
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
  const [exportLoading, setExportLoading] = useState(false);
const [activeReportTab, setActiveReportTab] = useState('1');
const [techDetails, setTechDetails] = useState(null);
const [vehicleDetails, setVehicleDetails] = useState(null);
const [rating, setRating] = useState({});
const [showRateModal, setShowRateModal] = useState(false);
  const [currentTechId, setCurrentTechId] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
// Dans la partie véhicules
const calculateUtilisation = (tasks, vehiculeId) => {
  return tasks
    .filter(task => task.vehicule === vehiculeId)
    .reduce((total, task) => {
      const start = moment(task.startDate);
      const end = moment(task.endDate);
      return total + end.diff(start, 'hours', true);
    }, 0);
};
useEffect(() => {
  const loadTechniciens = async () => {
    try {
      const [activeRes, archivedRes] = await Promise.all([
        techniciensApi.getAllTechniciens(),
        techniciensApi.getArchivedTechniciens()
      ]);
      setTechniciens(activeRes.data);
      setArchivedTechniciens(archivedRes.data);
    } catch (error) {
      message.error('Erreur de chargement des techniciens');
    }
  };

  if (selectedMenu === '3') loadTechniciens();
}, [selectedMenu]);
// Dans AdminDashboard.js, ajoutez ce useEffect
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const { data } = await vehiculesApi.getAllVehicules();
      const updated = data.map(veh => {
        const associatedTask = tasks.find(t => 
          t.vehicule === veh._id && 
          t.status !== 'terminé'
        );
        return {
          ...veh,
          status: associatedTask ? 'réservé' : veh.status
        };
      });
      
      setVehiculesList(updated);
      setVehicules(updated);
    } catch (error) {
      console.error('Sync error:', error);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [tasks]); // Ajoutez cette dépendance
// Mettre à jour le chargement des données
useEffect(() => {
  const loadReportData = async () => {
    try {
      const [techRes, vehRes, tasksRes] = await Promise.all([
        reportsApi.getTechniciensStatsDetailed(),
        reportsApi.getVehiculesStats(),
        tasksApi.getAllTasks()
      ]);

      const tasks = tasksRes.data;
      
      setVehicules(vehRes.data.map(veh => ({
        ...veh,
        utilisationHeures: calculateUtilisation(tasks, veh._id),
        lastMaintenance: veh.lastMaintenance ? 
          moment(veh.lastMaintenance).format('DD/MM/YYYY') : 'N/A'
      })));

    } catch (error) {

    }
  };
  
  if (selectedMenu === '3') loadReportData();
}, [selectedMenu]);

useEffect(() => {
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [activeTechs, archivedTechs, gestionnairesData, archivedGestionnairesData, tasksData, vehRes] = await Promise.all([
        techniciensApi.getAllTechniciens(),
        techniciensApi.getArchivedTechniciens(),
        gestionnairesApi.getAllGestionnaires(),
        gestionnairesApi.getArchivedGestionnaires(),
        // Modification ici : ajout du paramètre populate directement
        tasksApi.getAllTasks({ populate: 'reports' }),
        vehiculesApi.getAllVehicules()
      ]);

      const verifyActive = activeTechs.data.filter(t => !t.archived);
      const verifyArchived = archivedTechs.data.filter(t => t.archived);

      setTechniciens(verifyActive);
      setArchivedTechniciens(verifyArchived);

      setGestionnaires(gestionnairesData.data.filter(g => !g.archived));
      setArchivedGestionnaires(archivedGestionnairesData);
      // Utilisation des données directement depuis la réponse
      setTasks(tasksData.data.map(task => ({
        ...task,
        technicien: task.technicien?._id || task.technicien,
        vehicule: task.vehicule?._id || task.vehicule,
        reports: task.reports || []
      })));
      setVehicules(vehRes.data);
      setVehiculesList(vehRes.data);

      console.log('Techniciens:', activeTechs.data);
      console.log('Tâches:', tasksData.data);
    } catch (error) {
      message.error('Erreur de chargement initial');
    } finally {
      setLoading(false);
    }
  };
  loadInitialData();
}, []);
useEffect(() => {
  const updateTechnicianData = () => {
    if (!selectedTech) return;
    
    const validTasks = tasks.filter(task => 
      task.technicien === selectedTech._id && 
      vehicules.some(v => v._id === task.vehicule)
    );

    setTechTasks(validTasks);
    
    const updatedVehicles = vehicules.filter(v => 
      validTasks.some(task => task.vehicule === v._id)
    ).map(veh => ({
      ...veh,
      status: validTasks.some(t => 
        t.vehicule === veh._id && t.status !== 'terminé'
      ) ? 'réservé' : veh.status
    }));

    setAssignedVehicles(updatedVehicles);
  };

  updateTechnicianData();
}, [tasks, vehicules, selectedTech]);

  

  const handleSearchUsers = (value) => {
    const searchValue = value.trim().toLowerCase();
    if (searchValue === "") {
      setFilteredUsers([]); // Vide la liste si l'entrée est vide
      return;
  }

    const filtered = techniciens.filter((user) =>
      user.name.toLowerCase().startsWith(searchValue) 
    );

    setFilteredUsers(filtered.length > 0 ? filtered : []); 
  };


  const handleEditTechnicien = (technicien) => {
    setEditTechnicien(technicien);
    setNewTechnicien({
      name: technicien.name,
      phone: technicien.phone,
      email: technicien.email,
      skills: technicien.skills,
    });
    setIsEditTechnicienModalVisible(true);
  };

  const handleUpdateTechnicien = async () => {
    if (!editTechnicien || !editTechnicien._id) {
      message.error('Impossible de mettre à jour : Technicien non valide.');
      return;
    }
  
    const { email, phone, name } = newTechnicien;
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      message.error("Tous les champs doivent être remplis.");
      return;
    }
    if (!isValidEmail(email)) {
      message.error("L'email n'est pas valide.");
      return;
    }
    if (!isValidPhoneNumber(phone)) {
      message.error('Le numéro de téléphone doit être composé de 8 chiffres.');
      return;
    }
  
    try {
      setLoading(true);
      const { data } = await techniciensApi.updateTechnicien(editTechnicien._id, newTechnicien);
      setTechniciens(techniciens.map((tech) => (tech._id === editTechnicien._id ? data : tech)));
      setEditTechnicien(null);
      setIsEditTechnicienModalVisible(false);
      message.success('Technicien mis à jour avec succès');
    } catch (error) {
      console.error('Erreur API :', error);
      message.error('Erreur lors de la mise à jour du technicien');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveTechnicien = async (technicienId) => {
    try {
      setLoading(true);
      
      // 1. Archive via l'API
      await techniciensApi.archiveTechnicien(technicienId);
      
      // 2. Rafraîchissement immédiat des données
      const [activeRes, archivedRes] = await Promise.all([
        techniciensApi.getAllTechniciens(),
        techniciensApi.getArchivedTechniciens()
      ]);
      
      // 3. Mise à jour des états avec les nouvelles données
      setTechniciens(activeRes.data);
      setArchivedTechniciens(archivedRes.data);
  
      message.success('Technicien archivé avec succès');
    } catch (error) {
      message.error("Échec de l'archivage : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreTechnicien = async (technicienId) => {
    try {
      setLoading(true);
      await techniciensApi.restoreTechnicien(technicienId);
      const restoredTech = archivedTechniciens.find((t) => t._id === technicienId);
      if (!restoredTech) {
        message.error('Technicien introuvable !');
        return;
      }
      setArchivedTechniciens((prev) => prev.filter((t) => t._id !== technicienId));
      setTechniciens((prev) => [...prev, restoredTech]);
      message.success('Technicien restauré avec succès');
    } catch (error) {
      message.error('Erreur lors de la restauration du technicien');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTechnicien = (technicien) => {
    setSelectedTechnicienDetails(technicien);
    setViewModalVisible(true);
  };
 ///////////////////////////GESTIONNAIRES/////////////////////////////////////
  const handleAddGestionnaire = async () => {
    try {
      setLoading(true);
      const response = await gestionnairesApi.createGestionnaire(newGestionnaire);
      if (response && response.status === 'success') {
        setGestionnaires([...gestionnaires, response.data]);
        message.success('Gestionnaire ajouté avec succès');
        setIsGestionnaireModalVisible(false);
        setNewGestionnaire({ name: '', email: '', password: '', role: 'gestionnaire' });
      }
    } catch (error) {
      message.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGestionnaire = (gestionnaire) => {
    setEditGestionnaire(gestionnaire);
    setNewGestionnaire({
      name: gestionnaire.name,
      email: gestionnaire.email,
      password: '', // Laisser vide pour la sécurité
      role: gestionnaire.role,
    });
    setIsEditGestionnaireModalVisible(true);
  };

  const handleUpdateGestionnaire = async () => {
    try {
      setLoading(true);
      if (!newGestionnaire.name?.trim() || !newGestionnaire.email?.trim()) {
        message.error("Le nom et l'email sont obligatoires.");
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(newGestionnaire.email)) {
        message.error("L'email n'est pas valide.");
        return;
      }
      const cleanData = Object.fromEntries(
        Object.entries(newGestionnaire).filter(([_, v]) => v !== '')
      );

      const response = await gestionnairesApi.updateGestionnaire(
        editGestionnaire._id,
        cleanData
      );
      console.log('Gestionnaire mis à jour:', response.data);

     setGestionnaires(gestionnaires.map(g =>
      g._id === editGestionnaire._id ? { ...g, ...response.data } : g
    ));

      message.success('Mise à jour réussie');
      setIsEditGestionnaireModalVisible(false);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      message.error(error.message || 'Échec de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveGestionnaire = async (id) => {
    try {
      const archived = await gestionnairesApi.archiveGestionnaire(id);
      setGestionnaires((prev) => prev.filter(g => g._id !== id));
      setArchivedGestionnaires((prev) => [...prev, archived]);
      message.success('Gestionnaire archivé');
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRestoreGestionnaire = async (id) => {
    try {
      const response = await gestionnairesApi.restoreGestionnaire(id);
      setArchivedGestionnaires((prev) => prev.filter(g => g._id !== id));
      setGestionnaires((prev) => [...prev, response]);
      message.success('Gestionnaire restauré');
    } catch (error) {
      message.error('Erreur de restauration');
    }
  };

  const handleSearchGestionnaires = (value) => {
    const searchValue = value.trim().toLowerCase();
    if (searchValue === "") {
      setFilteredGestionnaires([]); // Vide la liste si l'entrée est vide
      return;
  }
    const filtered = gestionnaires.filter(g =>
      g.name.toLowerCase().startsWith(searchValue) 
    );
    setFilteredGestionnaires(filtered.length > 0 ? filtered : []); 
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
    const handleExportExcel = async () => {
      setExportLoading(true);
      try {
        const response = await reportsApi.exportExcel();
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'rapport-interventions.xlsx');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        message.error('Erreur lors de l\'export');
      } finally {
        setExportLoading(false);
      }
    };
    
    const handleExportPDF = async () => {
      setExportLoading(true);
  try {
    const response = await reportsApi.exportExcel();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rapport-interventions.xlsx');
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    message.error('Erreur lors de l\'export');
  } finally {
    setExportLoading(false);
  }
    };
    // Ajoutez cette fonction de gestionnaire
const handleSelectEvent = async (event) => {
  try {
    const { data } = await tasksApi.getTaskById(event.resource._id);
    setSelectedTask({
      ...data,
      technicien: data.technicien?._id,
      vehicule: data.vehicule?._id,
      reports: data.reports || []
    });
  } catch (error) {
    message.error('Erreur de chargement des détails');
  }
};
  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: 'Dashboard' },
    { key: '2', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '3', icon: <UserOutlined />, label: 'Techniciens' },
    { key: '4', icon: <FileTextOutlined />, label: 'Rapports' },
    { key: '5', icon: <UserOutlined />, label: 'Gestionnaires' },
  ];
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
          <Title level={4} style={{ margin: 0 }}>Admin Dashboard</Title>
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
          <Button icon={<UserOutlined />} onClick={logout}>Déconnexion</Button>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {loading ? (
            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          ) : (
            <>
            {selectedMenu === '1' && (
            <HomeDashboard /> // Affichez le tableau de bord d'accueil si l'option est sélectionnée
          )}
              {selectedMenu === '2' && (
                <Card title="Calendrier des interventions" bordered={false}>
                  <TechniciensSection
                    techniciens={techniciens}
                    tasks={tasks}
                    vehicules={vehicules}
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
                        resource: { ...task, technicien: tech, vehicule: veh },
                      };
                    })}

                    
                    components={{
                      event: CustomEvent, // Utilisez le composant personnalisé ici
                    }}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={(slotInfo) => {
                      setNewTask({
                        ...newTask,
                        startDate: slotInfo.start.toISOString(),
                        endDate: slotInfo.end.toISOString(),
                      });
                      setIsTaskModalVisible(true);
                    }}
                    selectable
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
                        `${moment(start).format('DD/MM/YYYY')} – ${moment(end).format('DD/MM/YYYY')}`,
                    }}
                  />
                </Card>
              )}

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
            <Text strong>Période : </Text>
            <Text>
              {moment(selectedTask.startDate).format('DD/MM HH:mm')} -{' '}
              {moment(selectedTask.endDate).format('DD/MM HH:mm')}
            </Text>    <br/>
            <Text strong>Technicien : </Text>
<Text>
  {techniciens.find(t => t._id === selectedTask.technicien)?.name || 'Non assigné'}
</Text><br/>

<Text strong>Véhicule : </Text>
<Text>
  {vehicules.find(v => v._id === selectedTask.vehicule)?.model || 'Non assigné'}
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
             {/* Section des rapports d'intervention */}
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
              </div>
            </Modal>
            
            )}

              <TaskModal
                isModalVisible={isTaskModalVisible}
                setIsModalVisible={setIsTaskModalVisible}
                newTask={newTask}
                setNewTask={setNewTask}
                handleCreateTask={handleCreateTask}
                techniciens={techniciens}
                vehiculesList={vehicules}
              />

              {selectedMenu === '3' && (
                <Card title="Gestion des Techniciens" variant="borderless">
                  <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                    <Input
                      placeholder="Rechercher un technicien"
                      prefix={<SearchOutlined />}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearchUsers(e.target.value);
                      }}

                      style={{ flex: 1 }}
                    />
                    <Button
                      type={showArchived ? 'default' : 'primary'}
                      onClick={() => {
                        setShowArchived(!showArchived);
                        handleSearchUsers(searchTerm);
                      }}
                    >
                      {showArchived ? 'Voir Actifs' : 'Voir Archivés'}
                    </Button>
                  </div>
                  <List
                    dataSource={showArchived ? archivedTechniciens : techniciens}
                    renderItem={(tech) => (
                      <List.Item
                        actions={
                          showArchived
                            ? [
                                <Button icon={<UndoOutlined />} onClick={() => handleRestoreTechnicien(tech._id)} />,
                              ]
                            : [
                                <Button icon={<EyeOutlined />} onClick={() => handleViewTechnicien(tech)} />,
                                <Button icon={<EditOutlined />} onClick={() => handleEditTechnicien(tech)} />,
                                <Popconfirm
                                  title="Êtes-vous sûr de vouloir archiver ce technicien ?"
                                  onConfirm={() => handleArchiveTechnicien(tech._id)}
                                  okText="Oui"
                                  cancelText="Non"
                                >
                                  <Button icon={<DeleteOutlined />} danger />
                                </Popconfirm>,
                              ]
                        }
                      >
                       <List.Item.Meta
  title={<>{tech.name} {showArchived && <Text type="secondary">(Archivé)</Text>}</>}
  description={`Compétences: ${tech.skills?.join(', ') || 'Aucune'}`}
/>
                      </List.Item>
                    )}
                  />
                </Card>
              )}

              {selectedMenu === '4' && (
                <AdminRapport />
              )}


              {selectedMenu === '5' && (
                <Card title="Gestion des Gestionnaires" variant="borderless">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsGestionnaireModalVisible(true)}
                    style={{ marginBottom: 16 }}
                  >
                    Ajouter un Gestionnaire
                  </Button>

                  <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                    <Input
                      placeholder="Rechercher un gestionnaire"
                      prefix={<SearchOutlined />}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearchGestionnaires(e.target.value);
                      }}
                      style={{ flex: 1 }}
                    />
                    <Button
                      type={showArchivedGestionnaires ? 'default' : 'primary'}
                      onClick={() => {
                        setShowArchivedGestionnaires(!showArchivedGestionnaires);
                        handleSearchGestionnaires(searchTerm);
                      }}
                    >
                      {showArchivedGestionnaires ? 'Voir Actifs' : 'Voir Archivés'}
                    </Button>
                  </div>
                  <List
                    dataSource={showArchivedGestionnaires ? archivedGestionnaires : filteredGestionnaires.length > 0 ? filteredGestionnaires : gestionnaires}
                    renderItem={(gestionnaire) => (
                      <List.Item
                        actions={
                          showArchivedGestionnaires
                            ? [
                                <Button icon={<UndoOutlined />} onClick={() => handleRestoreGestionnaire(gestionnaire._id)} />,
                              ]
                            : [
                                <Button icon={<EditOutlined />} onClick={() => handleEditGestionnaire(gestionnaire)} />,
                                <Popconfirm
                                  title="Êtes-vous sûr de vouloir archiver ce gestionnaire ?"
                                  onConfirm={() => handleArchiveGestionnaire(gestionnaire._id)}
                                  okText="Oui"
                                  cancelText="Non"
                                >
                                  <Button icon={<DeleteOutlined />} danger />
                                </Popconfirm>,
                              ]
                        }
                      >
                        <List.Item.Meta
                          title={<>{gestionnaire.name} {showArchivedGestionnaires && <Text type="secondary">(Archivé)</Text>}</>}
                          description={`Email: ${gestionnaire.email}`}
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

      {/* Modal pour modifier un technicien */}
   <Modal
  title="Modifier un Technicien"
  visible={isEditTechnicienModalVisible}
  onCancel={() => {
    setIsEditTechnicienModalVisible(false);
    setEditTechnicien(null);
  }}
  onOk={handleUpdateTechnicien}
>
  <Input
    placeholder="Nom"
    value={newTechnicien.name || ''}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, name: e.target.value })}
    style={{ marginBottom: 16 }}
  />
  <Input
    placeholder="Téléphone"
    value={newTechnicien.phone || ''}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, phone: e.target.value })}
    style={{ marginBottom: 16 }}
  />
  <Input
    placeholder="Email"
    value={newTechnicien.email || ''}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, email: e.target.value })}
    style={{ marginBottom: 16 }}
  />
  <Input
    placeholder="Compétences"
    value={newTechnicien.skills || ''}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, skills: e.target.value })}
  />
</Modal>

      {/* Modal pour ajouter un gestionnaire */}
      <Modal
        title="Ajouter un Gestionnaire"
        visible={isGestionnaireModalVisible}
        onCancel={() => setIsGestionnaireModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsGestionnaireModalVisible(false)}>
            Annuler
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddGestionnaire}>
            Créer
          </Button>,
        ]}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleAddGestionnaire(); }}>
          <Input
            placeholder="Nom"
            required
            value={newGestionnaire.name}
            onChange={(e) => setNewGestionnaire({ ...newGestionnaire, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            required
            value={newGestionnaire.email}
            onChange={(e) => setNewGestionnaire({ ...newGestionnaire, email: e.target.value })}
          />
          <Input.Password
            placeholder="Mot de passe"
            autoComplete="new-password"
            required
            value={newGestionnaire.password}
            onChange={(e) => setNewGestionnaire({ ...newGestionnaire, password: e.target.value })}
          />
        </form>
      </Modal>

      {/* Modal pour voir les détails du technicien */}
      <Modal
        title="Détails du Technicien"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedTechnicienDetails && (
          <div>
            <p><strong>Nom:</strong> {selectedTechnicienDetails.name}</p>
            <p><strong>Email:</strong> {selectedTechnicienDetails.email}</p>
            <p><strong>Compétences:</strong> {selectedTechnicienDetails.skills}</p>
            <p><strong>Téléphone:</strong> {selectedTechnicienDetails.phone}</p>
          </div>
        )}
      </Modal>

      {/* Modal pour modifier un gestionnaire */}
      <Modal
        title="Modifier Gestionnaire"
        visible={isEditGestionnaireModalVisible}
        onCancel={() => setIsEditGestionnaireModalVisible(false)}
        onOk={handleUpdateGestionnaire}
        confirmLoading={loading}
      >
        <Input
          placeholder="Nom"
          value={newGestionnaire.name}
          onChange={(e) => setNewGestionnaire({ ...newGestionnaire, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          type="email"
          value={newGestionnaire.email}
          onChange={(e) => setNewGestionnaire({ ...newGestionnaire, email: e.target.value })}
        />
        <Input.Password
          placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
          onChange={(e) => setNewGestionnaire({ ...newGestionnaire, password: e.target.value })}
        />
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;