//frontend/components/taskmodal
import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, DatePicker, Button } from "antd";

const { RangePicker } = DatePicker;

const TaskModal = ({ 
  isModalVisible, 
  setIsModalVisible, 
  newTask, 
  setNewTask, 
  handleCreateTask, 
  techniciens,
  vehiculesList
}) => {
  return (
    <Modal
      title="Ajouter une tâche"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      {/* Ajout du champ Title */}
      <Input
        placeholder="Titre *"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        style={{ marginBottom: 8 }}
      />
      
      <Input.TextArea
        placeholder="Description *"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        rows={3}
        style={{ marginBottom: 8 }}
      />

      {/* Ajout des champs Client et Localisation */}
      <Input
        placeholder="Client *"
        value={newTask.client}
        onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
        style={{ marginBottom: 8 }}
      />

      <Input
        placeholder="Localisation"
        value={newTask.location}
        onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
        style={{ marginBottom: 8 }}
      />

      <Select
        placeholder="Sélectionner un technicien *"
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
          label: `${veh.model} (${veh.registration})`,
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
        style={{ marginBottom: 16, width: "100%" }}
      />

      <Button 
        type="primary" 
        onClick={() => {
          handleCreateTask();
          setIsModalVisible(false);
        }}
        disabled={!newTask.title || !newTask.description || !newTask.technicien}
        block
      >
        Ajouter
      </Button>
    </Modal>
  );
};

export default TaskModal;
