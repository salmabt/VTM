import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, List, Card, Typography, Select, message, Spin, Modal, Popconfirm } from 'antd';
import { CalendarOutlined, FileTextOutlined, UserOutlined, SearchOutlined, EditOutlined, DeleteOutlined ,EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import techniciensApi from '../api/techniciens';
//import reportsApi from '../api/reports';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

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
    status: 'actif',
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
        const response = await fetch('/api/users');
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
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleAddTechnicien = async () => {
    try {
      setLoading(true);
      const { data } = await techniciensApi.createTechnicien(newTechnicien);
      setTechniciens([...techniciens, data]);
      setNewTechnicien({ name: '', skills: '', status: 'actif' });
      setIsModalVisible(false);
      message.success('Technicien ajouté avec succès');
    } catch (error) {
      message.error('Erreur lors de l\'ajout du technicien');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTechnicien = (technicien) => {
    setEditTechnicien(technicien);
    setNewTechnicien({
      name: technicien.name,
      skills: technicien.skills,
      status: technicien.status,
    });
    setIsModalVisible(true);
  };

  const handleUpdateTechnicien = async () => {
    try {
      setLoading(true);
      const { data } = await techniciensApi.updateTechnicien(editTechnicien.id, newTechnicien);
      setTechniciens(techniciens.map(tech => tech.id === editTechnicien.id ? data : tech));
      setEditTechnicien(null);
      setNewTechnicien({ name: '', skills: '', status: 'actif' });
      setIsModalVisible(false);
      message.success('Technicien mis à jour avec succès');
    } catch (error) {
      message.error('Erreur lors de la mise à jour du technicien');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveTechnicien = async (technicienId) => {
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
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Ajouter un Technicien
        </Button>
      </div>
      <List
        dataSource={techniciens.filter(tech =>
          tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tech.skills.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        renderItem={tech => (
          <List.Item
            actions={[
              <Button icon={<EyeOutlined />} onClick={() => handleViewTechnicien(tech)} />,
              <Button icon={<EditOutlined />} onClick={() => handleEditTechnicien(tech)} />,
              <Popconfirm
                title="Êtes-vous sûr de vouloir archiver ce technicien ?"
                onConfirm={() => handleArchiveTechnicien(tech.id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={tech.name}
              description={`Compétences: ${tech.skills} | Statut: ${tech.status}`}
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
          setNewTechnicien({ name: '', skills: '', status: 'actif' });
        }}
        onOk={editTechnicien ? handleUpdateTechnicien : handleAddTechnicien}
      >
        <Input
          placeholder="Nom"
          value={newTechnicien.name}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, name: e.target.value })}
        />
        <Input
          placeholder="Compétences"
          value={newTechnicien.skills}
          onChange={(e) => setNewTechnicien({ ...newTechnicien, skills: e.target.value })}
        />
        <Select
          value={newTechnicien.status}
          onChange={(value) => setNewTechnicien({ ...newTechnicien, status: value })}
          style={{ width: '100%', marginTop: 16 }}
        >
          <Option value="actif">Actif</Option>
          <Option value="inactif">Inactif</Option>
        </Select>
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
        <p><strong>Email:</strong> {selectedTechnicienDetails.email || 'Non disponible'}</p>
        <p><strong>Compétences:</strong> {selectedTechnicienDetails.skills}</p>
        <p><strong>Statut:</strong> {selectedTechnicienDetails.status}</p>
      </div>
    )}
  </Modal>
    </Layout>
  );
};

export default AdminDashboard;
