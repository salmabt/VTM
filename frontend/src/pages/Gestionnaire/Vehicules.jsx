//pages/gestionnaire/vehicules
import React, { useState } from 'react';
import { Card, List, Input, Select, Button, Typography, message } from 'antd';
import vehiculesApi from '../../api/vehicules';

const { Option } = Select;
const { Text } = Typography;

const Vehicules = ({ vehicules, setVehicules }) => {
  const [newVehicule, setNewVehicule] = useState({
    registration: '',
    model: '',
    status: 'disponible'
  });

  const handleAddVehicule = async () => {
      try {
        const { data } = await vehiculesApi.createVehicule(newVehicule);
        setVehicules([...vehicules, data]);
        setNewVehicule({ registration: '', model: '', status: 'disponible' });
        message.success('Véhicule ajouté avec succès');
      } catch (error) {
        message.error(error.response?.data?.message || "Erreur lors de l'ajout");
      }
    };
    const handleDeleteVehicule = async (id) => {
      try {
        await vehiculesApi.deleteVehicule(id);
        setVehicules(vehicules.filter(v => v._id !== id));
        message.success('Véhicule supprimé avec succès');
      } catch (error) {
        message.error(error.response?.data?.message || 'Erreur de suppression');
      }
    };

  return (
    <Card title="Gestion des véhicules" bordered={false}>
                      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Input
                          placeholder="Immatriculation *"
                          value={newVehicule.registration}
                          onChange={(e) => setNewVehicule({...newVehicule, registration: e.target.value})}
                          style={{ width: 200 }}
                        />
                        <Input
                          placeholder="Modèle *"
                          value={newVehicule.model}
                          onChange={(e) => setNewVehicule({...newVehicule, model: e.target.value})}
                          style={{ width: 200 }}
                        />
                        <Select
                          value={newVehicule.status}
                          onChange={(value) => setNewVehicule({...newVehicule, status: value})}
                          style={{ width: 150 }}
                        >
                          <Option value="disponible">Disponible</Option>
                          <Option value="en entretien">En entretien</Option>
                          <Option value="réservé">Réservé</Option>
                        </Select>
                        <Button
                          type="primary"
                          onClick={handleAddVehicule}
                          disabled={!newVehicule.registration || !newVehicule.model}
                          style={{ minWidth: 150 }}
                        >
                          Ajouter Véhicule
                        </Button>
                      </div>
                      <List
                        dataSource={vehicules}
                        renderItem={vehicule => (
                          <List.Item
                            actions={[
                              <Button danger onClick={() => handleDeleteVehicule(vehicule._id)}>
                                Supprimer
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              title={
                                <Text strong>
                                  {vehicule.model} ({vehicule.registration})
                                </Text>
                              }
                              description={
                                <Text
                                  type={vehicule.status === 'disponible' ? 'success' : 'warning'}
                                >
                                  Statut: {vehicule.status}
                                </Text>
                              }
                            />
                          </List.Item>
                        )}
                      />
    </Card>
  );
};

export default Vehicules;