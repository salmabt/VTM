import React, { useState, useEffect } from 'react';
import { Avatar, Card, List, Tag, Typography, Divider, Button, Spin, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const TechniciensSection = ({ 
    techniciens, 
    tasks, 
    vehicules,
    selectedTech,
    onTechSelect,
    techTasks,
    onTasksUpdate,
    assignedVehicles,
    onVehiclesUpdate 
  }) => {
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const vehiculeExists = (vehiculeId) => 
      vehicules.some(v => v._id === vehiculeId);

    useEffect(() => {
      const updateData = () => {
        if (!selectedTech) return;
        
        const filteredTasks = tasks.filter(task => 
          task.technicien === selectedTech._id && 
          vehiculeExists(task.vehicule)
        );

        onTasksUpdate(filteredTasks);
        onVehiclesUpdate(
          vehicules.filter(v => 
            filteredTasks.some(task => task.vehicule === v._id)
          )
        );
      };

      setLoadingTasks(true);
      updateData();
      setLoadingTasks(false);
    }, [selectedTech, tasks, vehicules]);

    const handleTechClick = (tech) => {
      onTechSelect(tech === selectedTech ? null : tech);
      setIsModalVisible(true);
    };

    const handleCloseModal = () => {
      setIsModalVisible(false);
      onTechSelect(null);
    };

    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          padding: '8px 0',
          minHeight: 120
        }}>
          {techniciens.map(tech => (
            <div
              key={tech._id}
              onClick={() => handleTechClick(tech)}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: 8,
                border: selectedTech?._id === tech._id 
                  ? '2px solid #1890ff' 
                  : '1px solid #f0f0f0',
                borderRadius: '50%',
                minWidth: 100,
                transition: 'all 0.3s ease'
              }}
            >
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#87d068' }}
              />
              <div style={{ marginTop: 8, fontWeight: 500 }}>{tech.name}</div>
            </div>
          ))}
        </div>

        <Modal 
          title={`Détails de ${selectedTech?.name}`}
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="back" onClick={handleCloseModal}>
              Fermer
            </Button>
          ]}
        >
          {selectedTech && (
            <>
              {loadingTasks ? (
                <Spin tip="Chargement..." style={{ display: 'block', margin: '20px 0' }} />
              ) : (
                <>
                  <UserInfoSection selectedTech={selectedTech} />
                  <SkillsSection selectedTech={selectedTech} />
                  <TasksSection tasks={techTasks} vehicules={vehicules} />
                  <VehiclesSection vehicles={assignedVehicles} />
                </>
              )}
            </>
          )}
        </Modal>
      </div>
    );
  };

  // Les sous-composants restent inchangés
  const UserInfoSection = ({ selectedTech }) => (
    <div>
      <Title level={5} style={{ color: '#1890ff' }}>Informations personnelles</Title>
      <div style={{ lineHeight: 1.6 }}>
        <Text strong>Email: </Text>{selectedTech.email || 'Non renseigné'}<br/>
        <Text strong>Téléphone: </Text>{selectedTech.phone || 'Non renseigné'}
      </div>
    </div>
  );

  const SkillsSection = ({ selectedTech }) => (
    <>
      <Divider />
      <div>
        <Title level={5} style={{ color: '#1890ff' }}>Compétences techniques</Title>
        <div style={{ marginTop: 8 }}>
          {selectedTech.skills?.length > 0 ? (
            selectedTech.skills.map((skill, index) => (
              <Tag key={index} color="blue" style={{ margin: 4, borderRadius: 12 }}>
                {skill}
              </Tag>
            ))
          ) : (
            <Text type="secondary">Aucune compétence enregistrée</Text>
          )}
        </div>
      </div>
    </>
  );

  const TasksSection = ({ tasks, vehicules }) => (
    <>
      <Divider />
      <div>
        <Title level={5} style={{ color: '#1890ff' }}>Interventions planifiées</Title>
        <List
          size="small"
          dataSource={tasks}
          renderItem={task => (
            <TaskListItem task={task} vehicules={vehicules} />
          )}
        />
      </div>
    </>
  );

  const TaskListItem = ({ task, vehicules }) => (
    <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ flex: 1 }}>
        <Text strong style={{ display: 'block' }}>{task.title}</Text>
        <Text type="secondary">
          {moment(task.startDate).format('DD/MM HH:mm')} -{' '}
          {moment(task.endDate).format('DD/MM HH:mm')}
        </Text>
      </div>
      <div>
        <Text type="secondary">
          {vehicules.find(v => v._id === task.vehicule)?.model || 'Véhicule non spécifié'}
        </Text>
      </div>
    </List.Item>
  );

  const VehiclesSection = ({ vehicles }) => (
    <>
      <Divider />
      <div>
        <Title level={5} style={{ color: '#1890ff' }}>Véhicules attribués</Title>
        <List
          size="small"
          dataSource={vehicles}
          renderItem={veh => (
            <VehicleListItem vehicle={veh} />
          )}
        />
      </div>
    </>
  );

  const VehicleListItem = ({ vehicle }) => (
    <List.Item>
      <div style={{ flex: 1 }}>
        <Text strong>{vehicle.model}</Text>
        <Text type="secondary">{vehicle.registration}</Text>
      </div>
      <Tag color={vehicle.status === 'disponible' ? 'green' : 'orange'}>
        {vehicle.status}
      </Tag>
    </List.Item>
  );

  export default TechniciensSection;