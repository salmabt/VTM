//pages/gestionnaire/calendrier
import React, { useState } from 'react'; // Correction ici
import { Card } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TechniciensSection from '../../components/TechniciensSection';
import TaskModal from '../../components/TaskModal';

const localizer = momentLocalizer(moment);

const Calendrier = ({ 
  techniciens, 
  tasks, 
  vehicules,
  selectedTech,
  setSelectedTech,
  techTasks,
  setTechTasks,
  assignedVehicles,
  setAssignedVehicles 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    client: '',
    location: '',
    startDate: null,
    endDate: null,
    technicien: '',
    vehicule: '',
    status: 'planifié'
  });

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#f0f0f',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '4px',
    },
  });

  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      <div>{event.resource.technicien?.name || 'Non assigné'}</div>
    </div>
  );

  return (
    <Card title="Calendrier des interventions" bordered={false}>
      <TechniciensSection 
        techniciens={techniciens}
        tasks={tasks}
        vehicules={vehicules}
        selectedTech={selectedTech}
        onTechSelect={setSelectedTech}  // ✅ Correct
        techTasks={techTasks}
        onTasksUpdate={setTechTasks}    // ✅ Correction : passer la fonction
        assignedVehicles={assignedVehicles}
        onVehiclesUpdate={setAssignedVehicles}  
      />
      
      <Calendar
        localizer={localizer}
        events={tasks.map(task => {
          const tech = techniciens.find(t => t._id === task.technicien);
          const veh = vehicules.find(v => v._id === task.vehicule);
          return {
            title: `${task.title} - ${tech?.name || 'Non assigné'}`,
            start: new Date(task.startDate),
            end: new Date(task.endDate),
            allDay: false,
            resource: { ...task, technicien: tech, vehicule: veh }
          };
        })}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={(slotInfo) => {
          setSelectedDate(slotInfo.start);
          setNewTask({ ...newTask, startDate: slotInfo.start });
          setIsModalVisible(true);
        }}
        eventPropGetter={eventStyleGetter}
        components={{ event: CustomEvent }}
      />
      
      <TaskModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        newTask={newTask}
        setNewTask={setNewTask}
        techniciens={techniciens}
        vehiculesList={vehicules}
      />
    </Card>
  );
};

export default Calendrier;