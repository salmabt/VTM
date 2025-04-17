//frontend/src/pages/gestionnairedashboard
import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Input, DatePicker, Typography, Button, Card, List,
  Select, message, Spin, Tag, Modal,Badge ,Popover, Pagination
} from 'antd';
import {
  CalendarOutlined, FileTextOutlined,
  UnorderedListOutlined, LogoutOutlined, CarOutlined, ClockCircleOutlined,UserOutlined,
   BellOutlined, PhoneOutlined, MailOutlined, PaperClipOutlined
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
import TechnicienFiltering from '../components/TechnicienFiltering';
import { technicienRegions, allCities } from '../config/technicienRegions';
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
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
    status: 'disponible',
    image: null
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
    adresse:'',
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

const [selectedCity, setSelectedCity] = useState(null);
const [selectedRegion, setSelectedRegion] = useState(null);
const [selectedTechnicien, setSelectedTechnicien] = useState(null);
// pagination et search de voiture
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(4);
const [searchTerm, setSearchTerm] = useState('');
// pagination et search de taches
const [currentTaskPage, setCurrentTaskPage] = useState(1);
const [taskPageSize, setTaskPageSize] = useState(4);
const [taskSearchTerm, setTaskSearchTerm] = useState('');
// pagination de note
const [currentNotePage, setCurrentNotePage] = useState(1);
const [notePageSize, setNotePageSize] = useState(4);

//interaction chatbot
const [interactions, setInteractions] = useState([]);
const [selectedInteraction, setSelectedInteraction] = useState(null);
//filtrer des traitement de chatbot
const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'treated', 'untreated'

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
        const response = await tasksApi.getTaskById(selectedTask._id);
        setSelectedTask({
          ...response.data,
          technicien: response.data.technicien?._id || response.data.technicien,
          vehicule: response.data.vehicule?._id || response.data.vehicule
        });
      } catch (error) {
        message.error('Erreur de chargement des détails');
      }
    };
    loadTaskDetails();
  }
}, [selectedTask?._id]);

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
  
  if (selectedMenu === '2') {
    loadInteractions();
  }
}, [selectedMenu]);
// Déclenché quand l'ID de la tâche change // Se déclenche quand la liste des tâches change
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
      // Après la création de la tâche
     // Dans handleCreateTask, remplacer cette partie :
if (selectedInteraction) {
  await axios.patch(`/api/interactions/${selectedInteraction._id}`, {
    relatedTask: createdTask._id // Utiliser createdTask qui existe
  });
  
  const response = await axios.get('/api/interactions');
  setInteractions(response.data);
  
  setSelectedInteraction(null);
}
  
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
        title: editingTask.title,
        description: editingTask.description,
        technicien: editingTask.technicien,
        vehicule: editingTask.vehicule,
        startDate: editingTask.startDate,
        endDate: editingTask.endDate
      };
  
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
  
      if (missingFields.length > 0) {
        return message.error(`Champs manquants: ${missingFields.join(', ')}`);
      }
  
      // Création du FormData
      const formData = new FormData();
      
      // Ajout des champs texte
      formData.append('title', editingTask.title);
      formData.append('description', editingTask.description);
      formData.append('client', editingTask.client || '');
      formData.append('location', editingTask.location);
      formData.append('adresse', editingTask.adresse);
      formData.append('technicien', editingTask.technicien);
      formData.append('vehicule', editingTask.vehicule);
      formData.append('startDate', new Date(editingTask.startDate).toISOString());
      formData.append('endDate', new Date(editingTask.endDate).toISOString());
  
      // Gestion des pièces jointes
      if (existingAttachments.length > 0) {
        formData.append('existingAttachments', JSON.stringify(existingAttachments));
      }
  
      // Ajout des nouveaux fichiers
      if (newFiles.length > 0) {
        newFiles.forEach((file) => {
          formData.append('attachments', file, file.name);
        });
      }
  
      // Envoi de la requête
    const response = await axios.put(
      `/api/tasks/${editingTask._id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Récupérez les données à jour avec les relations peuplées
    const updatedTask = await tasksApi.getTaskById(editingTask._id);
  
   // Mise à jour de l'état local avec les données peuplées
   setTasks(prevTasks =>
    prevTasks.map(task =>
      task._id === editingTask._id ? {
        ...updatedTask.data,
        technicien: updatedTask.data.technicien?._id || updatedTask.data.technicien,
        vehicule: updatedTask.data.vehicule?._id || updatedTask.data.vehicule
      } : task
    )
  );

  message.success('Tâche modifiée avec succès');
  setIsTaskEditModalVisible(false);
} catch (error) {
      console.error('Erreur modification:', {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
      
      message.error(
        error.response?.data?.message || 
        'Erreur lors de la modification de la tâche'
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

     // Calculer le nombre de tâches "planifiées" et "en cours" pour chaque technicien
     const calculateTaskCount = (technicienId) => {
      return tasks.filter(task => {
        // Gère à la fois task.technicien._id (peuplé) et task.technicien (ID brut)
        const techId = task.technicien?._id || task.technicien;
        return techId === technicienId && 
               (task.status === "planifié" || task.status === "en cours");
      }).length;
    };

    // Vérifier la disponibilité du technicien
    const isTechnicienAvailable = (technicienId, startDate, endDate) => {
      const technicien = techniciens.find(t => t._id === technicienId);
      if (!technicien || !technicien.schedule) return true; // Si le technicien ou son emploi du temps n'existe pas, considérez-le comme disponible
      return !technicien.schedule.some(task => 
        new Date(task.startDate) < new Date(endDate) && 
        new Date(task.endDate) > new Date(startDate)
      ); 
    };
  
    // Fonction qui retourne la région basée sur la ville
    const getRegionFromCity = (city) => {
      for (const region in technicienRegions) {
        if (technicienRegions[region].includes(city)) {
          return region; // Retourne la région (par exemple, 'milieu', 'nord', etc.)
        }
      }
      return null;
    };
  
    const filteredTechniciens = selectedRegion 
      ? techniciens.filter(tech => technicienRegions[selectedRegion].includes(tech.location))
      : techniciens;
  
    // Déclarer sortedTechniciens à l'extérieur de useEffect pour éviter la redéclaration
    const sortedTechniciens = [...filteredTechniciens].sort((a, b) => 
      calculateTaskCount(a._id) - calculateTaskCount(b._id)
    );
 



  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <BellOutlined />, label: 'Demandes clients' },
    { key: '3', icon: <UnorderedListOutlined />, label: 'Tâches' },
    { key: '4', icon: <CarOutlined />, label: 'Voitures' },
    { key: '5', icon: <ClockCircleOutlined />, label: 'Chronologie' },
    { key: '6', icon: <UserOutlined />, label: 'Filtrage Techniciens' }
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
    <Title level={4} style={{ margin: 0 }}>Gestionnaire</Title>
  </div>
  <Menu
    theme="light"
    mode="inline"
    selectedKeys={[selectedMenu]}
    onSelect={({ key }) => setSelectedMenu(key)}
  >
    <Menu.Item key="1" icon={<CalendarOutlined />}>Calendrier</Menu.Item>
    <Menu.Item key="2" icon={<BellOutlined />}>Demandes clients</Menu.Item>
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
    <Menu.Item key="6" icon={<UserOutlined />}>Filtrage Techniciens</Menu.Item>
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
    <Text strong>Adresse du Client : </Text>
    <Text>{selectedTask.adresse}</Text><br/>

    
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
        {techniciens.find(t => t._id === selectedTask.technicien)?.name || 'Non assigné'}
      </Text><br/>
    
      <Text strong>Véhicule : </Text>
      <Text>
        {vehicules.find(v => v._id === selectedTask.vehicule)?.model || 'Non assigné'} 
        {selectedTask.vehicule && vehicules.find(v => v._id === selectedTask.vehicule)?.registration 
          ? ` (${vehicules.find(v => v._id === selectedTask.vehicule).registration})` 
          : ''}
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
                         status: task.status,
                         resource: { ...task, technicien: tech, vehicule: veh }
                       };
                     })}
                     eventPropGetter={eventStyleGetter} // ✅ Appliquer le style personnalisé
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
                          
{selectedMenu === '2' && (
  <Card 
    title={
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Demandes clients</span>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={(value) => setFilterStatus(value)}
        >
          <Option value="all">Toutes les demandes</Option>
          <Option value="treated">Traités</Option>
          <Option value="untreated">Non traités</Option>
        </Select>
      </div>
    } 
    bordered={false}
  >
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '70%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nom</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Contact</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Service</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Titre</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Description</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Adresse</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Statut</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interactions
            .filter(interaction => {
              if (filterStatus === 'treated') return interaction.relatedTask;
              if (filterStatus === 'untreated') return !interaction.relatedTask;
              return true;
            })
            .map(interaction => (
              <tr 
                key={interaction._id}
                style={{ 
                  borderBottom: '1px solid #ddd',
                  backgroundColor: interaction.relatedTask ? '#f6ffed' : '#fff1f0'
                }}
              >
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <Text strong>{interaction.nom_client}</Text>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <div><PhoneOutlined /> {interaction.phone}</div>
                  <div><MailOutlined /> {interaction.email}</div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  {interaction.service}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  {interaction.title_de_livraison}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <Text ellipsis={{ tooltip: interaction.description }}>
                    {interaction.description}
                  </Text>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  {interaction.address}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <Tag color={interaction.relatedTask ? "green" : "red"}>
                    {interaction.relatedTask ? "Traité" : "Non traité"}
                  </Tag>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      setNewTask({
                        ...newTask,
                        title: interaction.title_de_livraison,
                        description: interaction.description,
                        client: interaction.nom_client,
                        location: interaction.address,
                        phone: interaction.phone,
                        email: interaction.email
                      });
                      setIsModalVisible(true);
                      setSelectedInteraction(interaction);
                    }}
                    disabled={!!interaction.relatedTask}
                    style={{ marginBottom: '8px' }}
                    block
                  >
                    {interaction.relatedTask ? 'Déjà traité' : 'Créer Tâche'}
                  </Button>
                  {interaction.relatedTask && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Tâche #{interaction.relatedTask}
                    </Text>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
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
    {/* Barre de recherche */}
    <Input.Search
      placeholder="Rechercher par titre, localisation, Technicien ou Véhicule..."
      onChange={(e) => {
        setTaskSearchTerm(e.target.value);
        setCurrentTaskPage(1);
      }}
      style={{ marginBottom: 16, width: 300 }}
      allowClear
    />

     {/* Nouveau formulaire de création de tâche - version structurée */}
     <Card 
      title="Création de nouvelle tâche" 
      bordered={false} 
      style={{ marginBottom: 24, backgroundColor: '#f9f9f9' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Colonne 1 - Informations de base */}
        <div>
          <h4 style={{ marginBottom: 16 }}>Informations de base</h4>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Titre *</Text>
            <Input
              placeholder="Titre de la tâche"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Description détaillée *</Text>
            <Input.TextArea
              placeholder="Description complète de la tâche"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              rows={4}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Client *</Text>
            <Input
              placeholder="Nom du client"
              value={newTask.client}
              onChange={(e) => setNewTask({...newTask, client: e.target.value})}
            />
          </div>
        </div>

        {/* Colonne 2 - Localisation et planning */}
        <div>
          <h4 style={{ marginBottom: 16 }}>Localisation et planning</h4>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Ville *</Text>
            <Select
              placeholder="Sélectionner une ville"
              onChange={(value) => {
                setSelectedCity(value);
                const region = getRegionFromCity(value);
                setSelectedRegion(region);
                setNewTask({ ...newTask, location: value });
              }}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {allCities.map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Adresse détaillée</Text>
            <Input
              placeholder="Adresse complète"
              value={newTask.adresse}
              onChange={(e) => setNewTask({...newTask, adresse: e.target.value})}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Période *</Text>
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              onChange={(dates) => setNewTask({
                ...newTask,
                startDate: dates?.[0]?.toISOString(),
                endDate: dates?.[1]?.toISOString()
              })}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Colonne 3 - Ressources */}
        <div>
          <h4 style={{ marginBottom: 16 }}>Ressources</h4>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Technicien *</Text>
            <Select
              placeholder="Sélectionner un technicien"
              onChange={(value) => {
                setNewTask({ ...newTask, technicien: value });
                setSelectedTechnicien(value);
              }}
              style={{ width: '100%' }}
              disabled={!selectedCity}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {sortedTechniciens.map(t => (
                <Option key={t._id} value={t._id}>
                  {t.name} ({t.location}, Tâches: {calculateTaskCount(t._id)})
                </Option>
              ))}
            </Select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Véhicule *</Text>
            <Select
              placeholder="Sélectionner un véhicule"
              onChange={(value) => setNewTask({...newTask, vehicule: value})}
              value={newTask.vehicule}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => 
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {vehiculesList
                .filter(veh => 
                  (veh.status === 'disponible' && 
                  !tasks.some(t => 
                    t.vehicule === veh._id && 
                    t.status !== 'terminé'
                  )) || 
                  veh._id === newTask.vehicule
                )
                .map(veh => (
                  <Option key={veh._id} value={veh._id}>
                    {veh.model} ({veh.registration}) - {veh.status}
                  </Option>
                ))}
            </Select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Text strong>Pièces jointes</Text>
            <Input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setNewTask({...newTask, files});
              }}
            />
          </div>
        </div>
      </div>

      {/* Bouton de soumission et info technicien */}
      <div style={{ marginTop: 24 }}>
        <Button
          type="primary"
          onClick={handleCreateTask}
          disabled={
            !newTask.title || 
            !newTask.description || 
            !newTask.technicien || 
            !newTask.vehicule || 
            !newTask.startDate || 
            !newTask.endDate ||
            !isTechnicienAvailable(newTask.technicien, newTask.startDate, newTask.endDate)
          }
          style={{ width: 200 }}
        >
          Créer Tâche
        </Button>

        {selectedTechnicien && (
          <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            <Text strong>Technicien sélectionné :</Text>
            <div style={{ marginTop: 8 }}>
              <Text>
                <UserOutlined /> {techniciens.find(t => t._id === selectedTechnicien).name}
              </Text>
              <Text>
                <MailOutlined /> {techniciens.find(t => t._id === selectedTechnicien).email}
              </Text>
              <Text>
                <PhoneOutlined /> {techniciens.find(t => t._id === selectedTechnicien).phone}
              </Text>
              <Text>
                Localisation: {techniciens.find(t => t._id === selectedTechnicien).location}
              </Text>
              <Text>
                Tâches planifiées/en cours: {calculateTaskCount(selectedTechnicien)}
              </Text>
            </div>
          </div>
        )}
      </div>
    </Card>

    {/* Tableau des tâches */}
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Titre</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Client</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Ville</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Statut</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Période</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Technicien</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Véhicule</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Pièces jointes</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks
            .filter(task => {
              const tech = techniciens.find(t => t._id === task.technicien);
              const veh = vehicules.find(v => v._id === task.vehicule);
              
              return (
                task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                task.location?.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                (tech?.name?.toLowerCase().includes(taskSearchTerm.toLowerCase())) ||
                (veh?.model?.toLowerCase().includes(taskSearchTerm.toLowerCase())) ||
                (veh?.registration?.toLowerCase().includes(taskSearchTerm.toLowerCase()))
              );
            })
            .slice((currentTaskPage - 1) * taskPageSize, currentTaskPage * taskPageSize)
            .map(task => {
              const assignedTechnicien = techniciens.find(t => t._id === task.technicien);
              const assignedVehicule = vehicules.find(v => v._id === task.vehicule);

              return (
                <tr key={task._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    <Text strong>{task.title}</Text>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    {task.client}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    {task.location}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    <Tag color={
                      task.status === 'planifié' ? 'blue' :
                      task.status === 'en cours' ? 'orange' : 'green'
                    }>
                      {task.status}
                    </Tag>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    {moment(task.startDate).format('DD/MM HH:mm')} - {moment(task.endDate).format('DD/MM HH:mm')}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    {assignedTechnicien?.name || 'Non assigné'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    {assignedVehicule?.model} ({assignedVehicule?.registration || 'N/A'})
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
              {task.attachments?.length > 0 ? (
                <Popover
                  title="Pièces jointes"
                  content={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {task.attachments.map(attachment => (
                        <a
                          key={attachment.filename}
                          href={`http://localhost:3000/uploads/${attachment.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                          <FileTextOutlined />
                          <div>
                            <div>{attachment.originalName}</div>
                            <Text type="secondary">{Math.round(attachment.size/1024)} KB</Text>
                          </div>
                        </a>
                      ))}
                    </div>
                  }
                >
                  <Button type="link" icon={<PaperClipOutlined />}>
                    {task.attachments.length} fichier(s)
                  </Button>
                </Popover>
              ) : (
                <Text type="secondary">Aucun</Text>
              )}
            </td>

                  <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                    <Button
                      onClick={() => {
                        setEditingTask(task);
                        setExistingAttachments(task.attachments || []);
                        setNewFiles([]);
                        setIsTaskEditModalVisible(true);
                      }}
                      style={{ marginRight: 4, marginBottom: 4 }}
                    >
                      Modifier
                    </Button>
                    <Button danger onClick={() => handleDeleteTask(task._id)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div style={{ marginTop: 16, textAlign: 'right' }}>
      <Pagination
        current={currentTaskPage}
        pageSize={taskPageSize}
        total={tasks.filter(task => {
          const tech = techniciens.find(t => t._id === task.technicien);
          const veh = vehicules.find(v => v._id === task.vehicule);
          return (
            task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
            task.location?.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
            (tech?.name?.toLowerCase().includes(taskSearchTerm.toLowerCase())) ||
            (veh?.model?.toLowerCase().includes(taskSearchTerm.toLowerCase())) ||
            (veh?.registration?.toLowerCase().includes(taskSearchTerm.toLowerCase()))
          );
        }).length}
        onChange={(page, pageSize) => {
          setCurrentTaskPage(page);
          setTaskPageSize(pageSize);
        }}
        showSizeChanger
        pageSizeOptions={['4', '8', '12']}
        showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total} tâches`}
      />
    </div>
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
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setEditingVehicule({...editingVehicule, image: reader.result});
          };
          reader.readAsDataURL(file);
        }
      }}
      style={{ marginBottom: 16 }}
    />
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
    {/* Sélecteur de ville avec recherche */}
    <Select
      placeholder="Sélectionner une ville *"
      value={editingTask?.location || ''}
      onChange={(value) => {
        const region = getRegionFromCity(value);
        setSelectedRegion(region);
        setEditingTask({ ...editingTask, location: value });
      }}
      style={{ marginBottom: 16, width: "100%" }}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {allCities.map(city => (
        <Option key={city} value={city}>
          {city}
        </Option>
      ))}
    </Select>
    <Input
      placeholder="Adresse détaillée"
      value={editingTask?.adresse || ''}
      onChange={(e) =>
        setEditingTask({ ...editingTask, adresse: e.target.value })
      }
      style={{ marginBottom: 16 }}
    />
    {/* Sélecteur de technicien avec comptage des tâches */}
    <Select
      placeholder="Sélectionner un technicien *"
      value={editingTask?.technicien || ''}
      onChange={(value) => setEditingTask({ ...editingTask, technicien: value })}
      style={{ width: '100%', marginBottom: 16 }}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {techniciens
        .filter(tech => !selectedRegion || technicienRegions[selectedRegion]?.includes(tech.location))
        .map(tech => ({
          ...tech,
          taskCount: calculateTaskCount(tech._id)
        }))
        .sort((a, b) => b.taskCount - a.taskCount) // Tri décroissant
        .map(tech => (
          <Option key={tech._id} value={tech._id}>
            {tech.name} ({tech.location}, Tâches: {tech.taskCount})
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
   

   {/* Section des pièces jointes existantes */}
<div style={{ marginBottom: 16 }}>
  <Text strong>Pièces jointes existantes :</Text>
  {existingAttachments.map((attachment) => (
    <div key={attachment.filename} style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
      <a
        href={`http://localhost:3000/uploads/${attachment.filename}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: 8 }}
      >
        📄 {attachment.originalName} ({Math.round(attachment.size / 1024)}KB)
      </a>
      <Button
        danger
        size="small"
        onClick={() => {
          setExistingAttachments(
            existingAttachments.filter(a => a.filename !== attachment.filename)
          );
        }}
      >
        Supprimer
      </Button>
    </div>
  ))}
</div>

{/* Champ pour nouveaux fichiers */}
<Input
  type="file"
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files);
    setNewFiles(files);
  }}
  style={{ marginBottom: 16 }}
/>
  </Modal>
)}

{selectedMenu === '4' && (
  <Card title="Gestion des véhicules" bordered={false}>
    {/* Barre de recherche */}
    <Input.Search 
      placeholder="Rechercher par modèle ou immatriculation"
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      style={{ marginBottom: 16, width: 300 }}
      allowClear
    />

    {/* Formulaire d'ajout */}
    <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewVehicule({...newVehicule, image: reader.result});
        };
        reader.readAsDataURL(file);
      }
    }}
    style={{ width: 200 }}
  />
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

    {/* Tableau des véhicules */}
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '70%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Image</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Modèle</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Immatriculation</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Statut</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicules
            .filter(vehicule => 
              vehicule.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
              vehicule.registration.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map(vehicule => (
              <tr key={vehicule._id} style={{ borderBottom: '1px solid #ddd' }}>
                 <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
            {vehicule.image ? (
              <img 
                src={vehicule.image} 
                alt={vehicule.model} 
                style={{ 
                  width: 100, 
                  height: 60, 
                  objectFit: 'cover',
                  borderRadius: 4 
                }}
              />
            ) : (
              <div style={{
                width: 100,
                height: 60,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4
              }}>
                <Text type="secondary">Aucune image</Text>
              </div>
            )}
          </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <Text strong>{vehicule.model}</Text>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  {vehicule.registration}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <Tag 
                    color={
                      vehicule.status === 'disponible' ? 'green' : 
                      vehicule.status === 'en entretien' ? 'orange' : 'red'
                    }
                  >
                    {vehicule.status}
                  </Tag>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', verticalAlign: 'top' }}>
                  <Button 
                    onClick={() => {
                      setEditingVehicule(vehicule);
                      setIsEditModalVisible(true);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    Modifier
                  </Button>
                  <Button 
                    danger 
                    onClick={() => handleDeleteVehicule(vehicule._id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div style={{ marginTop: 16, textAlign: 'right' }}>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={vehicules.filter(vehicule => 
          vehicule.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicule.registration.toLowerCase().includes(searchTerm.toLowerCase())
        ).length}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
        showSizeChanger
        pageSizeOptions={['4', '8', '12']}
        showTotal={(total, range) => `${range[0]}-${range[1]} sur ${total} véhicules`}
      />
    </div>
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
  dataSource={notes.slice(
    (currentNotePage - 1) * notePageSize,
    currentNotePage * notePageSize
  )}
  pagination={{
    pageSize: notePageSize,
    current: currentNotePage,
    total: notes.length,
    onChange: (page, pageSize) => {
      setCurrentNotePage(page);
      setNotePageSize(pageSize);
    },
    showSizeChanger: true,
    pageSizeOptions: ['4', '8', '12'],
    showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} notes`,
  }}
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
          {selectedMenu === '6' && (
  <Card title="Filtrage des Techniciens par Région" bordered={false}>
    <TechnicienFiltering techniciens={techniciens} />
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