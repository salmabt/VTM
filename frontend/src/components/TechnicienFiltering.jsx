import React from 'react';
import { Card, Table, Tag, Typography, Progress } from 'antd';
import { technicienRegions } from '../config/technicienRegions';
import '../styles/TechnicienFiltering.css';

const { Title } = Typography;

// Définition des backgrounds pour chaque région
const regionBackgrounds = {
  nord: '/images/nord_tunis.jpg',
  milieu: '/images/milieu_tunis.jpg',
  sahel: '/images/sahel_tunis.jpg',
  sud: '/images/sud_tunis.jpg'
};

const TechnicienFiltering = ({ techniciens }) => {
  const columns = [
    {
      title: 'Nom & Prénom',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <span>{record.name}</span>,
    },
    {
      title: 'Ville',
      dataIndex: 'location',
      key: 'location',
      render: (location) => <Tag color="blue">{location}</Tag>,
    },
    {
      title: 'Compétences',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => skills?.map(skill => <Tag key={skill} color="green">{skill}</Tag>),
    },
  ];

  const filterTechniciensByRegion = (region) => {
    return techniciens.filter(tech =>
      technicienRegions[region].includes(tech.location)
    );
  };

  return (
    <div className="technicien-filtering">
      <div className="technicien-grid">
        {['nord', 'milieu', 'sahel', 'sud'].map(region => {
          const techList = filterTechniciensByRegion(region);
          const techCount = techList.length;

          return (
            <Card
              key={region}
              className={`technicien-card ${region}`} // Ajout d'une classe pour le style
              bordered={false}
            >
              {/* Background Image */}
              <div className="background-image" style={{ backgroundImage: `url(${regionBackgrounds[region]})` }} />

              {/* Content */}
              <div className="content">
                <Title level={4} className="region-title">{region}</Title>

                {/* Circular Statistics */}
                <div className="progress-container">
                  <Progress
                    type="circle"
                    percent={Math.min((techCount / techniciens.length) * 100, 100)}
                    format={() => `${techCount}`}
                    strokeColor="#ffcc00" /* Change color for visibility */
                    strokeWidth={12} /* Increase thickness */
                    size={90} /* Increase size */
                  />
                </div>

                {/* Table for Technicians */}
                <Table
                  dataSource={techList}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TechnicienFiltering;
