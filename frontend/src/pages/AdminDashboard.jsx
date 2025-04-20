import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, List, Card, Typography, message,Tag, Spin,
   Modal, Popconfirm, Tabs,Row,Col,Timeline,Statistic,Space,Tooltip,InputNumber, Table, Select } from 'antd';
import { CalendarOutlined, UndoOutlined, FileTextOutlined, UserOutlined, SearchOutlined, 
  EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, MoonOutlined, SunOutlined,BellOutlined, PhoneOutlined,MailOutlined, AreaChartOutlined } from '@ant-design/icons';
import axios from 'axios';
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
import { deleteInteraction } from '../api/services';
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const localizer = momentLocalizer(moment);
moment.locale('fr');

// Déclaration de la fonction avant le JSX
const eventStyleGetter = (event) => {
  let backgroundColor = '#b3cde0'; // Planifié par défaut (bleu clair)

  switch (event.status) {
    case 'terminé':
      backgroundColor = '#f8d7da'; // Rouge clair
      break;
    case 'en cours':
      backgroundColor = '#d4edda'; // Vert clair
      break;
    case 'planifié':
      backgroundColor = '#dbe9f4'; // Bleu clair
      break;
    default:
      backgroundColor = '#e2e3e5'; // Gris clair
  }

  return {
    style: {
      backgroundColor,
      color: '#000',
      borderRadius: '4px',
      border: 'none',
      padding: '4px 8px',
    },
  };
};


const AdminDashboard = () => {

  const [darkMode, setDarkMode] = useState(false);
  // Appliquer les styles en fonction du mode
  const themeStyles = {
    light: {
      backgroundColor: '#fff',
      textColor: '#000',
      cardBackground: '#f0f2f5',
      headerBackground: '#001529',
      headerText: '#fff'
    },
    dark: {
      backgroundColor: '#1f1f1f',
      textColor: '#fff',
      cardBackground: '#2a2a2a',
      headerBackground: '#141414',
      headerText: '#fff'
    }
  };

  const currentTheme = darkMode ? themeStyles.dark : themeStyles.light;
  // Dark Mode Toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('adminDarkMode', newMode);
  };

  // Initial load
  useEffect(() => {
    const savedMode = localStorage.getItem('adminDarkMode') === 'true';
    setDarkMode(savedMode);
  }, []);


  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^\+216\d{8}$/; // Format +216 suivi de 8 chiffres
    return regex.test(phoneNumber);
  };
  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
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
    confirmPassword: '',
    phone: '', 
    role: 'gestionnaire',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [editFormErrors, setEditFormErrors] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [calendarDate, setCalendarDate] = useState(new Date());
const [calendarView, setCalendarView] = useState('month');
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
    adresse:'',
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

  //interaction chatbot
  const [interactions, setInteractions] = useState([]);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  //filtrer des traitement de chatbot
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'treated', 'untreated'
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

/////////client
// Ajouter dans les useEffect
useEffect(() => {
  const loadInteractions = async () => {
    try {
      const response = await axios.get('/api/interactions');
      setInteractions(response.data);
    } catch (error) {
      console.error('Erreur de chargement des interactions:', error);
    }
  };
  
  if (selectedMenu === '3') {
    loadInteractions();
  }
}, [selectedMenu]);

  

const handleSearchUsers = (value) => {
  const searchValue = value.trim().toLowerCase();
  setSearchTerm(searchValue);

  if (searchValue === "") {
    setFilteredUsers([]);
    return;
  }

    const filtered = (showArchived ? archivedTechniciens : techniciens).filter((user) =>
    user.name.toLowerCase().startsWith(searchValue)
  );

  setFilteredUsers(filtered);
};

  const handleEditTechnicien = (technicien) => {
    setEditTechnicien(technicien);
    setNewTechnicien({
      email: technicien.email,
      phone: technicien.phone,
      password: '',
      confirmPassword: ''
    });
    setIsEditTechnicienModalVisible(true);
  };

  const handleUpdateTechnicien = async () => {
    const errors = {};

     // Réinitialiser les erreurs
  setEditFormErrors({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

    if (!editTechnicien || !editTechnicien._id) {
      message.error('Impossible de mettre à jour : Technicien non valide.');
      return;
    }
  
     // Validation des champs obligatoires
  if (!newTechnicien.email.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!isValidEmail(newTechnicien.email)) {
    errors.email = "Format email invalide";
  }

  if (!newTechnicien.phone.trim()) {
    errors.phone = 'Le téléphone est obligatoire';
  } else if (!isValidPhoneNumber(newTechnicien.phone)) {
    errors.phone = 'Format: +21612345678';
  }

  if (!newTechnicien.password.trim()) {
    errors.password = 'Le mot de passe est obligatoire';
  } else if (!isValidPassword(newTechnicien.password)) {
    errors.password = '8 caractères avec majuscule, minuscule et caractère spécial';
  }

  if (newTechnicien.password !== newTechnicien.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  if (Object.keys(errors).length > 0) {
    setEditFormErrors(errors);
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
  ////////////////////////////////////////////////
    // Colonnes du tableau
    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: 'Nom et Prénom',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Ville',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Téléphone',
        dataIndex: 'phone',
        key: 'phone',
      },
  
     {
  title: 'Mot de passe',
  dataIndex: 'password',
  key: 'password',
  render: (text) => {
    // Si vous voulez afficher le hash crypté
    return text; // Affichez directement le hash crypté
  }
},
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <Space>
            {showArchived ? (
              <Button icon={<UndoOutlined />} onClick={() => handleRestoreTechnicien(record._id)} />
            ) : (
              <>

            <Button icon={<EyeOutlined />} onClick={() => handleViewTechnicien(record)} />
            <Button icon={<EditOutlined />} onClick={() => handleEditTechnicien(record)} />

            
        
              <Popconfirm
                title="Êtes-vous sûr de vouloir archiver ce technicien ?"
                onConfirm={() => handleArchiveTechnicien(record._id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
              </>
            )}
          </Space>
        ),
      },
    ];
    ////////////////////////

  const handleViewTechnicien = (technicien) => {
    setSelectedTechnicienDetails(technicien);
    setViewModalVisible(true);
  };
 ///////////////////////////GESTIONNAIRES/////////////////////////////////////
 const handleAddGestionnaire = async () => {
  const errors = {};

  // Réinitialiser les erreurs
  setFormErrors({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // Validation des champs
  if (!newGestionnaire.name.trim()) {
    errors.name = 'Le nom est obligatoire';
  }
  if (!newGestionnaire.email.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!isValidEmail(newGestionnaire.email)) {
    errors.email = "Email invalide";
  }
  if (!newGestionnaire.phone.trim()) {
    errors.phone = 'Le téléphone est obligatoire';
  } else if (!isValidPhoneNumber(newGestionnaire.phone)) {
    errors.phone = 'Format: +21612345678';
  }
  if (!newGestionnaire.password.trim()) {
    errors.password = 'Le mot de passe est obligatoire';
  } else if (!isValidPassword(newGestionnaire.password)) {
    errors.password = '8 caractères, majuscule, minuscule et caractère spécial';
  }
  if (newGestionnaire.password !== newGestionnaire.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  try {
    setLoading(true);
    const response = await gestionnairesApi.createGestionnaire(newGestionnaire);
    if (response && response.status === 'success') {
      setGestionnaires([...gestionnaires, response.data]);
      message.success('Gestionnaire ajouté avec succès');
      setIsGestionnaireModalVisible(false);
      setNewGestionnaire({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        phone: '',
        role: 'gestionnaire' 
      });
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
    email: gestionnaire.email,
    phone: gestionnaire.phone || '',
    password: '',
    confirmPassword: ''
  });
  setIsEditGestionnaireModalVisible(true);
};

const handleUpdateGestionnaire = async () => {
  const errors = {};

  // Réinitialiser les erreurs
  setEditFormErrors({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Validation des champs obligatoires
  if (!newGestionnaire.email.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!isValidEmail(newGestionnaire.email)) {
    errors.email = "Format email invalide";
  }

  if (!newGestionnaire.phone.trim()) {
    errors.phone = 'Le téléphone est obligatoire';
  } else if (!isValidPhoneNumber(newGestionnaire.phone)) {
    errors.phone = 'Format: +21612345678';
  }

  if (!newGestionnaire.password.trim()) {
    errors.password = 'Le mot de passe est obligatoire';
  } else if (!isValidPassword(newGestionnaire.password)) {
    errors.password = '8 caractères avec majuscule, minuscule et caractère spécial';
  }

  if (newGestionnaire.password !== newGestionnaire.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  if (Object.keys(errors).length > 0) {
    setEditFormErrors(errors);
    return;
  }

  try {
    setLoading(true);
    const response = await gestionnairesApi.updateGestionnaire(
      editGestionnaire._id,
      newGestionnaire
    );
    
    setGestionnaires(gestionnaires.map(g => 
      g._id === editGestionnaire._id ? { ...g, ...response.data } : g
    ));

    message.success('Mise à jour réussie');
    setIsEditGestionnaireModalVisible(false);
  } catch (error) {
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
    setSearchTerm(searchValue);
    if (searchValue === "") {
      setFilteredGestionnaires([]); 
      return;
  }
    const filtered =(showArchivedGestionnaires ? archivedGestionnaires : gestionnaires).filter(g =>
      g.name.toLowerCase().startsWith(searchValue) 
    );
    setFilteredGestionnaires(filtered); 
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
        formData.append('adresse', newTask.adresse);
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
          adresse:'',
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
    
    const handleDeleteInteraction = async (interactionId) => {
      try {
        await deleteInteraction(interactionId);
    setInteractions(interactions.filter(i => i._id !== interactionId));
    message.success('Interaction supprimée avec succès');
  } catch (error) {
    message.error('Erreur lors de la suppression');
    console.error('Erreur:', error);
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
const gestionnaireColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
  },
  {
    title: 'Nom et Prénom',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Téléphone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Mot de passe',
    dataIndex: 'password',
    key: 'password',
    render: (text) => text // Afficher le hash
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <Space>
        {showArchivedGestionnaires ? (
          <Button icon={<UndoOutlined />} onClick={() => handleRestoreGestionnaire(record._id)} />
        ) : (
          <>
            <Button icon={<EditOutlined />} onClick={() => handleEditGestionnaire(record)} />
            <Popconfirm
              title="Archiver ce gestionnaire ?"
              onConfirm={() => handleArchiveGestionnaire(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </>
        )}
      </Space>
    ),
  },
];
  const menuItems = [
    { key: '1', icon: <AreaChartOutlined />, label: 'Dashboard' },
    { key: '2', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '3', icon: <UserOutlined />, label: 'Clients' },
    { key: '4', icon: <UserOutlined />, label: 'Techniciens' },
    { key: '5', icon: <UserOutlined />, label: 'Gestionnaires' },
    { key: '6', icon: <FileTextOutlined />, label: 'Rapports' },
  ];
  // Composant personnalisé pour afficher les événements
  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <div>{event.resource.technicien?.name || 'Non assigné'}</div>
    </div>
    );
  return (
    <div className={`admin-container ${darkMode ? 'dark-mode' : ''}`}>
    <Layout style={{ minHeight: '100vh',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.textColor
    }}>
      <Sider 
        collapsible 
        theme={darkMode ? 'dark' : 'light'}
        style={{ backgroundColor: darkMode ? '#141414' : '#fff' }}
      >
        <div className="logo" style={{ padding: 16, textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0, color: darkMode ? '#fff' : '#000' }}>Admin Dashboard</Title>
        </div>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
      </Sider>

      <Layout>
       <Header style={{ background: darkMode ? '#141414' : '#001529',
            padding: '0 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: darkMode ? '1px solid #303030' : '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text strong>Connecté en tant que : {userData?.name}</Text>
        </div>
        
        <Space>
          {/* Bouton Dark Mode */}
          <Tooltip title={darkMode ? "Mode clair" : "Mode sombre"}>
            <Button 
              icon={darkMode ? <SunOutlined /> : <MoonOutlined />} 
              onClick={toggleDarkMode}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          
          <Button icon={<UserOutlined />} onClick={logout}>
            Déconnexion
          </Button>
        </Space>
      </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {loading ? (
            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          ) : (
            <>
            {selectedMenu === '1' && (
            <HomeDashboard  darkMode={darkMode} /> // Affichez le tableau de bord d'accueil si l'option est sélectionnée
          )}
              {selectedMenu === '2' && (
              <Card 
              title="Calendrier des interventions" 
              bordered={false}
              headStyle={{ 
                backgroundColor: darkMode ? '#2a2a2a' : '#fafafa',
                color: darkMode ? '#fff' : '#000',
                borderBottom: darkMode ? '1px solid #303030' : '1px solid #f0f0f0'
              }}
              bodyStyle={{ 
                backgroundColor: darkMode ? '#2a2a2a' : '#fff',
                color: darkMode ? '#fff' : '#000'
              }}
            >
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
                    darkMode={darkMode}
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
                        status: task.status,
                        resource: { ...task, technicien: tech, vehicule: veh },
                      };
                    })}

                    eventPropGetter={eventStyleGetter} // ✅ Appliquer le style personnalisé
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
                <Text strong>Adresse du client: </Text>
                <Text>{selectedTask.adresse}</Text><br/>
                
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
              <Card title="Gestion des Clients" variant="borderless">
                   <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                     <Input
                      placeholder="Rechercher un client"
                      prefix={<SearchOutlined />}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}

                      style={{ flex: 1 }}
                    />
                   </div>
                
                   <Table
                columns={[
                  {
                    title: 'ID',
                    dataIndex: '_id',
                    key: 'id',
                    render: (text) => <Text strong>{text}</Text>,
                    width: 160
                  },
                  {
                    title: 'Nom',
                    dataIndex: 'nom_client',
                    key: 'nom_client',
                    render: (text) => <Text strong>{text}</Text>,
                    width: 120
                  },
                  {
                    title: 'Email',
                    key: 'email',
                    render: (_, record) => (
                      <>
                        
                        <div><MailOutlined /> {record.email}</div>
                      </>
                    ),
                    width: 180
                  },
                  {
                    title: 'Téléphone',
                    dataIndex: 'telephone',
                    key: 'telephone', render: (_, record) => (
                      <>
                        
                        <div><PhoneOutlined /> {record.phone}</div>
                      </>
                    ),
                  
                    width: 120
                  },
                
                
                  {
                    title: 'Adresse',
                    dataIndex: 'address',
                    key: 'address',
                    width: 150
                  },
                  
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                    <Popconfirm
                          title="Êtes-vous sûr de supprimer ce client ?"
                          onConfirm={() => handleDeleteInteraction(record._id)}
                          okText="Oui"
                          cancelText="Non"
                        >
                          <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ),
                      width: 100
                    }
                  ]}
                  dataSource={interactions.filter(interaction => {
                    // Filtre uniquement par recherche
                    return !searchTerm || 
                      interaction.nom_client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      interaction.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      interaction.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      interaction.address?.toLowerCase().includes(searchTerm.toLowerCase());
                  })}
                  rowKey="_id"
                  scroll={{ x: 1300 }}
                  pagination={{ pageSize: 8 }}
                />
              </Card>
              )}
             

              {selectedMenu === '4' && (
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
                        setSearchTerm(''); // Réinitialiser la recherche quand on change de vue
                        setFilteredUsers([]);
                      }}
                    >
                      {showArchived ? 'Voir Actifs' : 'Voir Archivés'}
                    </Button>
                  </div>
                  <Table
                    dataSource={searchTerm ? filteredUsers : (showArchived ? archivedTechniciens : techniciens)}
                    columns={columns}
                    rowKey="_id"
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

              {selectedMenu === '6' && (
                <AdminRapport />
              )}

{selectedMenu === '5' && (
  <Card title="Gestion des Gestionnaires" variant="borderless">
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
          setSearchTerm(''); // Réinitialiser la recherche quand on change de vue
          setFilteredGestionnaires([]);}}
      >
       
        {showArchivedGestionnaires ? 'Voir Actifs' : 'Voir Archivés'}
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsGestionnaireModalVisible(true)}
      >
        Ajouter
      </Button>
    </div>

    <Table
      dataSource={searchTerm ? filteredGestionnaires : (showArchivedGestionnaires ? archivedGestionnaires  : gestionnaires)}
      columns={gestionnaireColumns}
      rowKey="_id"
      pagination={{ pageSize: 8 }}
      scroll={{ x: 1200 }}
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
  footer={[
    <Button key="cancel" onClick={() => {
      setIsEditTechnicienModalVisible(false);
      setEditTechnicien(null);
    }}>
      Annuler
    </Button>,
    <Button 
      key="save" 
      type="primary" 
      onClick={handleUpdateTechnicien}
      loading={loading}
    >
      Enregistrer
    </Button>,
  ]}
>
 
<Input
    placeholder="Email"
    type="email"
    value={newTechnicien.email}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, email: e.target.value })}
    status={editFormErrors.email ? 'error' : ''}
    required
  />
  {editFormErrors.email && <Text type="danger">{editFormErrors.email}</Text>}

  <Input
    placeholder="Téléphone (+21612345678)"
    value={newTechnicien.phone}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, phone: e.target.value })}
    status={editFormErrors.phone ? 'error' : ''}
    required
    style={{ marginTop: 16 }}
  />
  {editFormErrors.phone && <Text type="danger">{editFormErrors.phone}</Text>}

  <Input.Password
    placeholder="Nouveau mot de passe"
    value={newTechnicien.password}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, password: e.target.value })}
    status={editFormErrors.password ? 'error' : ''}
    required
    style={{ marginTop: 16 }}
  />
  {editFormErrors.password && <Text type="danger">{editFormErrors.password}</Text>}

  <Input.Password
    placeholder="Confirmer le nouveau mot de passe"
    value={newTechnicien.confirmPassword}
    onChange={(e) => setNewTechnicien({ ...newTechnicien, confirmPassword: e.target.value })}
    status={editFormErrors.confirmPassword ? 'error' : ''}
    required
    style={{ marginTop: 16 }}
  />
  {editFormErrors.confirmPassword && <Text type="danger">{editFormErrors.confirmPassword}</Text>}
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
  <form>
    <Input
      placeholder="Nom Et Prénom"
      value={newGestionnaire.name}
      onChange={(e) => setNewGestionnaire({ ...newGestionnaire, name: e.target.value })}
      status={formErrors.name ? 'error' : ''}
    />
    {formErrors.name && <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>{formErrors.name}</Text>}

    <Input
      placeholder="Email"
      type="email"
      value={newGestionnaire.email}
      onChange={(e) => setNewGestionnaire({ ...newGestionnaire, email: e.target.value })}
      status={formErrors.email ? 'error' : ''}
    />
    {formErrors.email && <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>{formErrors.email}</Text>}

    <Input
      placeholder="Téléphone (+21612345678)"
      value={newGestionnaire.phone}
      onChange={(e) => setNewGestionnaire({ ...newGestionnaire, phone: e.target.value })}
      status={formErrors.phone ? 'error' : ''}
    />
    {formErrors.phone && <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>{formErrors.phone}</Text>}

    <Input.Password
      placeholder="Mot de passe"
      value={newGestionnaire.password}
      onChange={(e) => setNewGestionnaire({ ...newGestionnaire, password: e.target.value })}
      status={formErrors.password ? 'error' : ''}
    />
    {formErrors.password && <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>{formErrors.password}</Text>}

    <Input.Password
      placeholder="Confirmer le mot de passe"
      value={newGestionnaire.confirmPassword}
      onChange={(e) => setNewGestionnaire({ ...newGestionnaire, confirmPassword: e.target.value })}
      status={formErrors.confirmPassword ? 'error' : ''}
    />
    {formErrors.confirmPassword && <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>{formErrors.confirmPassword}</Text>}
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
            <p><strong>Name:</strong> {selectedTechnicienDetails.name}</p>
            <p><strong>Email:</strong> {selectedTechnicienDetails.email}</p>
            <p><strong>Password:</strong> {selectedTechnicienDetails.password}</p>
            <p><strong>Téléphone:</strong> {selectedTechnicienDetails.phone}</p>
            <p><strong>Compétence:</strong> {selectedTechnicienDetails.skills}</p>
          </div>
        )}
      </Modal>

      {/* Modal pour modifier un gestionnaire */}
      <Modal
  title="Modifier Gestionnaire"
  visible={isEditGestionnaireModalVisible}
  onCancel={() => setIsEditGestionnaireModalVisible(false)}
  footer={[
    <Button 
      key="cancel" 
      onClick={() => setIsEditGestionnaireModalVisible(false)}
    >
      Annuler
    </Button>,
    <Button 
      key="save" 
      type="primary" 
      onClick={handleUpdateGestionnaire}
      loading={loading}
    >
      Enregistrer
    </Button>,
  ]}
  confirmLoading={loading}
>
  <Input
    placeholder="Email"
    type="email"
    value={newGestionnaire.email}
    onChange={(e) => setNewGestionnaire({ ...newGestionnaire, email: e.target.value })}
    status={editFormErrors.email ? 'error' : ''}
    required
  />
  {editFormErrors.email && <Text type="danger">{editFormErrors.email}</Text>}

  <Input
    placeholder="Téléphone (+21612345678)"
    value={newGestionnaire.phone}
    onChange={(e) => setNewGestionnaire({ ...newGestionnaire, phone: e.target.value })}
    status={editFormErrors.phone ? 'error' : ''}
    required
    style={{ marginTop: 16 }}
  />
  {editFormErrors.phone && <Text type="danger">{editFormErrors.phone}</Text>}

  <Input.Password
    placeholder="Nouveau mot de passe"
    value={newGestionnaire.password}
    onChange={(e) => setNewGestionnaire({ ...newGestionnaire, password: e.target.value })}
    status={editFormErrors.password ? 'error' : ''}
    required
    style={{ marginTop: 16 }}
  />
  {editFormErrors.password && <Text type="danger">{editFormErrors.password}</Text>}

  <Input.Password
    placeholder="Confirmer le nouveau mot de passe"
    value={newGestionnaire.confirmPassword}
    onChange={(e) => setNewGestionnaire({ ...newGestionnaire, confirmPassword: e.target.value })}
    status={editFormErrors.confirmPassword ? 'error' : ''}
    required
    style={{ marginTop: 16 }}
  />
  {editFormErrors.confirmPassword && <Text type="danger">{editFormErrors.confirmPassword}</Text>}
</Modal>
    </Layout>
    </div>
  );
};

export default AdminDashboard;