import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Button } from "antd";
import tasksApi from "../api/tasks"; // Importez votre API
import { technicienRegions, allCities } from "../config/technicienRegions";

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
  const [selectedCity, setSelectedCity] = useState(null); // Nouvel état
  const [selectedRegion, setSelectedRegion] = useState(null);

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

  // Vérifier la disponibilité du technicien
  const isTechnicienAvailable = (technicienId, startDate, endDate) => {
    const technicien = techniciens.find(t => t._id === technicienId);
    if (!technicien || !technicien.schedule) return true; // Si le technicien ou son emploi du temps n'existe pas, considérez-le comme disponible
    return !technicien.schedule.some(task => 
      new Date(task.startDate) < new Date(endDate) && 
      new Date(task.endDate) > new Date(startDate)
    ); 
  };

  // Fonction qui retourne la région basée sur la ville
  const getRegionFromCity = (city) => {
    for (const region in technicienRegions) {
      if (technicienRegions[region].includes(city)) {
        return region; // Retourne la région (par exemple, 'milieu', 'nord', etc.)
      }
    }
    return null;
  };

  const filteredTechniciens = selectedRegion 
    ? techniciens.filter(tech => technicienRegions[selectedRegion].includes(tech.location))
    : techniciens;

  // Déclarer sortedTechniciens à l'extérieur de useEffect pour éviter la redéclaration
  const sortedTechniciens = [...filteredTechniciens].sort((a, b) => 
    calculateTaskCount(a._id) - calculateTaskCount(b._id)
  );

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
        placeholder="Nom du Client(son numéro du télèphone) *"
        value={newTask.client}
        onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
        style={{ marginBottom: 8 }}
      />

      <Select
        placeholder="Sélectionner une gouvernorat *"
        onChange={(value) => {
          console.log("Gouvernorat sélectionnée:", value);
          setSelectedCity(value);
          const region = getRegionFromCity(value);
          setSelectedRegion(region); // Définir la région basée sur la ville sélectionnée
          setNewTask({ ...newTask, location: value });
        }}
        style={{ marginBottom: 8, width: "100%" }}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {allCities.map(city => (
          <Option key={city} value={city}>
            {city}
          </Option>
        ))}
      </Select>

      {/* Sélection de l'adresse */}
      <Input
  placeholder="Adresse détaillée *"
  value={newTask.adresse}
  onChange={(e) => setNewTask({ ...newTask, adresse: e.target.value })}
/>


      {/* Sélectionner un technicien */}
      <Select
        placeholder="Sélectionner un technicien *"
        onChange={(value) => {
          setNewTask({ ...newTask, technicien: value });
          setSelectedTechnicien(value);
        }}
        style={{ marginBottom: 8, width: "100%" }}
        disabled={!selectedCity} // Désactivé tant qu'une ville n'est pas sélectionnée
      >
        {sortedTechniciens.map(t => (
          <Option key={t._id} value={t._id}>
            {t.name} ( {t.location},Tâches: {calculateTaskCount(t._id)})
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
