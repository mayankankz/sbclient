// GuideLines.js
import React from 'react';

const GuideLines = ({ lines, containerSize }) => {
  return (
    <>
      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: line.type === 'vertical' ? `${line.position}px` : '0',
            top: line.type === 'horizontal' ? `${line.position}px` : '0',
            width: line.type === 'vertical' ? '1px' : `${containerSize.width}px`,
            height: line.type === 'horizontal' ? '1px' : `${containerSize.height}px`,
            backgroundColor: 'red',
           
            zIndex: 9999,
            display: 'none',
          }}
        ></div>
      ))}
    </>
  );
};

export default GuideLines;
