const card = document.getElementById('image');

    let rotationX = 0;
    let rotationY = 0;
    let zoom = 1;

    // Animation function
    function animateCard() {
    // Oscillate rotation and zoom values
    rotationX = Math.sin(Date.now() * 0.001) * 20; // Oscillates between -20 and 20
    rotationY = Math.cos(Date.now() * 0.0015) * 20; // Oscillates between -20 and 20
    zoom = 1 + Math.sin(Date.now() * 0.002) * 0.05; // Oscillates between 0.95 and 1.05

    // Apply transform styles
    card.style.transform = `perspective(800px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`;

    // Continue the animation loop
    requestAnimationFrame(animateCard);
    }

    // Start the animation
    animateCard();