const folderPicker = document.getElementById('folder-picker');
const loadImagesButton = document.getElementById('load-images');
const image = document.getElementById('image');
image.src = 'images/image.png';
const container = document.querySelector('.container');
const navLeft = document.querySelector('.nav-left');
const navRight = document.querySelector('.nav-right');
const messageContainer = document.getElementById('message-container'); // Get the message container
const soundHover = new Audio('sounds/Hover.wav'); // Path to your sound file
const soundClick = new Audio('sounds/Click.wav'); // Path to your .wav file
const buttons = document.querySelectorAll('button');

let isMouseDown = false;
let currentRotationX = 0;
let currentRotationY = 0;
let startX, startY;
let currentZoom = 1;
const zoomStep = 0.1;
const zoomMin = 1;
const zoomMax = 4.0;

// Image navigation variables
let imageFiles = [];
let currentImageIndex = 0;

// Function to update transformations
function updateTransform() {
    image.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) scale(${currentZoom})`;
}

folderPicker.addEventListener('change', (e) => {
    imageFiles = Array.from(e.target.files)
        .filter(file => file.name.toLowerCase().endsWith('.png'));
    
    if (imageFiles.length > 0) {
        currentImageIndex = 0;
        loadImage(imageFiles[currentImageIndex]);
    }
});

// Load image from file
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function rotateAndChangeImage() {
    soundClick.play(); // Play sound when the button is clicked
    // Step 1: Rotate to 90 degrees (look to your left) with linear transition (250ms)
    currentRotationY = 90;
    image.style.transition = 'transform 0.25s linear';  // Fast linear transition (250ms)
    updateTransform();

    // Step 2: After 250ms, change the image to "back.png" and rotate instantly to -90 degrees
    setTimeout(() => {
        image.src = 'images/back.png';  // Change the image to "back.png"
        
        currentRotationY = -90;  // Rotate instantly to -90 degrees
        image.style.transition = 'none';  // Disable transition for this instant rotation
        updateTransform();

        // Step 3: After 250ms, rotate back to 0 degrees (look at you) with linear transition
        setTimeout(() => {
            currentRotationY = 0;  // Rotate back to 0 degrees
            image.style.transition = 'transform 0.25s linear';  // Re-enable linear transition for smooth movement
            updateTransform();

            // Step 4: After 250ms, rotate to 90 degrees (look to your left) with linear transition
            setTimeout(() => {
                currentRotationY = 90;
                image.style.transition = 'transform 0.25s linear';  // Re-enable linear transition for smooth movement
                updateTransform();

                // Step 5: After 250ms, change the image to the next image and rotate instantly to -90 degrees
                setTimeout(() => {
                    currentImageIndex = (currentImageIndex + 1) % imageFiles.length;  // Get the next image
                    loadImage(imageFiles[currentImageIndex]);  // Load the next image
                    image.src = imageFiles[currentImageIndex];  // Change to the next image

                    currentRotationY = -90;  // Rotate instantly to -90 degrees
                    image.style.transition = 'none';  // Disable transition for this instant rotation
                    updateTransform();

                    // Step 6: After 250ms, rotate back to 0 degrees (look at you) with linear transition
                    setTimeout(() => {
                        currentRotationY = 0;
                        image.style.transition = 'transform 0.25s linear';  // Re-enable linear transition for smooth movement
                        updateTransform();
                    }, 250);  // Wait 250ms before final transition back to 0 degrees

                }, 250); // Wait 250ms before changing to the next image

            }, 250); // Wait 250ms before rotating to 90 degrees

        }, 250); // Wait 250ms before rotating back to 0 degrees

    }, 250); // Wait 250ms before changing to "back.png"
}

function rotateAndChangeImage2() {
    soundClick.play(); // Play sound when the button is clicked
    // Step 1: Rotate to -90 degrees (look to your right) with linear transition (250ms)
    currentRotationY = -90;
    image.style.transition = 'transform 0.25s linear';  // Fast linear transition (250ms)
    updateTransform();

    // Step 2: After 250ms, change the image to "back.png" and rotate instantly to 90 degrees
    setTimeout(() => {
        image.src = 'images/back.png';  // Change the image to "back.png"
        
        currentRotationY = 90;  // Rotate instantly to 90 degrees
        image.style.transition = 'none';  // Disable transition for this instant rotation
        updateTransform();

        // Step 3: After 250ms, rotate back to 0 degrees (look at you) with linear transition
        setTimeout(() => {
            currentRotationY = 0;  // Rotate back to 0 degrees
            image.style.transition = 'transform 0.25s linear';  // Re-enable linear transition for smooth movement
            updateTransform();

            // Step 4: After 250ms, rotate to -90 degrees (look to your right) with linear transition
            setTimeout(() => {
                currentRotationY = -90;
                image.style.transition = 'transform 0.25s linear';  // Re-enable linear transition for smooth movement
                updateTransform();

                // Step 5: After 250ms, change the image to the next image and rotate instantly to 90 degrees
                setTimeout(() => {
                    currentImageIndex = (currentImageIndex - 1 + imageFiles.length) % imageFiles.length;  // Adjust for negative indices and wrap around
                    loadImage(imageFiles[currentImageIndex]);  // Load the next image
                    image.src = imageFiles[currentImageIndex];  // Change to the next image

                    currentRotationY = 90;  // Rotate instantly to 90 degrees
                    image.style.transition = 'none';  // Disable transition for this instant rotation
                    updateTransform();

                    // Step 6: After 250ms, rotate back to 0 degrees (look at you) with linear transition
                    setTimeout(() => {
                        currentRotationY = 0;
                        image.style.transition = 'transform 0.25s linear';  // Re-enable linear transition for smooth movement
                        updateTransform();
                    }, 250);  // Wait 250ms before final transition back to 0 degrees

                }, 250); // Wait 250ms before changing to the next image

            }, 250); // Wait 250ms before rotating to -90 degrees

        }, 250); // Wait 250ms before rotating back to 0 degrees

    }, 250); // Wait 250ms before changing to "back.png"
}


// Image navigation button clicks
navLeft.addEventListener('click', rotateAndChangeImage2);
navRight.addEventListener('click', rotateAndChangeImage);


// Mouse down: Start rotation only, not movement
container.addEventListener('mousedown', function (e) {
    if (e.button === 0) {  // Left-click
        e.preventDefault();
        isMouseDown = true;
        container.style.cursor = 'none';
        startX = e.clientX;
        startY = e.clientY;
    }
});

// Mouse move: Rotate the card (responsive while dragging)
document.addEventListener('mousemove', function (e) {
    if (!isMouseDown) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    currentRotationX -= deltaY * 0.1;
    currentRotationY += deltaX * 0.1;

    currentRotationX = Math.max(Math.min(currentRotationX, 45), -45);
    currentRotationY = Math.max(Math.min(currentRotationY, 45), -45);

    // Update transform without causing delays
    image.style.transition = 'none';  // Disable transition for drag
    updateTransform();

    startX = e.clientX;
    startY = e.clientY;
});

// Mouse up: Stop rotation
document.addEventListener('mouseup', function () {
    isMouseDown = false;
    container.style.cursor = 'grab';

    // Re-enable transition after dragging is done
    image.style.transition = 'transform 1s ease-in-out';  // Re-enable transition
});

// Mouse wheel: Zoom in/out (No delay)
container.addEventListener('wheel', function (e) {
    e.preventDefault();

    currentZoom = e.deltaY < 0 
        ? Math.min(currentZoom + zoomStep, zoomMax)
        : Math.max(currentZoom - zoomStep, zoomMin);

    // Remove transition to make zoom snappy
    image.style.transition = 'none';  // Instant zoom

    // Update zoom without delay
    updateTransform();
});


// Middle Mouse Zoom and Rotation Reset
container.addEventListener('mousedown', function (e) {
    if (e.button === 1) { // Middle mouse button (wheel) clicked
        e.preventDefault();

        // Set zoom level to 1
        currentZoom = 1;

        // Reset rotation to initial values (0 for both axes)
        currentRotationX = 0;
        currentRotationY = 0;

        // Remove transition for instant zoom and rotation reset effect
        image.style.transition = 'none';

        // Update zoom and rotation
        updateTransform();
    }
});



// Prevent default drag behavior on the image
image.addEventListener('dragstart', (e) => e.preventDefault());

// Prevent right-click menu from showing
container.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Hide the message container after 10 seconds
setTimeout(function() {
    if (messageContainer) {  // Check if the message container exists
        messageContainer.style.display = 'none';
    }
}, 10000); // 10 seconds in milliseconds





// Right-click behavior for moving image (Right-click only)
let isRightMouseDown = false; // For right-click behavior
let startYRightClick; // Store the initial Y position for right-click drag
let initialTranslateY = 0; // To store the initial vertical position of the image
let currentImageY = 0; // To track the vertical position of the image

// Prevent right-click menu from showing
container.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Right mouse down: Start moving image
container.addEventListener('mousedown', function (e) {
    if (e.button === 2) { // Right-click
        isRightMouseDown = true;
        startYRightClick = e.clientY;
        initialTranslateY = currentImageY; // Store the current vertical position
        container.style.cursor = 'move'; // Change cursor to indicate movement

        // Disable transition while moving
        image.style.transition = 'none';
    }
});

// Right mouse move: Move image up and down
document.addEventListener('mousemove', function (e) {
    if (isRightMouseDown) {
        const deltaY = e.clientY - startYRightClick;
        currentImageY = initialTranslateY + deltaY;

        // Apply the vertical movement (translateY) without rotating
        image.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) translateY(${currentImageY}px) scale(${currentZoom})`;
    }
});

// Right mouse up: Stop moving image and ease back to original position
document.addEventListener('mouseup', function (e) {
    if (e.button === 2) { // Right-click
        isRightMouseDown = false;
        container.style.cursor = 'default'; // Reset the cursor

        // Enable the transition to smoothly return to the original position
        image.style.transition = 'transform 0.5s ease'; // Apply easing effect
        currentImageY = 0; // Reset vertical position to 0 (or original position)

        // Apply the transition back to the original position
        image.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) translateY(${currentImageY}px) scale(${currentZoom})`;
    }
});







// Select the elements
const arrowContainer = document.getElementById('arrow-container');
const imageContainer = document.getElementById('image-container');

// Initially hide the image container
imageContainer.style.transform = 'translateY(100%)'; // Start off-screen
imageContainer.style.transition = 'transform 0.3s ease'; // Smooth transition for the menu

// Add smooth transition for the arrow
arrowContainer.style.transition = 'bottom 0.3s ease'; // Smooth transition for the arrow

// Toggle the pull-up menu when the button is clicked
arrowContainer.addEventListener('click', () => {
    soundClick.play(); // Play sound when the button is clicked
    
    // Check if the menu is already pulled up
    if (imageContainer.style.transform === 'translateY(100%)') {
        // Pull it up
        imageContainer.style.transform = 'translateY(0)';
        // Move the arrow with the menu
        arrowContainer.style.bottom = '220px'; // Adjust based on menu height
    } else {
        // Push it back down
        imageContainer.style.transform = 'translateY(100%)';
        // Reset arrow position
        arrowContainer.style.bottom = '20px'; // Reset to original position
    }
});








// Select necessary elements
const imageRow = document.getElementById('image-row');
const currentImage = document.getElementById('image'); // The main display image

// Event listener for the "Load Images" button
loadImagesButton.addEventListener('click', () => {
    folderPicker.click(); // Trigger file input dialog
});

// Handle folder picker file selection
folderPicker.addEventListener('change', (e) => {
    const imageFiles = Array.from(e.target.files)
        .filter(file => file.name.toLowerCase().endsWith('.png')); // Filter for PNG files

    console.log(`Number of images imported: ${imageFiles.length}`); // Log the number of images imported

    if (imageFiles.length > 0) {
        // Clear any existing images in the row
        imageRow.innerHTML = '';

        // Loop through each selected image file and add it to the image row
        imageFiles.forEach((file) => {
            const imgElement = document.createElement('img'); // Create new img element
            const reader = new FileReader();

            // Load image data
            reader.onload = (e) => {
                imgElement.src = e.target.result; // Set the loaded image as the source
                imgElement.alt = file.name; // Set alt text to file name
                imageRow.appendChild(imgElement); // Add the img element to the image row

                // Add click event to display the clicked image in the main display
                imgElement.addEventListener('click', () => {
                    soundClick.play(); // Play sound when the button is clicked
                    // Step 1: Smoothly reset any transformations (zoom, twist, etc.)
                    currentImage.style.transition = 'transform 0.5s ease';
                    currentImage.style.transform = 'scale(1) rotate(0deg)'; // Reset zoom and rotation

                    // Wait for the transformation reset to complete before starting the downward slide
                    currentImage.addEventListener('transitionend', function resetTransform() {
                        // Remove the transitionend listener to avoid triggering on future transitions
                        currentImage.removeEventListener('transitionend', resetTransform);

                        // Step 2: Apply downward animation after the reset
                        currentImage.style.transition = 'transform 0.5s ease';
                        currentImage.style.transform = 'translateY(150%)'; // Move image offscreen (downward)

                        // Step 3: Change the image after the downward animation completes
                        currentImage.addEventListener('transitionend', function changeImage() {
                            // Change the image source and alt text
                            currentImage.src = imgElement.src;
                            currentImage.alt = imgElement.alt;

                            // Step 4: Bring the image back into view
                            currentImage.style.transition = 'transform 0.5s ease';
                            currentImage.style.transform = 'translateY(0)';

                            // Remove the event listener to avoid triggering on future animations
                            currentImage.removeEventListener('transitionend', changeImage);

                            // Step 5: After the image comes back, reset zoom and rotation
                            // Set zoom level to 1
                            currentZoom = 1;

                            // Reset rotation to initial values (0 for both axes)
                            currentRotationX = 0;
                            currentRotationY = 0;

                            // Update zoom and rotation
                            updateTransform();
                        });
                    });
                });
            };  
            reader.readAsDataURL(file); // Read the image file
        });
    }   
});




// FULLSCREEN
document.getElementById('fullscreen-btn').addEventListener('click', function() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      // If the page is in fullscreen, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    } else {
      // If the page is not in fullscreen, enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
    }
  });
  




buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      // Randomize pitch between 0.95 (95%) and 1.05 (105%)
      const randomPitch = Math.random() * 0.1 + 0.95; // Generates a number between 0.95 and 1.05
      soundHover.playbackRate = randomPitch; // Apply the random pitch
  
      console.log(`Random pitch: ${randomPitch.toFixed(2)}`); // Debugging to check the random pitch
      
      soundHover.play(); // Play sound with randomized pitch
    });
});



buttons.forEach(button => {
  button.addEventListener('click', function() {
    soundClick.play(); // Play sound when the button is clicked
  });
});




const hiddenElement = document.querySelector('.nav-control'); // Select the element by class

folderPicker.addEventListener('change', (e) => {
    const imageFiles = Array.from(e.target.files)
        .filter(file => file.name.toLowerCase().endsWith('.png')); // Filter for PNG files

    // Control visibility of the nav-control, nav-left, and nav-right elements
    if (imageFiles.length >= 2) {
        hiddenElement.style.display = 'block'; // Reveal the nav-control element
        navLeft.style.display = 'block'; // Reveal the nav-left element
        navRight.style.display = 'block'; // Reveal the nav-right element
    } else {
        hiddenElement.style.display = 'none'; // Hide the nav-control element
        navLeft.style.display = 'none'; // Hide the nav-left element
        navRight.style.display = 'none'; // Hide the nav-right element
    }
});










