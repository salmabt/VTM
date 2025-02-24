//pages/gestionnaire/report
import React from 'react';
import { Card, List, Typography } from 'antd';

const { Text } = Typography;

const Rapports = ({ tasks }) => (
  <Card title="Rapports d'intervention" bordered={false}>
    <List
      dataSource={tasks.filter(t => t.report)}
      renderItem={task => (
        <List.Item>
          <List.Item.Meta
            title={task.title}
            description={
              <div>
                <Text strong>Technicien: </Text>
                <Text>{task.technicien?.user?.name || 'Non assigné'}</Text><br />
                <Text strong>Durée: </Text>
                <Text>{task.report?.timeSpent}h</Text><br />
                <Text strong>Résolution: </Text>
                <Text>{task.report?.resolution}</Text>
              </div>
            }
          />
        </List.Item>
      )}
    />
  </Card>
);

export default Rapports;