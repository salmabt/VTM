import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Tabs, Row, Col, List, Statistic, Button, Tag, Timeline, Typography, Spin, message, Pagination,Table } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
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

  const techniciensColumns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      responsive: ['md'],
    },
    {
      title: 'Missions',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
      render: (text) => text > 0 ? text : 'Aucune',
    },
    {
      title: 'Note',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (text) => `${text.toFixed(1)}/5 ⭐`,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleRateChange(record._id)}
          loading={updatingRating === record._id}
        >
          {updatingRating === record._id ? '...' : 'Noter'}
        </Button>
      ),
    },
  ];

  return (
    <Card title="Rapports et Historique" bordered={false} className='padding-rapport'>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
  <Button type="default" size="small" onClick={exportToExcel}>
    📊 Exporter en Excel
  </Button>
</div>

      
      <Tabs defaultActiveKey="1">
        <TabPane tab="Suivi Techniciens" key="1">
          <div className="report-section">
            <Title level={3}>📊 Performances des Techniciens</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={24} lg={12}>
                <Card title="📈 Statistiques des Techniciens">
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={techniciens}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end"
                          tick={{ fontSize: 10 }}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => 
                            name === 'Note moyenne/5' ? value.toFixed(2) : value
                          }
                        />
                        <Legend wrapperStyle={{ paddingTop: 20 }}/>
                        <Bar 
                          dataKey="completedTasks" 
                          fill="#8884d8" 
                          name="Missions terminées"
                        />
                        <Bar 
                          dataKey="averageRating" 
                          fill="#82ca9d" 
                          name="Note moyenne/5"
                          label={{ fill: 'white', formatter: (value) => value.toFixed(1) }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={24} lg={12}>
                <Card title="📝 Détails des Techniciens">
                  <Table
                    dataSource={techniciens}
                    columns={techniciensColumns}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: true }}
                    size="small"
                    rowKey="_id"
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
              <Col xs={24} md={12}>
                <Card title="⏳ Temps d'Utilisation">
                  <List
                    dataSource={vehicules}
                    renderItem={(vehicle) => (
                      <List.Item
                        actions={[
                          <Tag color={getVehicleStatusColor(vehicle.status)}>
                            {vehicle.status}
                          </Tag>
                        ]}
                      >
                        <Statistic
                          title={`${vehicle.model} (${vehicle.registration})`}
                          value={vehicle.utilisationHeures}
                          suffix="heures"
                          precision={1}
                        />
                      </List.Item>
                    )}
                    pagination={{
                      current: currentPage,
                      pageSize: itemsPerPage,
                      total: vehicules.length,
                      onChange: (page) => setCurrentPage(page),
                      simple: true,
                      responsive: true,
                      position: 'bottom',
                      style: { textAlign: 'center' }
                    }}
                  />
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card title="🛠️ Historique des Maintenances">
                  <Timeline mode="alternate">
                    {vehicules
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((vehicle) => (
                        <Timeline.Item 
                          key={vehicle._id} 
                          color={getVehicleStatusColor(vehicle.status)}
                          label={`${vehicle.utilisationHeures}h`}
                        >
                          <Text strong>{vehicle.model}</Text>
                          <br />
                          <Text type="secondary">{vehicle.registration}</Text>
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
                      responsive
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