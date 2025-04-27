//frontend/src/pages/techniciendashboard
import React, { useState, useEffect } from 'react';
import { Layout, List, Card, Typography, Spin, message, Menu, Avatar, Button, Select, Tag, Form, Input,  Badge,Col,Row,Popover,Modal,Collapse } from 'antd';
import { CalendarOutlined, LogoutOutlined, UserOutlined, FileTextOutlined, BellOutlined , CarOutlined, 
  EnvironmentOutlined, 
  PaperClipOutlined, 
  DownloadOutlined, 
  InfoCircleOutlined, 
  CaretDownOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import tasksApi from '../api/tasks';
import vehiculesApi from '../api/vehicules';
import reportsApi from '../api/reports'; 
import '../styles/technicien-dashboard.css';
import '../styles/TechnicienInterface.css';
import technicienAvatar from '../assets/technicien-avatar.jpg';
import TechnicienMap from './TechnicienMap';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const TaskSection = ({ title, tasks, statusFilter, collapsed = false ,vehicules,handleStatusChange,setSelectedTask }) => {
  const filteredTasks = tasks.filter(task => statusFilter.includes(task.status));

  return (
     <Collapse 
      defaultActiveKey={collapsed ? [] : ['1']}
      className="responsive-collapse"
    >
      <Panel 
        header={`${title} (${filteredTasks.length})`} 
        key="1"
        extra={<Tag color="#2db7f5">{statusFilter.join(' / ')}</Tag>}
      >
        <div className="task-grid">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id}
              setSelectedTask={setSelectedTask}  
              task={task} 
              vehicule={vehicules.find(v => v._id === task.vehicule?._id)}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </Panel>
    </Collapse>
  );
};
const TaskCard = ({ task, vehicule, handleStatusChange,setSelectedTask }) => {
  // Ajouter dans TaskCard :
const statusColor = {
  'planifié': '#1890ff',
  'en cours': '#52c41a',
  'terminé': '#f5222d'
}[task.status];
  // Vérification si modifiable
  const isEditable = () => {
    const today = new Date();
    const taskDate = new Date(task.startDate);
    return today.toDateString() === taskDate.toDateString();
  };
  

  return (
    <Card
      key={task._id}
      className="task-card"
      hoverable
      style={{ borderLeft: `4px solid ${statusColor}` }}
    >
      <div className="card-header">
        <Text strong style={{ fontSize: 16 }}>{task.title}</Text>
        <Tag color={statusColor} style={{ marginLeft: 1 }}>
          {task.status.toUpperCase()}
        </Tag>
      </div>

      <div className="card-content">
        <div className="info-section">
          <CalendarOutlined />
          <Text>
{new Date(task.startDate).toLocaleDateString()} {/* Affiche la date */}
{' '}à{' '} 
{new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Affiche l'heure de début */}
{' - '}
{new Date(task.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Affiche l'heure de fin */}
</Text>
        </div>

        {vehicule && (
          <div className="info-section">
            <CarOutlined />
            <Text>{vehicule.model} ({vehicule.registration})</Text>
          </div>
        )}

        <div className="info-section">
          <EnvironmentOutlined />
          <Text>{typeof task.location === 'string' 
      ? task.location 
      : task.location?.address || 'Adresse non spécifiée'}
      </Text>
        </div>

        {task.attachments?.length > 0 && (
          <div className="attachments-section">
            <PaperClipOutlined />
            {task.attachments.map((attachment, index) => (
              <Button
                key={index}
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadAttachment(task._id, attachment.filename)}
              >
                {attachment.originalName}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="card-actions">
      <div className="action-group">
        <Select
          value={task.status}
          style={{ width: '100%' }}
          onChange={(value) => handleStatusChange(task._id, value)}
          suffixIcon={<CaretDownOutlined style={{ color: statusColor }} />}
          disabled={!isEditable()}
        >
          <Option value="planifié">Planifié</Option>
          <Option value="en cours">En cours</Option>
          <Option value="terminé">Terminé</Option>
        </Select>
         {!isEditable() && (
        <Text type="secondary" className="task-date-warning">
          Modification disponible le {new Date(task.startDate).toLocaleDateString()}
        </Text>
      )} 
      </div>
        <Button 
          type="link" 
          icon={<InfoCircleOutlined />} 
          onClick={() => setSelectedTask(task)}
        >
          Détails
        </Button>
        </div>

     
    </Card>
  );
};
const TechnicienDashboard = () => {
  const { userData, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [reports, setReports] = useState([]);  // State for reports
  const [notifications, setNotifications] = useState([]);
  const [form] = Form.useForm();  // Form instance for the report formù
  const [selectedTask, setSelectedTask] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // Charger les notifications
useEffect(() => {
  const loadNotifications = async () => {
    if (userData?._id) {
      const response = await tasksApi.getNotifications(userData._id);
      setNotifications(response.data);
    }
  };
  loadNotifications();
}, [userData?._id]);

// Connexion SSE
useEffect(() => {
  if (userData?._id) {
    const sse = new EventSource(`http://localhost:3000/api/tasks/notifications/sse?userId=${userData._id}`);
    sse.onopen = () => console.log('Connexion SSE établie');
    sse.onerror = (e) => console.error('Erreur SSE:', e);

    sse.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('Notification SSE reçue:', data);
        setNotifications(prev => [{
          _id: Date.now().toString(), // ID temporaire
          ...data,
          read: false,
          relatedTask: { _id: data.taskId },
          createdAt: new Date(data.createdAt)
        }, ...prev]);
      } catch (error) {
        console.error('Erreur parsing SSE:', error);
      }
    };

    return () => sse.close();
  }
}, [userData?._id]);
// Gestionnaire de clic de notification
const handleNotificationClick = async (notification) => {
  try {
    await tasksApi.markNotificationRead(notification._id);
    setNotifications(prev => 
      prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
    );
    
    // Find the related task in the tasks list
    const task = tasks.find(t => t._id === notification.relatedTask._id);
    if (task) {
      setSelectedTask(task); // Open modal with task details
    } else {
      message.info("La tâche associée n'est pas disponible.");
    }
  } catch (error) {
    console.error('Error handling notification click:', error);
  }
};
// Contenu du Popover
// Contenu du Popover
const notificationContent = (
  <div style={{ maxWidth: 300, maxHeight: 400, overflowY: 'auto' }}>
    {/* Ajoutez ces styles */}
    <List
      dataSource={notifications}
      style={{ width: '100%' }} // Assurez-vous que la liste utilise toute la largeur
      renderItem={item => (
        <List.Item 
          onClick={() => handleNotificationClick(item)}
          style={{ 
            cursor: 'pointer', 
            backgroundColor: item.read ? '#fff' : '#f6ffed',
            padding: '8px 16px' 
          }}
        >
          <List.Item.Meta
            title={<span style={{ fontSize: 14 }}>{item.message}</span>}
            description={
              <span style={{ fontSize: 12, color: '#999' }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            }
          />
        </List.Item>
      )}
    />
  </div>
);

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
       
        // Afficher les détails des tâches
        tasksResponse.data.forEach(task => {
          console.log(`Tâche: ${task.title}`, task);
        });
  
        // Afficher les détails des véhicules
        vehiculesResponse.data.forEach(vehicule => {
          console.log(`Véhicule: ${vehicule.model}`, vehicule);
        });

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

  ///status tache 
  const handleStatusChange = async (taskId, status) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
  
    // Vérification de la date
    const today = new Date();
    const taskDate = new Date(task.startDate);
    
    // Comparaison des dates sans l'heure
    const isSameDay = today.toDateString() === taskDate.toDateString();
  
    if (!isSameDay) {
      message.error('Modification uniquement autorisée le jour de la tâche');
      return;
    }
  
    try {
      await tasksApi.updateTaskStatus(taskId, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
      message.success('Statut mis à jour');
    } catch (error) {
      message.error('Échec de la mise à jour');
    }
  };

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
    if (selectedMenu === '3') {
      loadReports();
    }
  }, [selectedMenu]);
  // Ajoutez cette fonction de regroupement des tâches
const groupTasks = (tasks) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.reduce((acc, task) => {
    const taskDate = new Date(task.startDate);
    taskDate.setHours(0, 0, 0, 0);
    
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      acc.today.push(task);
    } else if (diffDays === 1) {
      acc.tomorrow.push(task);
    } else if (diffDays > 1) {
      acc.upcoming.push(task);
    } else {
      acc.past.push(task);
    }

    return acc;
  }, { today: [], tomorrow: [], upcoming: [], past: [] });
};
  

  const menuItems = [
    { key: '1', icon: <CalendarOutlined />, label: 'Mes tâches' },
    { key: '2', icon: <FileTextOutlined />, label: 'Rapports' },  
    { key: '3', icon: <FileTextOutlined />, label: 'Historique des Rapports' },
  ];

  
  const handleReportSubmit = async (values) => {
    try {
      const reportData = {
        ...values,
        taskId: values.taskId
      };
      
      const response = await reportsApi.addReport(reportData);
      message.success('Rapport soumis avec succès');
      
      // Rafraîchir les données de la tâche
      const updatedTasks = await tasksApi.getTasksByTechnicien(userData._id);
      setTasks(updatedTasks.data);
      
      form.resetFields();
    } catch (error) {
      message.error('Erreur lors de la soumission du rapport');
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



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light" width={200}>
        <div className="logo" style={{ padding: 16, textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Interface technicien</Title>
        </div><div style={{ 
  padding: '10px 16px',
  textAlign: 'center',
  marginTop: 'auto', // Pousse le bloc vers le bas
  borderTop: '1px solid #f0f0f0'
}}>
  <Avatar
    size={80}
    src={technicienAvatar}
    style={{ 
      marginBottom: 12,
      border: '2px solid #1890ff',
      backgroundColor: '#e6f7ff'
    }}
  />
  <div style={{ padding: '0 8px' }}>
    <Text strong style={{ display: 'block', fontSize: 16, marginBottom: 4 }}>
      {userData?.name}
    </Text>
    <Text type="secondary" style={{ fontSize: 14 }}>
      Technicien certifié
    </Text>
  </div>
</div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onSelect={({ key }) => setSelectedMenu(key)}
        />

      </Sider>

      <Layout style={{ padding: '0 24px 24px' }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
        
          <div style={{ display: 'flex', alignItems: 'center', gap: 16,marginLeft: 'auto'  }}>
            {/* Notification Button with Badge */}
           
<Badge count={notifications.filter(n => !n.read).length}>
  <Popover 
    content={notificationContent} 
    title="Notifications" 
    trigger="click"
  >
    <Button
      icon={<BellOutlined />}
      shape="circle"
      style={{ fontSize: 20 }}
    />
  </Popover>
</Badge>
          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            danger
          >
            Déconnexion
          </Button>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {loading ? (
           <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          ) : (
            <>

{selectedMenu === '1' && (
  <Card
    title="Mes Interventions"
    bordered={false}
    extra={<Tag color="blue">{tasks.length} tâches</Tag>}
  >
    <div className="structured-tasks">
    
<TaskSection
  title="Aujourd'hui"
  setSelectedTask={setSelectedTask}
  tasks={groupTasks(tasks).today}
  statusFilter={['planifié', 'en cours', 'terminé']}
  vehicules={vehicules} 
  handleStatusChange={handleStatusChange}
/>

<TaskSection
  title="Demain"
  setSelectedTask={setSelectedTask}
  tasks={groupTasks(tasks).tomorrow}
  statusFilter={['planifié']}
  collapsed={true}
  vehicules={vehicules}
  handleStatusChange={handleStatusChange}
/>

<TaskSection
  title="À venir"
  setSelectedTask={setSelectedTask}
  tasks={groupTasks(tasks).upcoming}
  statusFilter={['planifié']}
  collapsed={true}
  vehicules={vehicules} 
  handleStatusChange={handleStatusChange}
/>
    </div>
  </Card>
)}

{selectedMenu === '2' && (
            
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
  {tasks
    .filter(task => task.status === 'terminé')
    .map(task => (
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
      name="issuesEncountered" 
    >
      <TextArea rows={4} />
    </Form.Item>

    <Form.Item
      label="Statut final"
      name="finalStatus" // <-- Nom corrigé
      rules={[{ required: true }]}
    >
      <Select>
      <Option value="reussi">Réussi</Option>
      <Option value="echouée">Échoué</Option>
      </Select>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Soumettre
      </Button>
    </Form.Item>
  </Form>
</Card>
</>
)}

{selectedMenu === '3' && (
<Card title="Historique des Rapports" bordered={false}>
<List
      dataSource={reports.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
      )}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        onChange: (page, pageSize) => {
          setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize,
          }));
        },
      }}
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
 )}
 </>
)}
</Content>
        
      </Layout>
     
      <Modal
  title="Détails de la Mission"
  open={!!selectedTask}
  onCancel={() => setSelectedTask(null)}
  footer={[
    <Button key="close" onClick={() => setSelectedTask(null)}>
      Fermer
    </Button>
  ]}
  
  width={Math.min(window.innerWidth - 40, 600)} // Adaptation responsive
>
  {selectedTask && (
     <div style={{ wordBreak: 'break-word' }}>
      <Text strong>Titre du tache: </Text>
      <Text>{selectedTask.title}</Text>
      <br />
      <Text strong>Nom du Client et son numéro du télèphone: </Text>
      <Text>{selectedTask.client}</Text>
      <br />
      <Text strong>Ville: </Text>
      <Text>{typeof selectedTask.location === 'string'
          ? selectedTask.location
          : selectedTask.location?.address || selectedTask.location?.formattedAddress}</Text>
      <br />
      <Text strong>Adresse compléte: </Text>
      <Text>{selectedTask.adresse}</Text>
      
      <br />
      <Text strong>Description du tâche: </Text>
      <Text>{selectedTask.description}</Text>
      
      <br />
        {/* Ajout de la carte */}
        <div style={{ height: '400px', marginTop: 20 }}>
        <TechnicienMap 
          technician={{
            name: userData?.name || 'Technicien',
            coordinates: selectedTask?.coordinates,
            vehicle: vehicules.find(v => v._id === selectedTask.vehicule)
          }}
          client={{
            name: selectedTask.client,
            address: selectedTask.adresse,
            location: typeof selectedTask.location === 'string' 
              ? selectedTask.location 
              : selectedTask.location?.address,
            coordinates: selectedTask?.coordinates
          }}
          showRoute={true}
          onGeocodingError={(error) => {
            message.error(`Erreur de localisation: ${error.message}`);
          }}
        />
      </div>
    </div>
  )}
</Modal>
    </Layout>
  );
};

export default TechnicienDashboard;
