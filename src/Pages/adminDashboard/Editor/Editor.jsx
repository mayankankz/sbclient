import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import 'react-resizable/css/styles.css'; // Ensure you have the styles for Resizable
import { CloseOutlined } from '@mui/icons-material';

const Editor = () => {
  const [elements, setElements] = useState([]);

  const addElement = (type) => {
    const newElement = {
      id: elements.length,
      type,
      content: type === 'text' ? 'Text Element' : type === 'button' ? 'Button' : type === 'image' ? 'https://via.placeholder.com/150' : '',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
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

  return (
    <div className="App h-100 w-100 d-flex align-items-center">
      <div className="toolbar d-flex flex-column gap-4">
        <button onClick={() => addElement('text')}>Add Text</button>
        <button onClick={() => addElement('button')}>Add Button</button>
        <button onClick={() => addElement('image')}>Add Image</button>
        <button onClick={() => setElements([])}>Clear All</button>
      </div>
     <div style={{flex: 1}}>
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
             background: '#f0f0f0',
           }}
         >
           <div className={`element ${el.type}`} style={{ width: '100%', height: '100%' }}>
             {el.type === 'text' && el.content}
             {el.type === 'button' && <button>{el.content}</button>}
             {el.type === 'image' && <img src={el.content} alt="img" style={{ width: '100%', height: '100%' }} />}
             
             <CloseOutlined onClick={() => removeElement(el.id)} style={{ position: 'absolute', top: '5px', right: '5px' }}/>
             </div>
         </Resizable>
       </Draggable>
     ))}
   </div>
     </div>
    </div>
  );
};

export default Editor;
