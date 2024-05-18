import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import 'react-resizable/css/styles.css';
import { CloseOutlined } from '@mui/icons-material';

const Editor = () => {
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [styles, setStyles] = useState({});
  const [templates, setTemplates] = useState([]);

  const addElement = (type) => {
    const newElement = {
      id: elements.length,
      type,
      content: type === 'label' ? 'Label Element' : type === 'input' ? 'Input Element' : type === 'image' ? 'https://via.placeholder.com/150' : '',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      styles: {},
      zIndex: elements.length
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
            [property]: property === 'fontSize' || property === 'margin' || property === 'borderRadius' ? `${value}px` : value
          }
        };
      }
      return el;
    });
    setElements(newElements);
    setStyles(prevStyles => ({ ...prevStyles, [property]: property === 'fontSize' || property === 'margin' || property === 'borderRadius' ? `${value}px` : value }));
  };

  const handleContentChange = (content) => {
    const newElements = elements.map(el => {
      if (el.id === selectedElementId) {
        return { ...el, content };
      }
      return el;
    });
    setElements(newElements);
  };

  const bringForward = () => {
    if (selectedElementId !== null) {
      setElements((prevElements) => {
        const newElements = [...prevElements];
        const index = newElements.findIndex(el => el.id === selectedElementId);
        if (index>=0) {
          const temp = newElements[index];
          newElements[index]['zIndex'] = temp['zIndex']+1;
        }
        return newElements;
      });
    }
  };
  
  const sendBackward = () => {
    if (selectedElementId !== null) {
      setElements((prevElements) => {
        const newElements = [...prevElements];
        const index = newElements.findIndex(el => el.id === selectedElementId);
        if (index >= 0) {
          const temp = newElements[index];
          newElements[index]['zIndex'] = temp['zIndex'] -1;
        }
        return newElements;
      });
    }
  };
  

  const styleOptions = [
    { label: 'Background Color', property: 'backgroundColor', type: 'color' },
    { label: 'Font Size', property: 'fontSize', type: 'number' },
    { label: 'Text Color', property: 'color', type: 'color' },
    { label: 'Margin', property: 'margin', type: 'number' },
    { label: 'Border Radius', property: 'borderRadius', type: 'number' }
  ];

  const generateHTMLTemplate = () => {
    const htmlString = elements.map(el => {
      const style = Object.entries(el.styles).map(([key, value]) => `${key}: ${value}`).join('; ');
      const positionStyle = `position: absolute; left: ${el.position.x}px; top: ${el.position.y}px; width: ${el.size.width}px; height: ${el.size.height}px; z-index: ${el.zIndex};`;

      let elementHTML = '';
      switch (el.type) {
        case 'label':
          elementHTML = `<label style="${style}">${el.content}</label>`;
          break;
        case 'input':
          elementHTML = `<input type="text" placeholder="${el.content}" style="${style}" value="${el.content}" />`;
          break;
        case 'image':
          elementHTML = `<img src="${el.content}" alt="img" style="${style}" />`;
          break;
        case 'box':
          elementHTML = `<div style="${style}"></div>`;
          break;
        default:
          elementHTML = '';
      }

      return `<div style="${positionStyle}">${elementHTML}</div>`;
    }).join('');

    return htmlString;
  };

  const exportHTMLTemplate = () => {
    const htmlTemplate = generateHTMLTemplate();
    const htmlString = `<!DOCTYPE html><html><head><style>body {position: relative;}</style></head><body>${htmlTemplate}</body></html>`;
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveTemplate = () => {
    setTemplates([...templates, { id: templates.length, elements: JSON.parse(JSON.stringify(elements)) }]);
  };

  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setElements(JSON.parse(JSON.stringify(template.elements)));
    }
  };

  return (
    <>
    <div className="App h-100 w-100 d-flex align-items-center">
      <div className="toolbar d-flex flex-column gap-4">
        <button onClick={() => addElement('label')}>Add Label</button>
        <button onClick={() => addElement('input')}>Add Input</button>
        <button onClick={() => addElement('image')}>Add Image</button>
        <button onClick={() => addElement('box')}>Add Box</button>
        <button onClick={() => setElements([])}>Clear All</button>
        <button onClick={bringForward}>Bring Forward</button>
        <button onClick={sendBackward}>Send Backward</button>
        <button onClick={exportHTMLTemplate}>Export HTML Template</button>
        <button onClick={saveTemplate}>Save Template</button>
      </div>
      <div style={{ flex: 1 }}>
        <div className="workspace" style={{ scale: '2', width: '350px', height: '200px', position: 'relative', border: '1px solid black', margin: '0 auto' }}>
          {elements.map((el, index) => (
            <Draggable
              key={el.id}
              position={el.position}
              onStop={handleDrag(index)}
              bounds="parent"
              grid={[5, 5]}
            >
              <Resizable
                size={{ width: el.size.width, height: el.size.height }}
                onResizeStop={handleResize(index)}
                minWidth={50}
                minHeight={20}
                maxWidth={300}
                maxHeight={150}
                grid={[5, 5]}
                style={{
                  position: 'absolute',
                  border: '1px solid #ddd',
                  zIndex: el.zIndex,
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
                  value={parseInt(styles[option.property], 10) || ''}
                  onChange={(e) => handleStyleChange(option.property, e.target.value)}
                />
              )}
            </div>
          ))}
          {elements.find(el => el.id === selectedElementId)?.type !== 'image' && (
            <div className="style-option">
              <label>Content</label>
              <input
                type="text"
                value={elements.find(el => el.id === selectedElementId)?.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
 
    </div>
         <div className="template-list" style={{ marginLeft: '20px' }}>
         <h3>Saved Templates</h3>
         {templates.map(template => (
           <div key={template.id} className="template-item">
             <button onClick={() => loadTemplate(template.id)}>Load Template {template.id}</button>
           </div>
         ))}
       </div>
       </>
  );
};

export default Editor;
