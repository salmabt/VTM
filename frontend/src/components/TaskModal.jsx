import React from "react";
import { Modal, Input, Select, DatePicker, Button } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TaskModal = ({ 
  isModalVisible, 
  setIsModalVisible, 
  newTask, 
  setNewTask, 
  handleCreateTask, 
  techniciens,
  vehiculesList
}) => {
  
  const handleAddTask = async () => {
    await handleCreateTask(); // Attendre la création de la tâche
    setIsModalVisible(false); // Fermer la modal après succès
  };

  return (
    <Modal
      title="Ajouter une tâche"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      {/* Champ Titre */}
      <Input
        placeholder="Titre *"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        style={{ marginBottom: 8 }}
      />
      
      {/* Champ Description */}
      <Input.TextArea
        placeholder="Description *"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        rows={3}
        style={{ marginBottom: 8 }}
      />

      {/* Champ Client */}
      <Input
        placeholder="Client *"
        value={newTask.client}
        onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
        style={{ marginBottom: 8 }}
      />

      {/* Champ Localisation */}
      <Input
        placeholder="Localisation"
        value={newTask.location}
        onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
        style={{ marginBottom: 8 }}
      />

      {/* Sélection du technicien */}
      <Select
        placeholder="Sélectionner un technicien *"
        onChange={(value) => setNewTask({ ...newTask, technicien: value })}
        options={techniciens.map(t => ({
          label: t.name,
          value: t._id
        }))}
        style={{ marginBottom: 8, width: "100%" }}
      />

      {/* Sélection du véhicule */}
      <Select
        placeholder="Sélectionner un véhicule *"
        onChange={(value) => setNewTask({...newTask, vehicule: value})}
        style={{ marginBottom: 8, width: "100%" }}
      >
        {vehiculesList
          .filter(veh => veh.status === 'disponible') // Seuls les véhicules disponibles
          .map(veh => (
            <Option key={veh._id} value={veh._id}>
              {veh.model} ({veh.registration})
            </Option>
        ))}
      </Select>

      {/* Sélection de la plage de dates */}
      <RangePicker
        showTime
        format="DD/MM/YYYY HH:mm"
        onChange={(dates) => setNewTask({
          ...newTask,
          startDate: dates?.[0]?.toISOString(),
          endDate: dates?.[1]?.toISOString()
        })}
        style={{ marginBottom: 16, width: "100%" }}
      />

      {/* Bouton Ajouter */}
      <Button 
        type="primary" 
        onClick={handleAddTask}
        disabled={!newTask.title || !newTask.description || !newTask.technicien || !newTask.vehicule || !newTask.startDate || !newTask.endDate}
        block
      >
        Ajouter
      </Button>
    </Modal>
  );
};

export default TaskModal;
