import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Typography, Spin, message, Menu, Avatar, Button, Select, Tag } from 'antd';
import { CalendarOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import tasksApi from '../api/tasks';
import vehiculesApi from '../api/vehicules';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const TechnicienDashboard = () => {
  const { userData, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');

  useEffect(() => {
    const loadData = async () => {
      if (!userData?._id) return;

      setLoading(true);
      try {
        const [tasksResponse, vehiculesResponse] = await Promise.all([
          tasksApi.getTasksByTechnicien(userData._id),
          vehiculesApi.getVehiculesByTechnicien(userData._id)
        ]);

        console.log('🚗 Liste des véhicules:', vehiculesResponse.data);
        console.log('📌 Liste des tâches:', tasksResponse.data);

        setTasks(tasksResponse.data);
        setVehicules(vehiculesResponse.data);
      } catch (error) {
        message.error(`Erreur de chargement: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userData?._id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksApi.updateTaskStatus(taskId, { status: newStatus });
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      message.success('Statut mis à jour avec succès');
    } catch (error) {
      message.error('Échec de la mise à jour du statut');
    }
  };

  const handleGetAttachments = async (taskId) => {
    try {
      const response = await tasksApi.getTaskAttachments(taskId);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, attachments: response.data } : task
        )
      );
    } catch (error) {
      message.error('Erreur lors du chargement des pièces jointes');
    }
  };

  const handleDownloadAttachment = (taskId, filename) => {
    window.open(`/api/tasks/${taskId}/attachments/${filename}`, '_blank');
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
        <div style={{
          padding: 16,
          textAlign: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%'
        }}>
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#87d068', marginBottom: 8 }}
          />
          <Text strong style={{ display: 'block' }}>{userData?.name}</Text>
          <Text type="secondary">Technicien certifié</Text>
        </div>
      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text strong>Connecté en tant que : {userData?.name}</Text>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            danger
          >
            Déconnexion
          </Button>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {loading ? (
            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          ) : (
            <Card
              title="Mes Interventions"
              bordered={false}
              extra={<Tag color="blue">{tasks.length} tâches</Tag>}
            >
              <List
                dataSource={tasks}
                renderItem={task => {
                  const vehicule = vehicules.find(v => String(v._id) === String(task.vehicule));

                  return (
                    <List.Item
                      key={task._id}
                      actions={[
                        <Select
                          value={task.status}
                          style={{ width: 120 }}
                          onChange={(value) => handleStatusChange(task._id, value)}
                        >
                          <Option value="planifié">Planifié</Option>
                          <Option value="en cours">En cours</Option>
                          <Option value="terminé">Terminé</Option>
                        </Select>
                      ]}
                    >
                      <List.Item.Meta
                        title={<Text strong style={{ fontSize: 16 }}>{task.title}</Text>}
                        description={
                          <div style={{ lineHeight: 1.6 }}>
                            <Text>Description: {task.description}</Text><br />
                            <Text>Client: {task.client}</Text><br />
                            <Text>Localisation: {task.location}</Text><br />

                            {vehicule ? (
                              <div style={{ margin: '8px 0' }}>
                                <Text strong>Véhicule: </Text>
                                <Tag color="geekblue">
                                  {vehicule.model} ({vehicule.registration})
                                </Tag>
                              </div>
                            ) : (
                              <Text type="secondary">Aucun véhicule associé</Text>
                            )}

                            {task.attachments?.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <Text strong>Pièces jointes:</Text>
                                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                                  {task.attachments.map((attachment, index) => (
                                    <li key={index}>
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          handleGetAttachments(task._id);
                                          handleDownloadAttachment(task._id, attachment.filename);
                                        }}
                                        style={{ padding: 0 }}
                                      >
                                        {attachment.originalName}
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default TechnicienDashboard;
