import React from 'react';
import PropTypes from 'prop-types';

const TechnicienCircle = ({ technicien, onClick }) => {
  return (
    <div
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: technicien.status === 'active' ? '#007bff' : '#ccc',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '5px',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
      }}
      onClick={onClick}
    >
      {technicien.user.name}
    </div>
  );
};

TechnicienCircle.propTypes = {
  technicien: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['active', 'inactive']),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TechnicienCircle;
