import React from 'react';
import { Card, List, Typography, Tag } from 'antd';
import { technicienRegions } from '../config/technicienRegions';

const { Title } = Typography;

const TechnicienFiltering = ({ techniciens }) => {
  const filterTechniciensByRegion = (region) => {
    return techniciens.filter(tech => 
      technicienRegions[region].includes(tech.location)
    );
  };

  return (
    <div className="technicien-filtering">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {Object.keys(technicienRegions).map(region => (
          <Card 
            key={region} 
            title={<Title level={4} style={{ textTransform: 'capitalize' }}>{region}</Title>}
            bordered={false}
          >
            <List
              dataSource={filterTechniciensByRegion(region)}
              renderItem={tech => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{tech.name}</span>
                      <Tag color="#108ee9">{tech.location}</Tag>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {tech.skills?.map(skill => (
                        <Tag key={skill} color="green">{skill}</Tag>
                      ))}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TechnicienFiltering;