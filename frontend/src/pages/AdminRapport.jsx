import React, { useState, useEffect } from 'react';
import { Card, Tabs, Row, Col, List, Statistic, Button, Tag, Timeline, Typography, Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const { Text, Title } = Typography; // Extrayez `Text` et `Title` de `Typography`
const { TabPane } = Tabs;

const AdminRapport = () => {
  // États pour stocker les données des techniciens et des véhicules
  const [techniciens, setTechniciens] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  // Fonction pour récupérer les données des techniciens depuis l'API
  const fetchTechniciens = async () => {
    try {
      const response = await fetch('/api/techniciens'); // Remplacez par votre endpoint
      const data = await response.json();
      setTechniciens(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des techniciens:', error);
    }
  };

  // Fonction pour récupérer les données des véhicules depuis l'API
  const fetchVehicules = async () => {
    try {
      const response = await fetch('/api/vehicules'); // Remplacez par votre endpoint
      const data = await response.json();
      setVehicules(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
    }
  };

  // Utilisez useEffect pour charger les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTechniciens();
      await fetchVehicules();
      setLoading(false);
    };

    fetchData();
  }, []);

  // Fonction pour obtenir la couleur en fonction du statut du véhicule
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

  // Fonction pour gérer la notation d'un technicien
  const handleRateChange = async (techId) => {
    const newRating = prompt('Entrez une note (0-5) :');
    const parsedRating = parseFloat(newRating);

    if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
      setTechniciens((prev) =>
        prev.map((tech) =>
          tech._id === techId
            ? {
                ...tech,
                averageRating: ((tech.averageRating * tech.ratingCount) + parsedRating) / (tech.ratingCount + 1),
                ratingCount: tech.ratingCount + 1,
              }
            : tech
        )
      );
      message.success('Note enregistrée !');
    } else {
      message.error('Veuillez entrer une note valide entre 0 et 5.');
    }
  };

  // Afficher un spinner pendant le chargement des données
  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <Card title="Rapports et Historique" bordered={false}>
      <Tabs defaultActiveKey="1">
        {/* Suivi des Techniciens */}
        <TabPane tab="Suivi Techniciens" key="1">
          <div className="report-section">
            <Title level={3}>📊 Performances des Techniciens</Title>
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Card title="📈 Statistiques des Techniciens">
                  <BarChart
                    width={500}
                    height={300}
                    data={techniciens}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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

        {/* Utilisation des Véhicules */}
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