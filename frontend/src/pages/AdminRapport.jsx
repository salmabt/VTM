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
      const response = await axios.get(`http://localhost:3000/api/techniciens?timestamp=${new Date().getTime()}`);
      console.log('Données reçues de l\'API:', response.data);
      const data = response.data;
      const formattedData = data.map((tech) => ({
        ...tech,
        averageRating: tech.averageRating ?? 0,
        completedTasks: tech.completedTasks ?? 0,
        ratingCount: tech.ratingCount ?? 0,
      }));
      setTechniciens(formattedData);
      localStorage.setItem('techniciens', JSON.stringify(formattedData));
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

  // Charger les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedTechniciens = localStorage.getItem('techniciens');
        if (storedTechniciens) {
          setTechniciens(JSON.parse(storedTechniciens));
        } else {
          await fetchTechniciens();
        }
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
  const handleRateChange = async (techId) => {
    const newRating = prompt('Entrez une note (0-5) :');
    const parsedRating = parseFloat(newRating);
  
    if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
      try {
        const response = await axios.post(`http://localhost:3000/api/techniciens/${techId}/rate`, {
          rating: parsedRating,
        });
        console.log('API Response:', response.data);
  
        const updatedTechnicien = response.data;
        console.log('Technicien mis à jour:', updatedTechnicien);
  
        setTechniciens((prev) => {
          const updatedTechniciens = prev.map((tech) =>
            tech._id === techId
              ? {
                  ...tech,
                  averageRating: updatedTechnicien.averageRating,
                  ratingCount: updatedTechnicien.ratingCount,
                }
              : tech
          );
          localStorage.setItem('techniciens', JSON.stringify(updatedTechniciens));
          return updatedTechniciens;
        });
        message.success('Note enregistrée !');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la note:', error);
        if (error.response) {
          console.error('Réponse du serveur:', error.response.data);
          console.error('Statut:', error.response.status);
          console.error('En-têtes:', error.response.headers);
        } else if (error.request) {
          console.error('Aucune réponse reçue:', error.request);
        } else {
          console.error('Erreur lors de la configuration de la requête:', error.message);
        }
        message.error('Erreur lors de la mise à jour de la note');
      }
    } else {
      message.error('Veuillez entrer une note valide entre 0 et 5.');
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
                    <XAxis dataKey="name" angle={-0} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completedTasks" fill="#8884d8" name="Missions terminées" />
                    <Bar dataKey="averageRating" fill="#82ca9d" name="Note moyenne/5" />
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
                                <Text strong>Nombre de Missions réalisées: {tech.completedTasks}</Text>
                                <br />
                                <Text strong>Note sur la qualité de rapport soumis: {(tech.averageRating ?? 0).toFixed(1)}/5 ⭐</Text>
                                <br />
                                <Text strong>Compétences: {tech.skills?.length ? tech.skills.join(', ') : 'Aucune'}</Text>
                              </div>
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => handleRateChange(tech._id)}
                                style={{ marginTop: 5 }}
                              >
                                ⭐ Noter
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