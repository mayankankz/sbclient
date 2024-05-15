import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Ensure you have the styles for Resizable


const Editor = () => {
  const [elements, setElements] = useState([]);

  const addElement = (type) => {
    const newElement = {
      id: elements.length,
      type,
      content: type === 'text' ? 'Text Element' : type === 'button' ? 'Button' : type === 'image' ? 'https://via.placeholder.com/150' : '',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 200 },
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleResize = (index) => (e, { size }) => {
    const newElements = [...elements];
    newElements[index].size = size;
    setElements(newElements);
  };

  const handleDrag = (index) => (e, { deltaX, deltaY }) => {
    const newElements = [...elements];
    newElements[index].position = {
      x: newElements[index].position.x + deltaX,
      y: newElements[index].position.y + deltaY,
    };
    setElements(newElements);
  };

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={() => addElement('text')}>Add Text</button>
        <button onClick={() => addElement('button')}>Add Button</button>
        <button onClick={() => addElement('image')}>Add Image</button>
        <button onClick={() => addElement('box')}>Add Box</button>
        <button onClick={() => setElements([])}>Clear All</button>
      </div>
      <div className="workspace">
        {elements.map((el, index) => (
          <Draggable
            key={el.id}
            position={el.position}
            onStop={handleDrag(index)}
          >
            <Resizable
              width={el.size.width}
              height={el.size.height}
              onResize={handleResize(index)}
            >
              <div className={`element ${el.type}`} style={{ width: el.size.width, height: el.size.height }}>
                {el.type === 'text' && el.content}
                {el.type === 'button' && <button>{el.content}</button>}
                {el.type === 'image' && <img src={el.content} alt="img" />}
              </div>
            </Resizable>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default Editor;
