import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import 'react-resizable/css/styles.css'; // Ensure you have the styles for Resizable
import { CloseOutlined } from '@mui/icons-material';

const Editor = () => {
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [styles, setStyles] = useState({});

  const addElement = (type) => {
    const newElement = {
      id: elements.length,
      type,
      content: type === 'label' ? 'Label Element' : type === 'input' ? 'Input Element' : type === 'image' ? 'https://via.placeholder.com/150' : '',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      styles: {}
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
      setStyles({});
    }
  };

  const handleDrag = (index) => (e, { x, y }) => {
    const newElements = [...elements];
    newElements[index].position = { x, y };
    setElements(newElements);
  };

  const handleResize = (index) => (e, direction, ref, delta) => {
    const newElements = [...elements];
    newElements[index].size = {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    };
    setElements(newElements);
  };

  const handleStyleChange = (property, value) => {
    const newElements = elements.map(el => {
      if (el.id === selectedElementId) {
        return {
          ...el,
          styles: {
            ...el.styles,
            [property]: value
          }
        };
      }
      return el;
    });
    setElements(newElements);
    setStyles(prevStyles => ({ ...prevStyles, [property]: value }));
  };

  const styleOptions = [
    { label: 'Background Color', property: 'backgroundColor', type: 'color' },
    { label: 'Font Size', property: 'fontSize', type: 'number' },
    { label: 'Text Color', property: 'color', type: 'color' },
    // Add more style options as needed
  ];

  return (
    <div className="App h-100 w-100 d-flex align-items-center">
      <div className="toolbar d-flex flex-column gap-4">
        <button onClick={() => addElement('label')}>Add Label</button>
        <button onClick={() => addElement('input')}>Add Input</button>
        <button onClick={() => addElement('image')}>Add Image</button>
        <button onClick={() => addElement('box')}>Add Box</button>
        <button onClick={() => setElements([])}>Clear All</button>
      </div>
      <div style={{ flex: 1 }}>
        <div className="workspace" style={{ scale: '2', width: '350px', height: '200px', position: 'relative', border: '1px solid black', margin: '0 auto' }}>
          {elements.map((el, index) => (
            <Draggable
              key={el.id}
              position={el.position}
              onStop={handleDrag(index)}
              bounds="parent"
              grid={[5, 5]} // Move in 5px increments to reduce sensitivity
            >
              <Resizable
                size={{ width: el.size.width, height: el.size.height }}
                onResizeStop={handleResize(index)}
                minWidth={50}
                minHeight={20}
                maxWidth={300}
                maxHeight={150}
                grid={[5, 5]} // Resize in 5px increments to reduce sensitivity
                style={{
                  position: 'absolute',
                  border: '1px solid #ddd',
                  ...el.styles
                }}
                onDoubleClick={() => {
                  setSelectedElementId(el.id);
                  setStyles(el.styles);
                }}
              >
                <div className={`element ${el.type}`} style={{ width: '100%', height: '100%' }}>
                  {el.type === 'label' && <label style={{ ...el.styles }}>{el.content}</label>}
                  {el.type === 'input' && <input type="text" placeholder={el.content} style={{ ...el.styles, width: '100%', height: '100%' }} />}
                  {el.type === 'image' && <img src={el.content} alt="img" style={{ width: '100%', height: '100%' }} />}
                  {el.type === 'box' && <div style={{ ...el.styles, width: '100%', height: '100%' }}></div>}
                  <CloseOutlined onClick={() => removeElement(el.id)} style={{ position: 'absolute', top: '5px', right: '5px' }} />
                </div>
              </Resizable>
            </Draggable>
          ))}
        </div>
      </div>
      {selectedElementId !== null && (
        <div className="style-panel" style={{ marginLeft: '20px' }}>
          <h3>Style Options</h3>
          {styleOptions.map(option => (
            <div key={option.property} className="style-option">
              <label>{option.label}</label>
              {option.type === 'color' ? (
                <input
                  type="color"
                  value={styles[option.property] || ''}
                  onChange={(e) => handleStyleChange(option.property, e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  value={styles[option.property] || ''}
                  onChange={(e) => handleStyleChange(option.property, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Editor;
