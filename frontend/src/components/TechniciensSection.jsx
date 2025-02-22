import React, { useState } from 'react';
import { Avatar, Card, List, Tag, Typography, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TechniciensSection = ({ techniciens, tasks, vehicules }) => {
  const [selectedTech, setSelectedTech] = useState(null);

  const getAssignedTasks = (techId) => 
    tasks.filter(task => task.technicien === techId);

  const getAssignedVehicles = (techId) => {
    const techTasks = getAssignedTasks(techId);
    return vehicules.filter(veh => 
      techTasks.some(task => task.vehicule === veh._id)
    );
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        overflowX: 'auto',
        padding: '8px 0'
      }}>
        {techniciens.map(tech => (
          <div
            key={tech._id}
            onClick={() => setSelectedTech(tech)}
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: 8,
              border: selectedTech?._id === tech._id 
                ? '2px solid #1890ff' 
                : '1px solid #f0f0f0',
              borderRadius: '50%'
            }}
          >
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#87d068' }}
            />
            <div style={{ marginTop: 8 }}>{tech.name}</div>
          </div>
        ))}
      </div>

      {selectedTech && (
        <Card 
          title={`Détails de ${selectedTech.name}`} 
          style={{ marginTop: 16 }}
          extra={<Button onClick={() => setSelectedTech(null)}>Fermer</Button>}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <Title level={5}>Informations de base</Title>
              <Text strong>Email: </Text>{selectedTech.email}<br/>
              <Text strong>Téléphone: </Text>{selectedTech.phone || 'Non renseigné'}<br/>
              
              <Divider />
              
              <Title level={5}>Compétences</Title>
              {selectedTech.skills?.map(skill => (
                <Tag key={skill} color="blue" style={{ margin: 4 }}>{skill}</Tag>
              ))}
            </div>

            <div>
              <Title level={5}>Tâches assignées</Title>
              <List
                size="small"
                dataSource={getAssignedTasks(selectedTech._id)}
                renderItem={task => (
                  <List.Item>
                    <Text>{task.title}</Text>
                    <div>
                      {moment(task.startDate).format('DD/MM HH:mm')} -{' '}
                      {moment(task.endDate).format('DD/MM HH:mm')}
                    </div>
                  </List.Item>
                )}
              />

              <Divider />

              <Title level={5}>Véhicules utilisés</Title>
              <List
                size="small"
                dataSource={getAssignedVehicles(selectedTech._id)}
                renderItem={veh => (
                  <List.Item>
                    {veh.model} ({veh.registration})
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TechniciensSection;