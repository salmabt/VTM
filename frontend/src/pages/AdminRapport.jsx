import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Tabs, Row, Col, List, Statistic, Button, Tag, Timeline, Typography, Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const AdminRapport = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les techniciens
  const fetchTechniciens = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/techniciens/with-stats?timestamp=${Date.now()}`);
      const formattedData = response.data.map(tech => ({
        _id: tech._id,
        name: tech.name,
        skills: tech.skills || [],
        completedTasks: tech.completedTasks ?? 0,
        averageRating: Number((tech.averageRating || 0).toFixed(1)),
        ratingCount: tech.ratingCount || 0
      }));
      setTechniciens(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des techniciens:', error);
      message.error('Erreur lors de la récupération des données des techniciens');
    }
  };

  // Récupérer les véhicules
  const fetchVehicules = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vehicules');
      setVehicules(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      message.error('Erreur lors de la récupération des données des véhicules');
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTechniciens();
      fetchVehicules();
    }, 30000); // Rafraîchit toutes les 30 secondes
  
    return () => clearInterval(interval);
  }, []);
  // Charger les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchTechniciens();
        await fetchVehicules();
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        message.error('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Gérer la mise à jour de la note d'un technicien
  const [updatingRating, setUpdatingRating] = useState(null);
// Dans AdminRapport.js - Modifier la fonction handleRateChange
const handleRateChange = async (techId) => {
  const newRating = prompt('Entrez une note (0-5) :');
  const parsedRating = parseFloat(newRating);

  if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
    setUpdatingRating(techId);
    try {
      // Envoyer la note et attendre la réponse mise à jour
      const { data: updatedTech } = await axios.post(
        `http://localhost:3000/api/techniciens/${techId}/rate`,
        { rating: parsedRating }
      );

      // Mettre à jour l'état avec la réponse directe du serveur
      setTechniciens(prev => prev.map(tech => 
        tech._id === techId ? { ...tech, ...updatedTech } : tech
      ));
      
      message.success('Note enregistrée !');
    } catch (error) {
      message.error('Erreur lors de la mise à jour');
    } finally {
      setUpdatingRating(null);
    }
  } else {
    message.error('Note invalide (0-5 seulement)');
  }
};

  // Couleur du statut des véhicules
  const getVehicleStatusColor = (status) => {
    switch (status) {
      case 'disponible':
        return 'green';
      case 'réservé':
        return 'red';
      case 'en entretien':
        return 'orange';
      default:
        return 'gray';
    }
    // Lors de la mise à jour du statut
const markAsCompleted = async (taskId) => {
  try {
    await axios.patch(`/api/tasks/${taskId}/status`, {
      status: 'terminé' // Envoyer le statut exact avec accent
    });
    message.success('Tâche marquée comme terminée !');
    refreshData(); // Recharger les données
  } catch (error) {
    message.error('Échec de la mise à jour');
  }
};
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
        <p>Chargement des données en cours...</p>
      </div>
    );
  }

  return (
    <Card title="Rapports et Historique" bordered={false}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Suivi Techniciens" key="1">
          <div className="report-section">
            <Title level={3}>📊 Performances des Techniciens</Title>
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Card title="📈 Statistiques des Techniciens">
                <BarChart
  width={800}
  height={400}
  data={techniciens}
  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis 
    dataKey="name" 
    angle={-45} 
    textAnchor="end"
    tick={{ fontSize: 12 }}
    interval={0}
  />
  <YAxis />
  <Tooltip 
    formatter={(value, name) => 
      name === 'Note moyenne/5' ? value.toFixed(2) : value
    }
  />
  <Legend />
  <Bar 
    dataKey="completedTasks" 
    fill="#8884d8" 
    name="Missions terminées"
    barSize={20}
  />
  <Bar 
    dataKey="averageRating" 
    fill="#82ca9d" 
    name="Note moyenne/5"
    barSize={20}
    label={{ fill: 'white', formatter: (value) => value.toFixed(1) }}
  />
</BarChart>
                </Card>
              </Col>

              <Col span={24} md={12}>
                <Card title="📝 Détails des Techniciens">
                  <List
                    dataSource={techniciens}
                    renderItem={(tech) => (
                      <List.Item>
                        <Statistic
                          title={tech.name}
                          value={tech.completedTasks ?? 0}
                          suffix={
                            <>
                              <div style={{ marginTop: 5 }}>
                              <Text strong>
    Nombre de Missions réalisées: {tech.completedTasks > 0 ? tech.completedTasks : 'Aucune'}
</Text>


                                <br />
                                <Text strong>Note sur la qualité de rapport soumis: {(tech.averageRating ?? 0).toFixed(1)}/5 ⭐</Text>
                                <br />
                                <Text strong>Compétences: {tech.skills?.length ? tech.skills.join(', ') : 'Aucune'}</Text>
                              </div>
                              <Button
  type="primary"
  size="small"
  onClick={() => handleRateChange(tech._id)}
  loading={updatingRating === tech._id}
  style={{ marginTop: 5 }}
>
  {updatingRating === tech._id ? 'Enregistrement...' : '⭐ Noter'}
</Button>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Utilisation Véhicules" key="2">
          <div className="vehicle-reports">
            <Title level={3}>🚗 Gestion et Utilisation des Véhicules</Title>
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Card title="📊 Statut des Véhicules">
                  <PieChart width={400} height={400}>
                    <Pie
                      data={vehicules.reduce((acc, veh) => {
                        const exist = acc.find((item) => item.name === veh.status);
                        exist ? exist.value++ : acc.push({ name: veh.status, value: 1 });
                        return acc;
                      }, [])}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                      dataKey="value"
                    >
                      {vehicules.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getVehicleStatusColor(entry.status)} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </Card>
              </Col>

              <Col span={24} md={12}>
                <Card title="⏳ Temps d'Utilisation">
                  <List
                    dataSource={vehicules}
                    renderItem={(vehicle) => (
                      <List.Item>
                        <Statistic
                          title={`${vehicle.model} (${vehicle.registration})`}
                          value={vehicle.utilisationHeures}
                          suffix="heures"
                          precision={1}
                        />
                        <Tag color={getVehicleStatusColor(vehicle.status)}>{vehicle.status}</Tag>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="🛠️ Historique des Maintenances" style={{ marginTop: 16 }}>
              <Timeline>
                {vehicules.map((vehicle) => (
                  <Timeline.Item key={vehicle._id} color={getVehicleStatusColor(vehicle.status)}>
                    <strong>{vehicle.model} ({vehicle.registration})</strong>
                    <div>Dernière maintenance: {vehicle.lastMaintenance}</div>
                    <div>Heures d'utilisation: {vehicle.utilisationHeures}h</div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default AdminRapport;