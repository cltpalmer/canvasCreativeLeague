// fonts.js 

// List of custom fonts
const customFontList = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Raleway',
  'Poppins',
  'Playfair Display',
  'Oswald',
  'Merriweather',
  'Ubuntu',
  'Nunito',
  'Rubik',
  'Fira Sans',
  'Josefin Sans',
  'Quicksand',
  'Lora',
  'Work Sans',
  'Karla',
  'Inconsolata',
  'PT Sans'
];

// Function to load a font dynamically using FontFaceObserver
function loadFontWithFontFaceObserver(fontName) {
  if (fontName) {
    const fontObserver = new FontFaceObserver(fontName);
    return fontObserver.load(null, 10000) // 10 seconds timeout
      .then(() => {
        console.log(`Font ${fontName} has been loaded successfully.`);
      })
      .catch((error) => {
        console.error(`Failed to load font: ${fontName}`, error);
      });
  } else {
    return Promise.reject(new Error("No font name provided"));
  }
}

// Function to render the font overlay
function renderFontOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'font-overlay'; // Use the class for styling

  const fontListContainer = document.createElement('div');
  fontListContainer.className = 'font-list-container'; // Use the class for styling

  // Create the font options
  customFontList.forEach((font) => {
    const fontOption = document.createElement('div');
    fontOption.className = 'font-option'; // Use the class for styling
    fontOption.innerText = font;
    fontOption.style.fontFamily = font;

    // On font selection
    fontOption.onclick = () => {
      loadFontWithFontFaceObserver(font)
        .then(() => {
          const activeObject = window.fabricCanvas.getActiveObject();
          if (activeObject && activeObject.type === 'i-text') {
            activeObject.set({ fontFamily: font });
            window.fabricCanvas.renderAll();
            console.log(`Applied font ${font} to the selected object.`);
          } else {
            console.warn("No selected i-text object found.");
          }

          // Hide overlay after font selection
          overlay.style.display = 'none';

          // Hide the column container using toggleColumn
          if (typeof window.toggleColumn === 'function' && window.isColumnVisible) {
            window.toggleColumn();
          }
        })
        .catch((error) => {
          console.error(`Error applying font ${font}:`, error);
          // Optionally, notify the user about the failure
        });
    };

    fontListContainer.appendChild(fontOption);
  });

  // Add a close button for the overlay
  const closeButton = document.createElement('button');
  closeButton.innerText = 'close';
  closeButton.className = 'font-select-button'; // Use the class for styling
  closeButton.onclick = () => {
    overlay.style.display = 'none';
    // Optionally hide the column container when closing
    if (typeof window.toggleColumn === 'function' && window.isColumnVisible) {
      window.toggleColumn();
    }
  };

  overlay.appendChild(fontListContainer);
  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);

  // Function to show the overlay
  window.showFontOverlay = function () {
    overlay.style.display = 'flex';
  };
}

// Call the function to render the overlay when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderFontOverlay();
});
