import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, List, Card, Typography, message, Spin, Modal, Popconfirm } from 'antd';
import { CalendarOutlined, UndoOutlined, FileTextOutlined, UserOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import techniciensApi from '../api/techniciens';
import gestionnairesApi from '../api/gestionnaires'; // API pour les gestionnaires

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { userData, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [loading, setLoading] = useState(false);
  const [techniciens, setTechniciens] = useState([]);
  const [gestionnaires, setGestionnaires] = useState([]); // État pour les gestionnaires
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newTechnicien, setNewTechnicien] = useState({
    name: '',
    skills: '',
    phone: '',
    email: '',
  });
  const [newGestionnaire, setNewGestionnaire] = useState({
    name: '',
    email: '',
    password: '',
    role: 'gestionnaire',
  });
  const [editTechnicien, setEditTechnicien] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGestionnaireModalVisible, setIsGestionnaireModalVisible] = useState(false); // Modal pour les gestionnaires
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTechnicienDetails, setSelectedTechnicienDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [archivedTechniciens, setArchivedTechniciens] = useState([]);
  const [editGestionnaire, setEditGestionnaire] = useState(null);
  const [filteredGestionnaires, setFilteredGestionnaires] = useState([]);

const [isEditGestionnaireModalVisible, setIsEditGestionnaireModalVisible] = useState(false);
// Dans les useState du composant
const [showArchivedGestionnaires, setShowArchivedGestionnaires] = useState(false);
const [archivedGestionnaires, setArchivedGestionnaires] = useState([]);
useEffect(() => {
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [activeTechs, archivedTechs, gestionnairesData, archivedGestionnairesData] = await Promise.all([ // Corriger le nombre d'éléments
        techniciensApi.getAllTechniciens(),
        techniciensApi.getArchivedTechniciens(),
        gestionnairesApi.getAllGestionnaires(),
        gestionnairesApi.getArchivedGestionnaires()
      ]);

      setTechniciens(activeTechs.data);
      setArchivedTechniciens(archivedTechs.data);
      setGestionnaires(gestionnairesData.data.filter(g => !g.archived)); // Filtrer côté front
      setArchivedGestionnaires(archivedGestionnairesData);
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
    setSearchTerm(searchValue);

    const sourceList = showArchived ? archivedTechniciens : techniciens;
    const filtered = sourceList.filter((user) =>
      user.name.toLowerCase().includes(searchValue)
    );

    setFilteredUsers(filtered);
  };

  const handleAddTechnicien = async () => {
    try {
      setLoading(true);
      const { data } = await techniciensApi.createTechnicien(newTechnicien);
      setTechniciens([...techniciens, data]);
      setNewTechnicien({ name: '', skills: '', phone: '', email: '' });
      setIsModalVisible(false);
      message.success('Technicien ajouté avec succès');
    } catch (error) {
      message.error('Erreur lors de l\'ajout du technicien');
    } finally {
      setLoading(false);
    }
  };

 // Modifier la fonction handleAddGestionnaire :
 const handleAddGestionnaire = async () => {
  try {
    setLoading(true);
    const response = await gestionnairesApi.createGestionnaire(newGestionnaire);
    
    // Vérifier la réponse formatée
    if (response && response.status === 'success') {
      setGestionnaires([...gestionnaires, response.data]);
      message.success('Gestionnaire ajouté avec succès');
      setIsGestionnaireModalVisible(false);
      setNewGestionnaire({ name: '', email: '', password: '', role: 'gestionnaire' });
    }
  } catch (error) {
    // Afficher le message d'erreur spécifique
    message.error(error.message || 'Erreur lors de la création');
  } finally {
    setLoading(false);
  }
};
  

  const handleEditTechnicien = (technicien) => {
    setEditTechnicien(technicien);
    setNewTechnicien({
      name: technicien.name,
      phone: technicien.phone,
      email: technicien.email,
      skills: technicien.skills,
    });
    setIsModalVisible(true);
  };

  const handleUpdateTechnicien = async () => {
    if (!editTechnicien || !editTechnicien._id) {
      message.error('Impossible de mettre à jour : Technicien non valide.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await techniciensApi.updateTechnicien(editTechnicien._id, newTechnicien);
      setTechniciens(techniciens.map((tech) => (tech._id === editTechnicien._id ? data : tech)));
      setEditTechnicien(null);
      setIsModalVisible(false);
      message.success('Technicien mis à jour avec succès');
    } catch (error) {
      console.error('Erreur API :', error);
      message.error('Erreur lors de la mise à jour du technicien');
    } finally {
      setLoading(false);
    }
  };

 // Dans AdminDashboard.jsx
 const handleArchiveTechnicien = async (technicienId) => {
  try {
    setLoading(true);
    await techniciensApi.archiveTechnicien(technicienId);
    const archivedTech = techniciens.find((t) => t._id === technicienId);
    if (!archivedTech) {
      message.error('Technicien introuvable !');
      return;
    }
    setTechniciens((prev) => prev.filter((t) => t._id !== technicienId));
    setArchivedTechniciens((prev) => [...prev, archivedTech]);
    message.success('Technicien archivé avec succès');
  } catch (error) {
    message.error('Erreur lors de l\'archivage du technicien');
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
    const userDetails = gestionnaires.find((user) => user.name === technicien.name);
    setSelectedTechnicienDetails({ ...technicien, email: technicien.email });
    setViewModalVisible(true);
  };
  // Ajouter ces fonctions
const handleEditGestionnaire = (gestionnaire) => {
  setEditGestionnaire(gestionnaire);
  setNewGestionnaire({
    name: gestionnaire.name,
    email: gestionnaire.email,
    password: '', // Laisser vide pour la sécurité
    role: gestionnaire.role
  });
  setIsEditGestionnaireModalVisible(true);
};

const handleUpdateGestionnaire = async () => {
  try {
    setLoading(true);
    
    // Filtrer les champs vides
    const cleanData = Object.fromEntries(
      Object.entries(newGestionnaire).filter(([_, v]) => v !== '')
    );

    const response = await gestionnairesApi.updateGestionnaire(
      editGestionnaire._id, 
      cleanData
    );

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
    
    setGestionnaires(prev => prev.filter(g => g._id !== id));
    setArchivedGestionnaires(prev => [...prev, archived]); // Utiliser directement la réponse
    
    message.success('Gestionnaire archivé');
  } catch (error) {
    message.error(error.message);
  }
};
const handleRestoreGestionnaire = async (id) => {
  try {
    const response = await gestionnairesApi.restoreGestionnaire(id);
    
    // Mettre à jour les deux états
    setArchivedGestionnaires(prev => prev.filter(g => g._id !== id));
    setGestionnaires(prev => [...prev, response]); // 👈 Ajouter le gestionnaire restauré
    
    message.success('Gestionnaire restauré');
  } catch (error) {
    message.error('Erreur de restauration');
  }
};
const handleSearchGestionnaires = (value) => {
  const searchValue = value.trim().toLowerCase();
  const filtered = gestionnaires.filter(g => 
    g.name.toLowerCase().includes(searchValue)
  );
  setFilteredGestionnaires(filtered);
};

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <UserOutlined />, label: 'Techniciens' },
    { key: '3', icon: <FileTextOutlined />, label: 'Rapports' },
    { key: '4', icon: <UserOutlined />, label: 'Gestionnaires' }, // Nouvel onglet pour les gestionnaires
  ];

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
                <Card title="Calendrier" variant="borderless">
                  <Text>Calendrier et gestion des événements à venir.</Text>
                </Card>
              )}

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
                    ? (showArchived ? archivedTechniciens : techniciens) 
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
                  </Popconfirm>
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

      {/* Modal pour ajouter/modifier un technicien */}
      <Modal
        title={editTechnicien ? 'Modifier un Technicien' : 'Ajouter un Technicien'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditTechnicien(null);
          setNewTechnicien({ name: '', skills: '', phone: '', email: '' });
        }}
        onOk={editTechnicien ? handleUpdateTechnicien : handleAddTechnicien}
      >
        <Input
          placeholder="Nom"
          value={newTechnicien.name}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, name: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Téléphone"
          value={newTechnicien.phone}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, phone: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Email"
          value={newTechnicien.email}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, email: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Compétences"
          value={newTechnicien.skills}
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