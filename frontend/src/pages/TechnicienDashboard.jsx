import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Typography, Spin, message, Menu, Button, Select } from 'antd';
import { CalendarOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import tasksApi from '../api/tasks';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const TechnicienDashboard = () => {
  const { userData, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');

  useEffect(() => {
    const loadTasks = async () => {
      if (!userData?._id) {
        console.error('ID du technicien non défini');
        return;
      }

      setLoading(true);
      try {
        console.log('Technicien ID:', userData._id);
        const response = await tasksApi.getTasksByTechnicien(userData._id);
        console.log('Réponse de l\'API:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur de chargement des tâches:', error);
        message.error(`Erreur de chargement des tâches: ${error.message || 'Veuillez réessayer plus tard.'}`);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [userData?._id]);
  const handleGetAttachments = async (taskId) => {
    try {
      const response = await tasksApi.getTaskAttachments(taskId); // Appel API pour récupérer les pièces jointes
      console.log('Pièces jointes:', response.data);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, attachments: response.data } : task
        )
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des pièces jointes:', error);
      message.error('Erreur lors de la récupération des pièces jointes');
    }
  };
  
  
  const handleDownloadAttachment = (taskId, filename) => {
    window.open(`/api/tasks/${taskId}/attachments/${filename}`, '_blank');
  };
  
  

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      console.log('Mise à jour du statut:', { taskId, newStatus }); // Log pour vérifier la requête
  
      // Appel à l'API pour mettre à jour le statut de la tâche
      const response = await tasksApi.updateTaskStatus(taskId, { status: newStatus });
  
      console.log('Réponse de l\'API:', response.data); // Log pour vérifier la réponse
  
      // Mettre à jour l'état local des tâches
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
  
      message.success('Statut de la tâche mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      message.error(`Erreur lors de la mise à jour du statut: ${error.message || 'Veuillez réessayer plus tard.'}`);
    }
  };

  
  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Mes tâches' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light" width={200}>
        <div className="logo" style={{ padding: 16, textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Interface technicien</Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />
        <div style={{ padding: 16, textAlign: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
          <Text strong>{userData?.name}</Text>
        </div>
      </Sider>
      
      <Layout style={{ padding: '0 24px 24px' }}>
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
            <Card title="Mes Tâches" bordered={false}>
              <List
  dataSource={tasks}
  renderItem={task => (
    <List.Item key={task._id}>
      <List.Item.Meta
        title={task.title}
        description={
          <>
            <Text>Statut: </Text>
            <Select
              defaultValue={task.status}
              style={{ width: 120, marginBottom: 8 }}
              onChange={(value) => handleStatusChange(task._id, value)}
            >
              <Option value="planifié">Planifié</Option>
              <Option value="en cours">En cours</Option>
              <Option value="terminé">Terminé</Option>
            </Select>
            <br />
            <Text>Description: {task.description}</Text><br />
            <Text>Client: {task.client}</Text><br />
            <Text>Localisation: {task.location}</Text><br />

            {/* Affichage des pièces jointes */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <Text strong>Pièces jointes :</Text>
                <ul>
                  {task.attachments.map((attachment, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        onClick={() => handleDownloadAttachment(task._id, attachment.filename)}
                      >
                        {attachment.originalName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        }
      />
    </List.Item>
  )}
/>

            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TechnicienDashboard;