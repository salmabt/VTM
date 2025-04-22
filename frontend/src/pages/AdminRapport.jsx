import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Tabs, Row, Col, List, Statistic, Button, Tag, Timeline, Typography, Spin, message, Pagination } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const AdminRapport = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ajoutez cet état dans votre composant
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

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
  const fetchVehiculesWithUtilisation = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vehicules');
      const vehiculesWithUtilisation = await Promise.all(
        response.data.map(async (vehicle) => {
          const utilisationResponse = await axios.get(`http://localhost:3000/api/vehicules/${vehicle._id}/utilisation`);
          return {
            ...vehicle,
            utilisationHeures: utilisationResponse.data.totalDuration
          };
        })
      );
      setVehicules(vehiculesWithUtilisation);
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      message.error('Erreur lors de la récupération des données des véhicules');
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      fetchTechniciens();
      fetchVehiculesWithUtilisation();
    }, 30000); // Rafraîchit toutes les 30 secondes
  
    return () => clearInterval(interval);
  }, []);
  // Charger les données au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchTechniciens();
        await fetchVehiculesWithUtilisation();
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        message.error('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.book_new();
  
    // Feuille des techniciens
    const wsTechniciens = XLSX.utils.json_to_sheet(
      techniciens.map(tech => ({
        Nom: tech.name,
        'Missions terminées': tech.completedTasks,
        'Note moyenne': tech.averageRating.toFixed(1)
      }))
    );
    XLSX.utils.book_append_sheet(ws, wsTechniciens, 'Techniciens');
  
    // Feuille des véhicules
    const wsVehicules = XLSX.utils.json_to_sheet(
      vehicules.map(vehicle => ({
        Modèle: vehicle.model,
        Immatriculation: vehicle.registration,
        'Heures d\'utilisation': vehicle.utilisationHeures,
        Statut: vehicle.status
      }))
    );
    XLSX.utils.book_append_sheet(ws, wsVehicules, 'Véhicules');
  
    // Génération du fichier
    const excelBuffer = XLSX.write(ws, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    saveAs(data, 'rapport.xlsx');
  };


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
    <Card title="Rapports et Historique" bordered={false} className='padding-rapport'>
      <div style={{ marginBottom: 16 }}>
  
  <Button type="default" onClick={exportToExcel}>📊 Exporter en Excel</Button>
</div>
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Nom</th>
                      <th style={{ textAlign: 'left' }}>Missions</th>
                      <th style={{ textAlign: 'left' }}>Note</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techniciens.map(tech => (
                      <tr key={tech._id}>
                        <td>{tech.name}</td>
                        <td>{tech.completedTasks > 0 ? tech.completedTasks : 'Aucune'}</td>
                        <td>{(tech.averageRating ?? 0).toFixed(1)}/5 ⭐</td>
                        <td style={{ textAlign: 'right' }}>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleRateChange(tech._id)}
                            loading={updatingRating === tech._id}
                          >
                            {updatingRating === tech._id ? '...' : 'Noter'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        <Card title="⏳ Temps d'Utilisation">
          <List
            dataSource={vehicules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
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
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Pagination
              current={currentPage}
              total={vehicules.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              simple
            />
          </div>
        </Card>
      </Col>
      <Col span={24} md={12}>
        <Card title="🛠️ Historique des Maintenances" style={{ marginTop: 16 }}>
          <Timeline>
            {vehicules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((vehicle) => (
              <Timeline.Item key={vehicle._id} color={getVehicleStatusColor(vehicle.status)}>
                <strong>{vehicle.model} ({vehicle.registration})</strong>
                <div>Heures d'utilisation: {vehicle.utilisationHeures}h</div>
              </Timeline.Item>
            ))}
          </Timeline>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Pagination
              current={currentPage}
              total={vehicules.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              simple
            />
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</TabPane>
      </Tabs>
    </Card>
  );
};

export default AdminRapport;