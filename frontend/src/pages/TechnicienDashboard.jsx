import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Typography, Spin, message, Menu, Avatar, Button, Select, Tag, Form, Input, DatePicker } from 'antd';
import { CalendarOutlined, LogoutOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import tasksApi from '../api/tasks';
import vehiculesApi from '../api/vehicules';
import reportsApi from '../api/reports'; 

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const TechnicienDashboard = () => {
  const { userData, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [reports, setReports] = useState([]);  // State for reports
  const [form] = Form.useForm();  // Form instance for the report form

  useEffect(() => {
    const loadData = async () => {
      if (!userData?._id) return;

      setLoading(true);
      try {
        const [tasksResponse, vehiculesResponse] = await Promise.all([
          tasksApi.getTasksByTechnicien(userData._id),
          vehiculesApi.getVehiculesByTechnicien(userData._id)
        ]);

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

  // Fetch reports (this part can be customized based on how reports are fetched)
  const loadReports = async () => {
    try {
      // Nouvelle méthode pour charger les rapports par technicien
      const response = await reportsApi.getReportsByTechnicien(userData._id);
      setReports(response);
    } catch (error) {
      message.error('Erreur de chargement des rapports');
    }
  };

  useEffect(() => {
    if (selectedMenu === '2') {
      loadReports(); // Load reports when the Reports menu is selected
    }
  }, [selectedMenu]);

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Mes tâches' },
    { key: '2', icon: <FileTextOutlined />, label: 'Rapports' },  // New "Rapports" menu item
  ];

  
  const handleReportSubmit = async (values) => {
    try {
      // Ajouter taskId et corriger les noms de champs
      const reportData = {
        ...values,
        issuesEncountered: values.issuesEncountered,
        finalStatus: values.finalStatus,
        taskId: values.taskId,
      };
      
      const response = await reportsApi.addReport(reportData); // <-- Utiliser reportsApi
      message.success('Rapport soumis avec succès');
      setReports([...reports, response.report]); // <-- Utiliser response.report
      form.resetFields();
    } catch (error) {
      message.error('Erreur lors de la soumission du rapport');
    }
  };
  
  const handleStatusChange = async (taskId, status) => {
    try {
      // Call your API to update the task's status
      await tasksApi.updateTaskStatus(taskId, { status });
  
      // Update the task list in the state to reflect the new status
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      message.success('Statut de la tâche mis à jour');
    } catch (error) {
      message.error('Erreur lors de la mise à jour du statut de la tâche');
    }
  };
  

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
          ) : selectedMenu === '1' ? (
            <Card
              title="Mes Interventions"
              bordered={false}
              extra={<Tag color="blue">{tasks.length} tâches</Tag>}
            >
              <List
                dataSource={tasks}
                renderItem={task => {
                  const vehicule = task.vehicule ? vehicules.find(v => String(v._id) === String(task.vehicule._id)) : null;

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
                            {task.vehicule && task.vehicule._id ? (
                              <div style={{ margin: '8px 0' }}>
                                <Text strong>Véhicule: </Text>
                                <Tag color="geekblue">
                                  {vehicule.model} ({vehicule.registration})
                                </Tag>
                              </div>
                            ) : (
                              <Text type="secondary">Aucun véhicule associé</Text>
                            )}
                            <div style={{ margin: '8px 0' }}>
                              <Text strong>Date et heure de mission: </Text>
                              <Text>
                                {task.startDate && task.endDate && !isNaN(new Date(task.startDate).getTime()) && !isNaN(new Date(task.endDate).getTime())
                                  ? `${new Date(task.startDate).toLocaleString()} - ${new Date(task.endDate).toLocaleString()}`
                                  : 'Date non disponible'}
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          ) : (
            // Display reports section with form and reports list
            <>
              <Card title="Créer un Rapport" bordered={false}>
  <Form form={form} layout="vertical" onFinish={handleReportSubmit}>
    {/* Nouveau champ Titre */}
    <Form.Item
      label="Titre"
      name="title"
      rules={[{ required: true, message: 'Veuillez entrer le titre' }]}
    >
      <Input />
    </Form.Item>

    {/* Sélection de la tâche */}
    <Form.Item
      label="Tâche associée"
      name="taskId"
      rules={[{ required: true, message: 'Veuillez sélectionner une tâche' }]}
    >
      <Select>
        {tasks.map(task => (
          <Option key={task._id} value={task._id}>
            {task.title} ({task.status})
          </Option>
        ))}
      </Select>
    </Form.Item>

    {/* Correction des noms de champs */}
    <Form.Item
      label="Description de l'intervention"
      name="description"
      rules={[{ required: true }]}
    >
      <TextArea rows={4} />
    </Form.Item>

    <Form.Item
      label="Temps passé (heures)"
      name="timeSpent"
      rules={[{ required: true }]}
    >
      <Input type="number" />
    </Form.Item>

    <Form.Item
      label="Problèmes rencontrés"
      name="issuesEncountered" // <-- Nom corrigé
    >
      <TextArea rows={4} />
    </Form.Item>

    <Form.Item
      label="Statut final"
      name="finalStatus" // <-- Nom corrigé
      rules={[{ required: true }]}
    >
      <Select>
        <Option value="terminé">Terminé</Option>
        <Option value="en cours">En cours</Option>
        <Option value="en attente">En attente</Option>
      </Select>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Soumettre
      </Button>
    </Form.Item>
  </Form>
</Card>

<Card title="Mes Rapports" bordered={false}>
  <List
    dataSource={reports}
    renderItem={report => (
      <List.Item key={report._id}>
        <List.Item.Meta
          title={<>
            <Text strong>{report.title}</Text>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {report.taskId?.title}
            </Tag>
          </>}
          description={
            <div style={{ lineHeight: 1.6 }}>
              <Text>Date: {new Date(report.createdAt).toLocaleDateString()}</Text><br />
              <Text>Temps passé: {report.timeSpent} heures</Text><br />
              <Text>Statut: {report.finalStatus}</Text><br />
              <Text>Problèmes: {report.issuesEncountered}</Text>
            </div>
          }
        />
      </List.Item>
    )}
  />
</Card>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TechnicienDashboard;
