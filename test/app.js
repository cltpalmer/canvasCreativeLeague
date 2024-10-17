const { useEffect, useRef, useState } = React;

function CanvasApp() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [objectCount, setObjectCount] = useState(0);
  const [isObjectSelected, setIsObjectSelected] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });
  const [isColumnVisible, setIsColumnVisible] = useState(false); // To track column visibility
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [cornerRadius, setCornerRadius] = useState(0);  // Track the corner radius
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false); // New state to track color picker visibility
  const [bgColor, setBgColor] = useState('#ffffff'); // New state for background color
  const [objectColor, setObjectColor] = useState('#FF6F61'); // Default color
  const [isObjectColorPickerVisible, setIsObjectColorPickerVisible] = useState(false); //for picker to go away
  const [isPopupVisible, setIsPopupVisible] = useState(false); // New state to track popup visibility
  const [isShadowSliderVisible, setIsShadowSliderVisible] = useState(false);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);
  const [isOpacitySliderVisible, setIsOpacitySliderVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isAssetLibraryVisible, setIsAssetLibraryVisible] = useState(false);
  const [isButtonContainerVisible, setIsButtonContainerVisible] = useState(true);


  const fileInputRef = useRef(null); // Ref for the hidden file input


  // Define your SVG library directly in the component
  const svgLibrary = [
    { name: 'Search Asset', type: 'svg', url: 'assets/searchAsset.svg' },
    { name: 'Upload Asset', type: 'svg', url: 'assets/uploadAsset.svg' },
    { name: 'Rounded Asset', type: 'svg', url: 'assets/roundedAsset.svg' },
    { name: 'Notif Asset', type: 'svg', url: 'assets/notifAsset.svg' },
    { name: 'Send Asset', type: 'svg', url: 'assets/sendAsset.svg' },
    { name: 'Home Asset', type: 'svg', url: 'assets/homeAsset.svg' },
    { name: 'Menu Asset', type: 'svg', url: 'assets/menuAsset.svg' },
    { name: 'Profile Asset', type: 'svg', url: 'assets/profileAsset.svg' },
    { name: 'xClose Asset', type: 'svg', url: 'assets/xCloseAsset.svg' },
    { name: 'xClose Asset', type: 'svg', url: 'assets/xCloseAsset.svg' },
    { name: 'xClose Asset', type: 'svg', url: 'assets/xCloseAsset.svg' },
    { name: 'xClose Asset', type: 'svg', url: 'assets/xCloseAsset.svg' },
    { name: 'xClose Asset', type: 'svg', url: 'assets/xCloseAsset.svg' },
    // Add more SVG assets as needed
  ];

  const assetLibrary = [
    { name: 'Square', type: 'rect', width: 100, height: 100, fill: '#FF6F61' },
    { name: 'Circle', type: 'circle', radius: 50, fill: '#61ff6f' },
    // You can add more assets here
  ];

  

const toggleShadowSlider = () => {
  setIsShadowSliderVisible(!isShadowSliderVisible);
};

const handleShadowBlurChange = (event) => {
  const newBlur = parseInt(event.target.value);
  setShadowBlur(newBlur);
  if (selectedObject) {
    selectedObject.set('shadow', new fabric.Shadow({
      blur: newBlur,
      offsetX: shadowOffsetX,
      offsetY: shadowOffsetY,
      color: 'rgba(0,0,0,0.5)'
    }));
    fabricCanvas.current.renderAll();
  }
};

const handleShadowOffsetXChange = (event) => {
  const newOffsetX = parseInt(event.target.value);
  setShadowOffsetX(newOffsetX);
  if (selectedObject) {
    selectedObject.set('shadow', new fabric.Shadow({
      blur: shadowBlur,
      offsetX: newOffsetX,
      offsetY: shadowOffsetY,
      color: 'rgba(0,0,0,0.5)'
    }));
    fabricCanvas.current.renderAll();
  }
};

const handleShadowOffsetYChange = (event) => {
  const newOffsetY = parseInt(event.target.value);
  setShadowOffsetY(newOffsetY);
  if (selectedObject) {
    selectedObject.set('shadow', new fabric.Shadow({
      blur: shadowBlur,
      offsetX: shadowOffsetX,
      offsetY: newOffsetY,
      color: 'rgba(0,0,0,0.5)'
    }));
    fabricCanvas.current.renderAll();
  }
};

const toggleOpacitySlider = () => {
  setIsOpacitySliderVisible(!isOpacitySliderVisible);
};

const handleOpacityChange = (event) => {
  const newOpacity = parseFloat(event.target.value);
  setOpacity(newOpacity);
  if (selectedObject) {
    selectedObject.set('opacity', newOpacity);
    fabricCanvas.current.renderAll();
    }
  };

  const toggleSlider = () => {
    setIsSliderVisible(!isSliderVisible);
  };

  const handleObjectColorChange = (newColor) => { 
    setObjectColor(newColor);
    
    if (selectedObject) {
      selectedObject.set({ fill: newColor });
      fabricCanvas.current.renderAll();
    }
  };
  

  const toggleColorPicker = () => {
    setIsColorPickerVisible(!isColorPickerVisible);
  };

  const toggleObjectColorPicker = () => {
    setIsObjectColorPickerVisible(!isObjectColorPickerVisible);
    // Removed the click trigger as Pickr manages its own UI
  };
  

// Toggle for Asset Library Popup
const togglePopup = () => {
  setIsPopupVisible(!isPopupVisible); // Toggle popup visibility
  };

// Toggle for Full Asset Library Overlay
const toggleAssetLibraryOverlay = () => {
  setIsAssetLibraryVisible(!isAssetLibraryVisible); // Toggle visibility for the overlay
  setIsPopupVisible(false); // Ensure the popup is always hidden when overlay is opened
};

  // Add this function inside your CanvasApp component, above the return statement

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        // Set image properties
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5, // Adjust as needed
          scaleY: 0.5,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });

        // Add image to canvas
        fabricCanvas.current.add(img);
        fabricCanvas.current.setActiveObject(img);
        fabricCanvas.current.renderAll();

        // Update object count
        setObjectCount((prevCount) => prevCount + 1);
      });
    };
    reader.readAsDataURL(file);
  }
};


  const handleRadiusChange = (event) => { 
    let newRadius = parseFloat(event.target.value);
    
    if (isNaN(newRadius)) {
        newRadius = 0;
    }

    if (selectedObject && selectedObject.type === 'rect') {
        const maxRadius = Math.min(selectedObject.width, selectedObject.height) / 2;
        newRadius = Math.min(newRadius, maxRadius);
        
        setCornerRadius(newRadius);  
        
        selectedObject.set({ rx: newRadius, ry: newRadius });
        
        fabricCanvas.current.renderAll();  
    }
  };

  const toggleColumn = () => {
    setIsColumnVisible(!isColumnVisible);  // Toggle the visibility of the column
  };

  // Handle background color change
  const handleBgColorChange = (event) => {
    const newColor = event.target.value;
    setBgColor(newColor);
    fabricCanvas.current.setBackgroundColor(newColor, fabricCanvas.current.renderAll.bind(fabricCanvas.current));
  };

  useEffect(() => {
    
    fabricCanvas.current = new fabric.Canvas('fabric-canvas', {
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
      selection: true,
      preserveObjectStacking: true, // Prevents selected objects from auto-moving to front
      controlsAboveOverlay: false,  // Ensures controls follow stacking order
    });

     // Expose the fabricCanvas globally
  window.fabricCanvas = fabricCanvas.current;

    fabricCanvas.current.on('object:rotating', function(e) {
      const obj = e.target;
      
      // Make sure the rotation is applied properly
      obj.setCoords(); // Recalculate coordinates after the transformation
      fabricCanvas.current.renderAll(); // Re-render the canvas to reflect the new state
    });
    
        
const onSelection = () => {
  const activeObject = fabricCanvas.current.getActiveObject();
  if (activeObject) {
    setSelectedObject(activeObject);
    window.selectedObject = activeObject; // Expose globally
    setIsObjectSelected(true);
    
        // Check if the selected object is a rectangle and adjust corner radius
        if (activeObject.get('type') === 'rect') {
          setCornerRadius(activeObject.get('rx') || 0);
        }
    
// Remove this block:
/*
if (activeObject.get('type') === 'i-text') {
  const selectedFont = 'SomeDefaultFont'; // This should be dynamic based on your selection
  activeObject.set({ fontFamily: selectedFont });
  fabricCanvas.current.renderAll();
}
*/


    
        const objectBounds = activeObject.getBoundingRect();
        setPopupPosition({
          left: objectBounds.left + objectBounds.width / 2, // Centered
          top: objectBounds.top - 120, // Adjust as needed
        });
    
        // Update popup position on both moving and scaling
        activeObject.on('moving', () => {
          const newBounds = activeObject.getBoundingRect();
          setPopupPosition({
            left: newBounds.left + newBounds.width / 2, // Centered
            top: newBounds.top - 120, // Adjust as needed
          });
        });
    
        activeObject.on('scaling', () => {
          const newBounds = activeObject.getBoundingRect();
          setPopupPosition({
            left: newBounds.left + newBounds.width / 2, // Centered
            top: newBounds.top - 120, // Adjust as needed
          });
        });
      }
    };
    
        

    const onSelectionCleared = () => {
      setSelectedObject(null);
      window.selectedObject = null; // Reset global variable
      setIsObjectSelected(false);
      setIsColumnVisible(false);
      setIsSliderVisible(false); // Hide radius slider
      setIsColorPickerVisible(false); // Hide color picker
      setIsPopupVisible(false);
      setIsObjectColorPickerVisible(false); // Hide object color picker
      setIsShadowSliderVisible(false); // Hide shadow slider
      setIsOpacitySliderVisible(false); // Hide opacity slider
    };
    

    fabricCanvas.current.on('selection:created', onSelection);
    fabricCanvas.current.on('selection:updated', onSelection);
    fabricCanvas.current.on('selection:cleared', onSelectionCleared);



    return () => {
      fabricCanvas.current.off('selection:created', onSelection);
      fabricCanvas.current.off('selection:updated', onSelection);
      fabricCanvas.current.off('selection:cleared', onSelectionCleared);
      // Cleanup event listeners on unmount
      fabricCanvas.current.off('object:moving');
      fabricCanvas.current.off('object:modified');
    };
  }, []);

  const addAssetToCanvas = (asset) => {
    console.log('addAssetToCanvas called with:', asset); // Debugging log
  
    if (!asset) {
      console.error('No asset provided to addAssetToCanvas');
      return;
    }
  
    if (asset.type === 'svg') {
      fabric.loadSVGFromURL(asset.url, (objects, options) => {
        const svg = fabric.util.groupSVGElements(objects, options);
        svg.set({
          left: 150,
          top: 100,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          scaleX: .75,
          scaleY: .75,
        });
  
        fabricCanvas.current.add(svg); // Add the SVG to the canvas
        fabricCanvas.current.setActiveObject(svg); // Set the newly added SVG as the active object
        fabricCanvas.current.renderAll(); // Render the changes
  
        // Close the popup after adding the SVG
        togglePopup(); // Hides the small popup
        setIsAssetLibraryVisible(false); // Hides the large asset library
      });
      return; // Exit early since SVG is handled asynchronously
    }
  
    // Handle other asset types (rect, circle, triangle)
    let newObject;
    if (asset.type === 'rect') {
      newObject = new fabric.Rect({
        left: 100,
        top: 100,
        width: asset.width,
        height: asset.height,
        fill: asset.fill,
        rx: asset.rx || 10, // Rounded corners if provided
        ry: asset.ry || 10,
      });
    } else if (asset.type === 'circle') {
      newObject = new fabric.Circle({
        left: 100,
        top: 100,
        radius: asset.radius,
        fill: asset.fill,
      });
    } else if (asset.type === 'triangle') {
      newObject = new fabric.Triangle({
        left: 100,
        top: 100,
        width: asset.width,
        height: asset.height,
        fill: asset.fill,
      });
    }
  
    if (newObject) {
      newObject.set({
        borderColor: '#ff402e',
        cornerColor: '#2d2d2d',
        cornerSize: 14,
        transparentCorners: false,
        borderScaleFactor: 2,
        cornerStyle: 'circle',
      });
  
      fabricCanvas.current.add(newObject); // Add the object to the canvas
      fabricCanvas.current.setActiveObject(newObject); // Set the new object as active
      fabricCanvas.current.renderAll(); // Render the changes
  
      // Close the popup after adding the object
      togglePopup(); // Hides the small popup
      setIsAssetLibraryVisible(false); // Hides the large asset library
    }
  };
  
  const addText = () => {
    const left = Math.random() * (fabricCanvas.current.getWidth() - 200);
    const top = Math.random() * (fabricCanvas.current.getHeight() - 50);
    const text = new fabric.IText('Edit me!', {
      left,
      top,
      fontFamily: 'Arial',
      fill: '#000000',
      fontSize: 24,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      editable: true,
    });
  
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
    fabricCanvas.current.renderAll();
    setObjectCount(prevCount => prevCount + 1);
  };

  const deleteElement = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      if (window.confirm('Are you sure you want to delete the selected element?')) {
        // Add the poof animation (scale down and fade out)
        activeObject.animate('scaleX', 0, {
          duration: 500,
          onChange: fabricCanvas.current.renderAll.bind(fabricCanvas.current),
          easing: fabric.util.ease.easeOutQuad,
        });
  
        activeObject.animate('scaleY', 0, {
          duration: 500,
          onChange: fabricCanvas.current.renderAll.bind(fabricCanvas.current),
          easing: fabric.util.ease.easeOutQuad,
        });
  
        activeObject.animate('opacity', 0, {
          duration: 500,
          onChange: fabricCanvas.current.renderAll.bind(fabricCanvas.current),
          easing: fabric.util.ease.easeOutQuad,
          onComplete: () => {
            // Remove the object from the canvas after the animation
            fabricCanvas.current.remove(activeObject);
            fabricCanvas.current.discardActiveObject();
            fabricCanvas.current.renderAll();
            setObjectCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
          },
        });
      }
    } else {
      alert('Please select an object to delete.');
    }
  };
  

  let animationTimeout = null;

  function pulseLayer(object) {
    if (!object) return;
  
    // Clear any existing animation timeout
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
  
    // Store the original scales
    const originalScaleX = object.scaleX;
    const originalScaleY = object.scaleY;
  
    // Calculate target scales (10% increase)
    const targetScaleX = originalScaleX * 1.1;
    const targetScaleY = originalScaleY * 1.1;
  
    // Animate scale up
    object.animate({
      scaleX: targetScaleX,
      scaleY: targetScaleY
    }, {
      duration: 100,
      onChange: fabricCanvas.current.requestRenderAll.bind(fabricCanvas.current),
      onComplete: () => {
        // Animate scale back to original
        object.animate({
          scaleX: originalScaleX,
          scaleY: originalScaleY
        }, {
          duration: 100,
          onChange: fabricCanvas.current.requestRenderAll.bind(fabricCanvas.current),
          onComplete: () => {
            object.setCoords();
            fabricCanvas.current.requestRenderAll();
          }
        });
      }
    });
  
    // Set a timeout to prevent rapid triggering
    animationTimeout = setTimeout(() => {
      animationTimeout = null;
    }, 250); // Adjust this value as needed
  }

  const handleMoveLayerUp = () => {
    if (selectedObject && !animationTimeout) {
      const objects = fabricCanvas.current.getObjects();
      const index = objects.indexOf(selectedObject);
      if (index < objects.length - 1) {
        fabricCanvas.current.bringForward(selectedObject);
        selectedObject.setCoords();
        fabricCanvas.current.requestRenderAll();
        fabricCanvas.current.fire('object:modified', { target: selectedObject });
        fabricCanvas.current.setActiveObject(selectedObject);
        pulseLayer(selectedObject);
      } else {
        alert('Object is already at the top layer.');
      }
    } else if (!selectedObject) {
      alert('Please select an object to move.');
    }
  };
  
  const handleMoveLayerDown = () => {
    if (selectedObject && !animationTimeout) {
      const objects = fabricCanvas.current.getObjects();
      const index = objects.indexOf(selectedObject);
      if (index > 0) {
        fabricCanvas.current.sendBackwards(selectedObject);
        selectedObject.setCoords();
        fabricCanvas.current.requestRenderAll();
        fabricCanvas.current.fire('object:modified', { target: selectedObject });
        fabricCanvas.current.setActiveObject(selectedObject);
        pulseLayer(selectedObject);
      } else {
        alert('Object is already at the bottom layer.');
      }
    } else if (!selectedObject) {
      alert('Please select an object to move.');
    }
  };



  
// Function to check if the object is at the top
const isAtTop = () => {
  if (!selectedObject) return false;
  const index = fabricCanvas.current.getObjects().indexOf(selectedObject);
  return index === fabricCanvas.current.getObjects().length - 1;
};

// Function to check if the object is at the bottom
const isAtBottom = () => {
  if (!selectedObject) return false;
  const index = fabricCanvas.current.getObjects().indexOf(selectedObject);
  return index === 0;
};




  // Duplicate function remains unchanged
  const duplicateElement = () => {
    const activeObject = fabricCanvas.current.getActiveObject();
    if (activeObject) {
      activeObject.clone((clonedObject) => {
        clonedObject.set({
          left: activeObject.left + 20,
          top: activeObject.top + 20,
          borderColor: '#ff402e',
          cornerColor: '#2d2d2d',
          cornerSize: 14,
          transparentCorners: false,
          borderScaleFactor: 2,
          cornerStyle: 'circle',
        });
        fabricCanvas.current.add(clonedObject);
        fabricCanvas.current.setActiveObject(clonedObject);
        fabricCanvas.current.renderAll();
        setObjectCount((prevCount) => prevCount + 1);
      });
    } else {
      alert('Please select an object to duplicate.');
    }
  };
  
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center' }}>
       {/* Add the hidden file input here */}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleImageUpload}
    />
      <div className="canvas-container" style={{ position: 'relative' }}> {/* Added position relative here */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} id="fabric-canvas"></canvas>
  
          {isObjectSelected && (
  <div 
    className="popup-container" 
    style={{
      left: `${popupPosition.left}px`, 
      top: `${popupPosition.top}px`,
      position: 'absolute',
      transform: 'translateX(-50%)', // Center the popup
      zIndex: 999, // Ensure it appears above the canvas
    }}
  >
    {/* Container for all buttons aligned horizontally */}
    <div className="popup-buttons">
      <button className="popup-button" onClick={toggleColumn}>
        <img src="assets/edit.svg" alt="Edit" />
      </button>
      <button className="popup-button" onClick={duplicateElement}>
        <img src="assets/duplicate.svg" alt="Duplicate" />
      </button>
      <button 
        className="popup-button" 
        onClick={handleMoveLayerUp} 
        disabled={isAtTop()}
      >
        <img src="assets/arrowUp.svg" alt="Move Up" />
      </button>
      <button 
        className="popup-button" 
        onClick={handleMoveLayerDown} 
        disabled={isAtBottom()}
      >
        <img src="assets/arrowDown.svg" alt="Move Down" />
      </button>
    </div>
  </div>
)}


  
<div className={`column-container ${isColumnVisible ? 'visible' : ''}`}>
  
  {/* Radius (Only for Rectangles) */}
  {selectedObject && selectedObject.type === 'rect' && (
    <>
      <button className="toggle-slider-button" onClick={toggleSlider}>Radius</button>
      {isSliderVisible && (
        <input 
          type="range" 
          min="0" 
          max={Math.min(selectedObject.width, selectedObject.height) / 2} 
          value={cornerRadius} 
          onChange={handleRadiusChange} 
        />
      )}
    </>
  )}

  {/* Background Color (For all elements) */}
  <button className="toggle-slider-button" onClick={toggleColorPicker}>Background</button>
  {isColorPickerVisible && (
    <input 
      type="color" 
      value={bgColor} 
      onChange={handleBgColorChange} 
      style={{ display: 'block', marginTop: '10px' }} 
    />
  )}

  {/* Fill Color (For all elements) */}
  <button className="toggle-slider-button" onClick={toggleObjectColorPicker}>Color</button>
  {isObjectColorPickerVisible && (
    <input 
      type="color" 
      value={objectColor} 
      onChange={(e) => handleObjectColorChange(e.target.value)} 
      style={{ display: 'block', marginTop: '10px' }} 
    />
  )}

  {/* Font Button (Only for text objects) */}
{selectedObject && selectedObject.type === 'i-text' && (
  <button className="toggle-slider-button" onClick={() => showFontOverlay()}>
    Font
  </button>
)}


  {/* Shadow (Only for Rect, Circle, and Triangle) */}
  {selectedObject && (selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle') && (
    <>
      <button className="toggle-slider-button" onClick={toggleShadowSlider}>Shadow</button>
      {isShadowSliderVisible && (
        <>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={shadowBlur} 
            onChange={handleShadowBlurChange} 
          />
          <label>Blur</label>
          <input 
            type="range" 
            min="-50" 
            max="50" 
            value={shadowOffsetX} 
            onChange={handleShadowOffsetXChange} 
          />
          <label>Offset X</label>
          <input 
            type="range" 
            min="-50" 
            max="50" 
            value={shadowOffsetY} 
            onChange={handleShadowOffsetYChange} 
          />
          <label>Offset Y</label>
        </>
      )}
    </>
  )}

  {/* Opacity (For all elements) */}
  <button className="toggle-slider-button" onClick={toggleOpacitySlider}>Opacity</button>
  {isOpacitySliderVisible && (
    <input 
      type="range" 
      min="0" 
      max="1" 
      step="0.01" 
      value={opacity} 
      onChange={handleOpacityChange} 
    />
  )}

  {/* Close Button */}
  <button className="column-close-button" onClick={() => setIsColumnVisible(false)}>Close</button>
</div>



{/* Move the color picker here, outside the column-container */}
{isObjectColorPickerVisible && (
          <div className="color-picker-container">
            <ColorPicker color={objectColor} onColorChange={handleObjectColorChange} />
          </div>
        )}
  
 {/* Move button-container inside canvas-wrapper */}
 <div className="button-wrapper">
  <div className={`button-container ${isButtonContainerVisible ? 'visible' : 'hidden'}`}>
    {/* Canvas buttons */}
    <button className="canvas-button" onClick={togglePopup}>
      <img src="assets/shape.svg" alt="Add Shape" />
    </button>
    <button className="canvas-button" onClick={addText}>
      <img src="assets/text.svg" alt="Add Text" />
    </button>
    <button
      className="canvas-button"
      onClick={() => {
        if (fileInputRef.current) {
          fileInputRef.current.click(); // Trigger the hidden file input
        }
      }}
    >
      <img src="assets/upload.svg" alt="Upload Image" />
    </button>
    <button
      className={`canvas-button delete-button ${isObjectSelected ? 'wiggle' : ''}`}
      onClick={deleteElement}
      aria-label="Delete Element"
    >
      <img src="assets/delete.svg" alt="Delete Element" />
    </button>
  </div>

  {/* Toggle button */}
  <button
    className="toggle-canvas-buttons"
    onClick={() => setIsButtonContainerVisible(!isButtonContainerVisible)}
    aria-label="Toggle Canvas Buttons"
  >
    <img
      src="assets/openClose.svg"
      alt="Toggle Buttons"
      className={isButtonContainerVisible ? 'open' : 'closed'}
    />
  </button>
</div>




          
          

          {isAssetLibraryVisible && (
  <div className="overlay-asset-library-overlay">
    <div className="overlay-final-container">
      {/* Header */}
      <div className="overlay-header">
      </div>

      {/* Shape Grid */}
      <div className="overlay-shape-grid">
        {/* Row 1 */}
        <div className="overlay-row">
          {svgLibrary.slice(0, 4).map((asset, index) => (
            <div key={index} className="overlay-shape-container">
              <button 
                className="overlay-shape-button" 
                onClick={() => addAssetToCanvas(asset)}
              >
                <img src={asset.url} alt={asset.name} />
              </button>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="overlay-row">
          {svgLibrary.slice(4, 8).map((asset, index) => (
            <div key={index} className="overlay-shape-container">
              <button 
                className="overlay-shape-button" 
                onClick={() => addAssetToCanvas(asset)}
              >
                <img src={asset.url} alt={asset.name} />
              </button>
            </div>
          ))}
        </div>

        {/* Row 3 */}
        <div className="overlay-row">
          {svgLibrary.slice(8, 12).map((asset, index) => (
            <div key={index} className="overlay-shape-container">
              <button 
                className="overlay-shape-button" 
                onClick={() => addAssetToCanvas(asset)}
              >
                <img src={asset.url} alt={asset.name} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse Button */}
      <div className="overlay-collapse-button-container">
  <button 
    className="overlay-collapse-button" 
    onClick={toggleAssetLibraryOverlay}
  >
    {/* Add an image to the left of the word "Collapse" */}
    <img 
      src="assets/collapse-icon.svg"  // Replace with your icon's path
      alt="Collapse Icon" 
      style={{ width: '12px', marginRight: '8px' }} // Styling for the icon size and spacing
    />
    Collapse
  </button>
</div>
    </div>
  </div>
)}





          {isPopupVisible && (
            <div className="asset-library-popup">
  <div className="popup-header">
    <h2>asset library</h2>
  </div>
  <div className="shape-grid">
    <div className="row">
      <div className="shape-container">
        <button className="shape-button" onClick={() => addAssetToCanvas({ type: 'rect', width: 100, height: 100, fill: '#FF6F61' })}>
          <img src="assets/square.svg" alt="Square" />
        </button>
      </div>
      <div className="shape-container">
        <button className="shape-button" onClick={() => addAssetToCanvas({ type: 'circle', radius: 50, fill: '#61ff6f' })}>
          <img src="assets/circle.svg" alt="Circle" />
        </button>
      </div>
    </div>
    <div className="row">
      <div className="shape-container">
        <button className="shape-button" onClick={() => addAssetToCanvas({ type: 'triangle', width: 100, height: 100, fill: '#6B5B95' })}>
          <img src="assets/triangle.svg" alt="Triangle" />
        </button>
      </div>
      <div className="shape-container">
        <button
          className="shape-button"
          onClick={() => {
            const roundedAsset = svgLibrary.find(asset => asset.name === 'Rounded Asset');
            if (roundedAsset) {
              addAssetToCanvas(roundedAsset);
            } else {
              console.error('Rounded Asset not found in svgLibrary');
            }
          }}
        >
          <img src="assets/roundedAsset.svg" alt="Rounded Rectangle" />
        </button>
      </div>
    </div>
    <div className="row">
      <div className="shape-container">
        <button
          className="shape-button"
          onClick={() => {
            const searchAsset = svgLibrary.find(asset => asset.name === 'Search Asset');
            if (searchAsset) {
              addAssetToCanvas(searchAsset);
            } else {
              console.error('Search Asset not found in svgLibrary');
            }
          }}
        >
          <img src="assets/searchAsset.svg" alt="Search" />
        </button>
      </div>
      <div className="shape-container">
        <button
          className="shape-button"
          onClick={() => {
            const uploadAsset = svgLibrary.find(asset => asset.name === 'Upload Asset');
            if (uploadAsset) {
              addAssetToCanvas(uploadAsset);
            } else {
              console.error('Upload Asset not found in svgLibrary');
            }
          }}
>
              <img src="assets/uploadAsset.svg" alt="Upload" />
              </button>
          </div>
         </div>
      </div>
  <div className="view-all-container">
  <button 
    className="view-all-button" 
    onClick={toggleAssetLibraryOverlay}  // Only need to call this function
  >View All</button>
</div>


              <button className="close-button" onClick={togglePopup}>Close</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
    
}

// Use ReactDOM.createRoot for React 18
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<CanvasApp />);