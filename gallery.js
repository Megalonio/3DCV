const button = document.getElementById('select-folder-btn');
const imageContainer = document.getElementById('image-container');

button.addEventListener('click', async () => {
  try {
    // Prompt user to select a folder
    const directoryHandle = await window.showDirectoryPicker();
    const images = [];

    // Iterate through folder entries
    for await (const [name, handle] of directoryHandle.entries()) {
      // Only process .png files
      if (handle.kind === 'file' && name.toLowerCase().endsWith('.png')) {
        const file = await handle.getFile();

        // Cache image data with unique ID
        images.push({
          id: crypto.randomUUID(), // Generate unique ID
          name,
          file,
          url: URL.createObjectURL(file), // Create object URL for display
        });
      }
    }

    if (images.length === 0) {
      alert('No PNG images found in the selected folder.');
      return;
    }

    // Sort images alphabetically by name
    images.sort((a, b) => a.name.localeCompare(b.name));

    // Display images
    displayImages(images);
  } catch (error) {
    console.error('Error accessing folder:', error);
    alert('Failed to access folder or no folder selected.');
  }
});

function displayImages(images) {
  imageContainer.innerHTML = ''; // Clear previous images

  images.forEach((image) => {
    const div = document.createElement('div');
    div.className = 'image-item';

    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.name;

    const caption = document.createElement('span');
    caption.textContent = image.name;

    div.appendChild(img);
    div.appendChild(caption);
    imageContainer.appendChild(div);
  });
}





// Add a container for the zoomed image to the HTML
const zoomContainer = document.createElement('div');
zoomContainer.id = 'zoomed-image-container';
zoomContainer.innerHTML = `
  <img id="zoomed-image" src="" alt="Zoomed Image">
  <button id="close-zoom"></button>
`;
document.body.appendChild(zoomContainer);

const zoomedImage = document.getElementById('zoomed-image');
const closeZoom = document.getElementById('close-zoom');

// Close zoomed view when clicking the close button
closeZoom.addEventListener('click', () => {
  zoomContainer.classList.remove('active');
});

// Update the displayImages function to add click event for zoom
function displayImages(images) {
  imageContainer.innerHTML = ''; // Clear previous images

  images.forEach((image) => {
    const div = document.createElement('div');
    div.className = 'image-item';

    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.name;

    // Add click event to zoom the image
    img.addEventListener('click', () => {
      zoomedImage.src = image.url;
      zoomContainer.classList.add('active');
    });

    div.appendChild(img);
    imageContainer.appendChild(div);
  });
}
