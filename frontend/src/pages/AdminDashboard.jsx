import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, List, Card, Typography, message, Spin, Modal, Popconfirm } from 'antd';
import { CalendarOutlined, UndoOutlined, FileTextOutlined, UserOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import techniciensApi from '../api/techniciens';
import gestionnairesApi from '../api/gestionnaires';
import TechniciensSection from '../components/TechniciensSection';
import tasksApi from '../api/tasks';
import vehiculesApi from '../api/vehicules';
import TaskModal from '../components/TaskModal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    status: 'planifié'
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [activeTechs, archivedTechs, gestionnairesData, archivedGestionnairesData, tasksData, vehRes] = await Promise.all([
          techniciensApi.getAllTechniciens(),
          techniciensApi.getArchivedTechniciens(),
          gestionnairesApi.getAllGestionnaires(),
          gestionnairesApi.getArchivedGestionnaires(),
          tasksApi.getAllTasks(),
          vehiculesApi.getAllVehicules()
        ]);

        setTechniciens(activeTechs.data);
        setArchivedTechniciens(archivedTechs.data);
        setGestionnaires(gestionnairesData.data.filter(g => !g.archived));
        setArchivedGestionnaires(archivedGestionnairesData);
        setTasks(tasksData.data);
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
      const archived = await techniciensApi.archiveTechnicien(technicienId);
      console.log('Technicien archivé:', archived); // Ajoute cette ligne pour vérifier la réponse de l'API
      setTechniciens((prev) => prev.filter(g => g._id !== technicienId));
      setArchivedTechniciens((prev) => [...prev, archived]);
      message.success('Technicien archivé');
    } catch (error) {
      message.error(error.message);
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


  const handleCreateTask = async () => {
    try {
      const response = await tasksApi.createTask(newTask);
      setTasks([...tasks, response.data]);
      message.success('Tâche créée avec succès');
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
      });
      setIsTaskModalVisible(false);
    } catch (error) {
      message.error('Erreur lors de la création de la tâche');
    }
  };

 

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <UserOutlined />, label: 'Techniciens' },
    { key: '3', icon: <FileTextOutlined />, label: 'Rapports' },
    { key: '4', icon: <UserOutlined />, label: 'Gestionnaires' },
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
                    onSelectEvent={(event) => setSelectedTask(event.resource)}
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
                    </Button>,
                  ]}
                >
                  <div>
                    <Text strong>Titre : </Text>
                    <Text>{selectedTask.title}</Text>
                    <br />
                    <Text strong>Client : </Text>
                    <Text>{selectedTask.client}</Text>
                    <br />
                    <Text strong>Localisation : </Text>
                    <Text>{selectedTask.location}</Text>
                    <br />
                    <Text strong>Période : </Text>
                    <Text>
                      {moment(selectedTask.startDate).format('DD/MM HH:mm')} -{' '}
                      {moment(selectedTask.endDate).format('DD/MM HH:mm')}
                    </Text>
                    <br />
                    <Text strong>Technicien : </Text>
                    <Text>{selectedTask.technicien?.name || 'Non assigné'}</Text>
                    <br />
                    <Text strong>Véhicule : </Text>
                    <Text>
                      {selectedTask.vehicule?.model} ({selectedTask.vehicule?.registration || 'N/A'})
                    </Text>
                    <br />
                    <Text strong>Statut : </Text>
                    <Tag
                      color={
                        selectedTask.status === 'planifié'
                          ? 'blue'
                          : selectedTask.status === 'en cours'
                          ? 'orange'
                          : 'green'
                      }
                    >
                      {selectedTask.status}
                    </Tag>
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

              {selectedMenu === '2' && (
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
                    dataSource={Array.isArray(showArchived ? archivedTechniciens : techniciens)
                      ? showArchived ? archivedTechniciens : techniciens
                      : []}
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
                          description={`Compétences: ${tech.skills}`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              )}

              {selectedMenu === '3' && (
                <Card title="Rapports" variant="borderless">
                  <Button type="primary" onClick={() => alert('Générer rapport')}>Générer Rapport</Button>
                </Card>
              )}

              {selectedMenu === '4' && (
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