const ColorPicker = ({ color, onColorChange }) => {
  const pickrRef = React.useRef(null);
  const pickrInstance = React.useRef(null);

  // Initialization useEffect - runs only once
  React.useEffect(() => {
    // If the Pickr instance is already initialized, do nothing
    if (pickrInstance.current) return;

    // If the ref is not yet attached, do nothing
    if (!pickrRef.current) return;

    // Initialize Pickr
    pickrInstance.current = Pickr.create({
      el: pickrRef.current,
      theme: 'classic', // or 'monolith', 'nano'
      default: color,
      swatches: [
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
      ],
      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: true,
          save: true,
        },
      },
    });

    // Event Listener for color changes
    pickrInstance.current.on('save', (colorInstance) => {
      const selectedColor = colorInstance.toHEXA().toString();
      onColorChange(selectedColor);

      // Close the Pickr instance after saving the color
      pickrInstance.current.hide();
    });

    // Cleanup on unmount
    return () => {
      if (pickrInstance.current) {
        pickrInstance.current.destroyAndRemove();
        pickrInstance.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  // Update Pickr when color prop changes
  React.useEffect(() => {
    if (pickrInstance.current && color) {
      pickrInstance.current.setColor(color);
    }
  }, [color]);

  return (
    <div className="color-picker-container">
      <h1>Color Picker</h1>
      <div className="color-display" style={{ backgroundColor: color }}>
        <p>Selected Color: {color}</p>
      </div>
      <label>Select a Color: </label>
      <div ref={pickrRef} className="pickr-container"></div>
    </div>
  );
};

// Expose the component globally so it can be used in app.js
window.ColorPicker = ColorPicker;
