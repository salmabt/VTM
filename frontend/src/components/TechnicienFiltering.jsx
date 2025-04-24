import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Progress, Button } from 'antd';
import { technicienRegions } from '../config/technicienRegions';
import '../styles/TechnicienFiltering.css';

const { Title, Text } = Typography;

const regionBackgrounds = {
  nord: '/images/nord_tunis.jpg',
  milieu: '/images/milieu_tunis.jpg',
  sahel: '/images/sahel_tunis.jpg',
  sud: '/images/sud_tunis.jpg'
};

const TechnicienFiltering = ({ techniciens }) => {
  const [expandedRegions, setExpandedRegions] = useState({
    nord: false,
    milieu: false,
    sahel: false,
    sud: false
  });

  const toggleRegion = (region) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  const columns = [
    {
      title: 'Nom & Prénom',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text className="tech-name">{text}</Text>,
      width: '30%'
    },
    {
      title: 'Ville',
      dataIndex: 'location',
      key: 'location',
      render: (location) => <Tag color="blue">{location}</Tag>,
      width: '20%'
    },
    {
      title: 'Compétences',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        <div className="skills-container">
          {skills?.map(skill => (
            <Tag key={skill} color="green" className="skill-tag">
              {skill}
            </Tag>
          ))}
        </div>
      ),
      width: '50%'
    },
  ];

  const filterTechniciensByRegion = (region) => {
    return techniciens.filter(tech => 
      technicienRegions[region].includes(tech.location)
    );
  };

  return (
    <div className="technicien-filtering-container">
      {['nord', 'milieu', 'sahel', 'sud'].map(region => {
        const techList = filterTechniciensByRegion(region);
        const techCount = techList.length;
        const percentage = Math.min((techCount / techniciens.length) * 100, 100);

        return (
          <div key={region} className={`region-card ${region}`}>
            <div className="background-image" style={{ backgroundImage: `url(${regionBackgrounds[region]})` }} />
            <div className="card-content">
              <div className="region-header">
                <Title level={3} className="region-title">
                  {region.toUpperCase()}
                </Title>
                {techCount > 0 && !expandedRegions[region] && (
                  <Button 
                    type="primary" 
                    onClick={() => toggleRegion(region)}
                    className="toggle-button"
                  >
                    Voir ({techCount})
                  </Button>
                )}
              </div>

              {expandedRegions[region] && (
                <div className="table-container">
                  <Table
                    dataSource={techList}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    className="techniciens-table"
                    scroll={{ y: 200 }}
                  />
                  <Button 
                    type="primary"
                    onClick={() => toggleRegion(region)}
                    className="toggle-button"
                  >
                    Masquer
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechnicienFiltering;