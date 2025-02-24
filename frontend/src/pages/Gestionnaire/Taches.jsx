import React, { useState } from 'react';
import { Table, Tag, Space, Select, DatePicker, Button, Input } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Taches = ({ tasks = [], setTasks, techniciens = [], vehicules = [] }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    technicien: '',
    vehicule: '',
    startDate: '',
    endDate: '',
    status: 'planifié',
  });

  const addTask = () => {
    if (!newTask.title || !newTask.technicien || !newTask.vehicule || !newTask.startDate || !newTask.endDate) {
      return alert('Veuillez remplir tous les champs obligatoires.');
    }
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
    setNewTask({ title: '', description: '', technicien: '', vehicule: '', startDate: '', endDate: '', status: 'planifié' });
  };

  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Technicien',
      dataIndex: 'technicien',
      key: 'technicien',
      render: (id) => techniciens.find(t => t._id === id)?.name || 'Non attribué'
    },
    {
      title: 'Véhicule',
      dataIndex: 'vehicule',
      key: 'vehicule',
      render: (id) => vehicules.find(v => v._id === id)?.model || 'Non attribué'
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'planifié' ? 'blue' : 'green'}>{status}</Tag>
    }
  ];

  return (
    <div>
      <h2>Gestion des Tâches</h2>
      <Input
        placeholder="Titre *"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <Input
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <Select
        placeholder="Sélectionner un technicien *"
        options={techniciens.map(t => ({ label: t.name, value: t._id }))}
        onChange={(value) => setNewTask({ ...newTask, technicien: value })}
      />
      <Select
        placeholder="Sélectionner un véhicule *"
        options={vehicules.map(v => ({ label: `${v.model} (${v.registration})`, value: v._id }))}
        onChange={(value) => setNewTask({ ...newTask, vehicule: value })}
      />
      <RangePicker
        onChange={(dates) => {
          if (dates && dates.length === 2) {
            setNewTask({
              ...newTask,
              startDate: dates[0].toISOString(),
              endDate: dates[1].toISOString()
            });
          }
        }}
      />
      <Button type="primary" onClick={addTask}>Ajouter Tâche</Button>
      <Table dataSource={tasks} columns={columns} rowKey="id" />
    </div>
  );
};

export default Taches;