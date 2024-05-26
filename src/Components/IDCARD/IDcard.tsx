import React, { useState, useEffect } from 'react';

const IDcard = ({ layout, backgroundImage, elements, data ,isPreview=false }) => {
  const [workspaceDimensions, setWorkspaceDimensions] = useState({ width: 86, height: 54 });

  useEffect(() => {
    if (layout === 'Horizontal') {
      setWorkspaceDimensions({ width: 86, height: 54 });
    } else {
      setWorkspaceDimensions({ width: 54, height: 86 });
    }
  }, [layout]);

  const getContent = (el) => {
   if(!isPreview){ if (el.fieldMapping && data[el.fieldMapping]) {
      return data[el.fieldMapping];
    }}
    return el.content || '';
  };

  return (
    <div
      className="workspace"
      style={{
        width: `${workspaceDimensions.width}mm`,
        height: `${workspaceDimensions.height}mm`,
        position: 'relative',
        border: '1px solid black',
        margin: '0 auto',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {elements.map((el, index) => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: `${el.position.x}px`,
            top: `${el.position.y}px`,
            width: `${el.size.width}px`,
            height: `${el.size.height}px`,
            zIndex: el.zIndex,
            ...el.styles,
          }}
        >
          {el.type === 'label' && <label style={{ ...el.styles, whiteSpace: 'nowrap' }}>{getContent(el)}</label>}
          {el.type === 'input' && <input type="text" value={getContent(el)} style={{ ...el.styles, width: '100%', height: '100%' }} readOnly />}
          {el.type === 'image' && <img src={data.img} alt="img" style={{ width: '100%', height: '100%' }} />}
          {el.type === 'box' && <div style={{ ...el.styles, width: '100%', height: '100%' }}></div>}
        </div>
      ))}
    </div>
  );
};

export default IDcard;
