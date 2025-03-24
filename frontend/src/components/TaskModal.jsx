import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Button } from "antd";
import tasksApi from "../api/tasks"; // Importez votre API

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
  const [files, setFiles] = useState([]);
  const [selectedTechnicien, setSelectedTechnicien] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Récupérer les tâches depuis MongoDB
    const fetchTasks = async () => {
      try {
        const response = await tasksApi.getAllTasks();
        console.log("Tâches récupérées :", response.data); // Afficher les tâches
        setTasks(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches", error);
      }
    };

    fetchTasks();
  }, []);

  const handleFileChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewTask({ ...newTask, files });
  };

  const handleAddTask = async () => {
    await handleCreateTask();
    setIsModalVisible(false);
  };

  // Calculer le nombre de tâches "planifiées" et "en cours" pour chaque technicien
  const calculateTaskCount = (technicienId) => {
    return tasks.filter(task => 
      task.technicien._id === technicienId && // Accéder à task.technicien._id
      (task.status === "planifié" || task.status === "en cours")
    ).length;
  };

  // Trier les techniciens par ordre croissant du nombre de tâches
  const sortedTechniciens = [...techniciens].sort((a, b) => 
    calculateTaskCount(a._id) - calculateTaskCount(b._id)
  );

  // Vérifier la disponibilité du technicien
  const isTechnicienAvailable = (technicienId, startDate, endDate) => {
    const technicien = techniciens.find(t => t._id === technicienId);
    if (!technicien || !technicien.schedule) return true; // Si le technicien ou son emploi du temps n'existe pas, considérez-le comme disponible
    return !technicien.schedule.some(task => 
      new Date(task.startDate) < new Date(endDate) && 
      new Date(task.endDate) > new Date(startDate)
    ); 
  };

  return (
    <Modal
      title="Ajouter une tâche"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
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

      <Input
        placeholder="Client *"
        value={newTask.client}
        onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
        style={{ marginBottom: 8 }}
      />

      {/* Sélection de l'adresse */}
      <Input
        placeholder="Adresse *"
        value={newTask.location}
        onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
        style={{ marginBottom: 8, width: "100%" }}
      />

      {/* Sélectionner un technicien */}
      <Select
        placeholder="Sélectionner un technicien *"
        onChange={(value) => {
          setNewTask({ ...newTask, technicien: value });
          setSelectedTechnicien(value);
        }}
        style={{ marginBottom: 8, width: "100%" }}
      >
        {sortedTechniciens.map(t => (
          <Option key={t._id} value={t._id}>
            {t.name} (Tâches: {calculateTaskCount(t._id)}, Localisation: {t.location})
          </Option>
        ))}
      </Select>

      {/* Sélectionner un véhicule */}
      <Select
        placeholder="Sélectionner un véhicule *"
        onChange={(value) => setNewTask({...newTask, vehicule: value})}
        style={{ marginBottom: 8, width: "100%" }}
      >
        {vehiculesList
          .filter(veh => veh.status === 'disponible')
          .map(veh => (
            <Option key={veh._id} value={veh._id}>
              {veh.model} ({veh.registration})
            </Option>
        ))}
      </Select>

      {/* Sélection de la plage horaire */}
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

      {/* Téléversement de fichiers */}
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />

      {/* Bouton pour ajouter la tâche */}
      <Button 
        type="primary" 
        onClick={handleAddTask}
        disabled={
          !newTask.title || 
          !newTask.description || 
          !newTask.technicien || 
          !newTask.vehicule || 
          !newTask.startDate || 
          !newTask.endDate ||
          !isTechnicienAvailable(newTask.technicien, newTask.startDate, newTask.endDate)
        }
        block
      >
        Ajouter
      </Button>

      {/* Affichage des détails du technicien sélectionné */}
      {selectedTechnicien && (
        <div style={{ marginBottom: 16 }}>
          <strong>Technicien sélectionné :</strong>
          <p>Nom: {techniciens.find(t => t._id === selectedTechnicien).name}</p>
          <p>Localisation: {techniciens.find(t => t._id === selectedTechnicien).location}</p>
          <p>Tâches planifiées et en cours: {calculateTaskCount(selectedTechnicien)}</p>
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;