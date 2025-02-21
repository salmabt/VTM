import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, List, Card, Typography, Select, message, Spin, Modal, Popconfirm } from 'antd';
import { CalendarOutlined, FileTextOutlined, UserOutlined, SearchOutlined, EditOutlined, DeleteOutlined ,EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import techniciensApi from '../api/techniciens';
//import reportsApi from '../api/reports';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { userData, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [loading, setLoading] = useState(false);
  const [techniciens, setTechniciens] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newTechnicien, setNewTechnicien] = useState({
    name: '',
    skills: '',
    
  });
  const [editTechnicien, setEditTechnicien] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTechnicienDetails, setSelectedTechnicienDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const loadTechniciens = async () => {
      setLoading(true);
      try {
        const response = await techniciensApi.getAllTechniciens();
        setTechniciens(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Erreur de chargement des techniciens', error);
        message.error('Erreur de chargement des techniciens');
      } finally {
        setLoading(false);
      }
    };
    loadTechniciens();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/techniciens');
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Erreur de chargement des utilisateurs', error);
        message.error('Erreur de chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleSearchUsers = (value) => {
    const searchValue = value.trim().toLowerCase();
    if (!searchValue) {
      setFilteredUsers(techniciens); // Si l'entrée est vide, afficher tous les utilisateurs
    } else {
      const filtered = techniciens.filter(user =>
        user.name.toLowerCase().startsWith(searchValue) // Rechercher par début du nom
      );
    setFilteredUsers(filtered);
    }
  };

  const handleAddTechnicien = async () => {
    try {
      setLoading(true);
      const { data } = await techniciensApi.createTechnicien(newTechnicien);
      setTechniciens([...techniciens, data]);
      setNewTechnicien({ name: '', skills: '' });
      setIsModalVisible(false);
      message.success('Technicien ajouté avec succès');
    } catch (error) {
      message.error('Erreur lors de l\'ajout du technicien');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTechnicien = (technicien) => {
    console.log("Modification du technicien :", technicien);
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
    console.log('Technicien en cours de mise à jour :', editTechnicien);
    console.log('Données envoyées :', newTechnicien);
  
    if (!editTechnicien || !editTechnicien._id) {
      message.error('Impossible de mettre à jour : Technicien non valide.');
      return;
    }
  
    try {
      setLoading(true);
      const { data } = await techniciensApi.updateTechnicien(editTechnicien._id, newTechnicien);
      setTechniciens(techniciens.map(tech => tech._id === editTechnicien._id ? data : tech));
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
  

  const handleArchiveTechnicien = async (technicienId) => {
    console.log("Archivage du technicien ID :", technicienId);
    try {
      setLoading(true);
      await techniciensApi.archiveTechnicien(technicienId);
      setTechniciens(techniciens.filter(tech => tech.id !== technicienId));
      message.success('Technicien archivé avec succès');
    } catch (error) {
      message.error('Erreur lors de l\'archivage du technicien');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTechnicien = (technicien) => {
    const userDetails = users.find(user => user.name === technicien.name);
    setSelectedTechnicienDetails({ ...technicien, email: userDetails?.email });
    setViewModalVisible(true);
  };

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Calendrier' },
    { key: '2', icon: <UserOutlined />, label: 'Techniciens' },
    { key: '3', icon: <FileTextOutlined />, label: 'Rapports' },
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
                <Card title="Calendrier" bordered={false}>
                  <Text>Calendrier et gestion des événements à venir.</Text>
                  {/* Add a Calendar component here */}
                </Card>
              )}


  {selectedMenu === '2' && (
    <Card title="Gestion des Techniciens" bordered={false}>
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
        
      </div>
      <List
        dataSource={filteredUsers} // Utilise filteredUsers pour l'affichage
        renderItem={tech => (
          <List.Item
            actions={[
              <Button icon={<EyeOutlined />} onClick={() => handleViewTechnicien(tech)} />,
              <Button icon={<EditOutlined />} onClick={() => handleEditTechnicien(tech)} />,
              <Popconfirm
                title="Êtes-vous sûr de vouloir archiver ce technicien ?"
                onConfirm={() => handleArchiveTechnicien(tech._id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={tech.name}
              description={`Compétences: ${tech.skills} `}
            />
          </List.Item>
        )}
      />
    </Card>
  )}

              {selectedMenu === '3' && (
                <Card title="Rapports" bordered={false}>
                  <Button type="primary" onClick={() => alert('Générer rapport')}>Générer Rapport</Button>
                </Card>
              )}
            </>
          )}
        </Content>
      </Layout>

      <Modal
        title={editTechnicien ? 'Modifier un Technicien' : 'Ajouter un Technicien'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditTechnicien(null);
          setNewTechnicien({ name: '', skills: '',phone: '',email:'' });
        }}
        onOk={editTechnicien ? handleUpdateTechnicien : handleAddTechnicien}
      >
        <Input
          placeholder="Nom"
          value={newTechnicien.name}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, name: e.target.value })}
        />
        <Input
          placeholder="Telephone"
          value={newTechnicien.phone}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, phone: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={newTechnicien.email}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, email: e.target.value })}
        />
        <Input
          placeholder="Compétences"
          value={newTechnicien.skills}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, skills: e.target.value })}
        />
       
      </Modal>
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
        <p><strong>Telephone:</strong> {selectedTechnicienDetails.phone}</p>
      </div>
    )}
  </Modal>
    </Layout>
  );
};

export default AdminDashboard;
