import React from "react";
import { Modal, Input, Select, DatePicker, Button } from "antd";

const { RangePicker } = DatePicker;

const TaskModal = ({ 
  isModalVisible, 
  setIsModalVisible, 
  newTask, 
  setNewTask, 
  handleCreateTask, 
  techniciens,
  vehiculesList // Ajout de la liste des véhicules
}) => {
  return (
    <Modal
      title="Ajouter une tâche"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Input.TextArea
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        rows={3}
        style={{ marginBottom: 8 }}
      />
      <Select
        placeholder="Sélectionner un technicien"
        onChange={(value) => setNewTask({ ...newTask, technicien: value })}
        options={techniciens.map(t => ({
          label: t.name,
          value: t._id
        }))}
        style={{ marginBottom: 8, width: "100%" }}
      />
      <Select
        placeholder="Sélectionner un véhicule *"
        onChange={(value) => setNewTask({...newTask, vehicule: value})}
        options={vehiculesList.map(veh => ({
           key: veh._id,
           value: veh._id
        
        }))}
      style={{ marginBottom: 8, width: "100%" }}
      />

      
      <RangePicker
        showTime
        format="DD/MM/YYYY HH:mm"
        onChange={(dates) => setNewTask({
          ...newTask,
          startDate: dates?.[0]?.toISOString(),
          endDate: dates?.[1]?.toISOString()
        })}
        style={{ marginBottom: 8, width: "100%" }}
      />
      <Button 
        type="primary" 
        onClick={() => {
          handleCreateTask();
          setIsModalVisible(false);
        }}
        disabled={!newTask.title || !newTask.description || !newTask.technicien}
      >
        Ajouter
      </Button>
    </Modal>
  );
};

export default TaskModal;
