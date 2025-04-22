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
  const [expandedRegions, setExpandedRegions] = useState({});

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
      render: (skills) => (
        <div className="skills-container">
          {skills?.map(skill => (
            <Tag key={skill} color="green" className="skill-tag">
              {skill}
            </Tag>
          ))}
        </div>
      ),
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
                <Progress
                  type="circle"
                  percent={percentage}
                  format={() => (
                    <Text strong className="progress-text">
                      {techCount}
                    </Text>
                  )}
                  width={80}
                  strokeColor="#ffcc00"
                  trailColor="rgba(255,255,255,0.3)"
                />
              </div>

              {expandedRegions[region] ? (
                <Table
                  dataSource={techList}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  className="techniciens-table"
                />
              ) : (
                <Button 
                  type="primary" 
                  onClick={() => toggleRegion(region)}
                  style={{ 
                    marginTop: 16,
                    width: '100%',
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff'
                  }}
                >
                  Voir les {techCount} techniciens
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechnicienFiltering;