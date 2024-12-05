const folderPicker = document.getElementById('folder-picker');
const loadImagesButton = document.getElementById('load-images');
const image = document.getElementById('image');
const container = document.querySelector('.container');
const navLeft = document.querySelector('.nav-left');
const navRight = document.querySelector('.nav-right');
const messageContainer = document.getElementById('message-container'); // Get the message container

let isMouseDown = false;
let currentRotationX = 0;
let currentRotationY = 0;
let startX, startY;
let currentZoom = 1;
const zoomStep = 0.1;
const zoomMin = 0.5;
const zoomMax = 2.0;

// Image navigation variables
let imageFiles = [];
let currentImageIndex = 0;

// Function to update transformations
function updateTransform() {
    image.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) scale(${currentZoom})`;
}

// File picker functionality
loadImagesButton.addEventListener('click', () => {
    folderPicker.click();
});

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

// Image navigation button clicks
navLeft.addEventListener('click', rotateAndChangeImage);
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
