import React from 'react';

const StatCard = ({ title, value, backgroundColor = '#FFFFFF' }) => {
  // Determine text color based on background
  const isRedBackground = backgroundColor !== '#FFFFFF';
  const textColor = isRedBackground ? '#FFFFFF' : '#374151';

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        backgroundColor,
      }}
    >
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '500', 
        color: textColor, 
        marginBottom: '8px' 
      }}>
        {title}
      </h3>
      <p style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: textColor 
      }}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;