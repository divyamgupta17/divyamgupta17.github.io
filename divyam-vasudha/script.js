const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const executeButton = document.getElementById('executeButton');
const clearButton = document.getElementById('clearButton');
const actionSelect = document.getElementById('actionSelect');
const treeCountElem = document.getElementById('treeCount');
const messageElem = document.getElementById('message');

const rainOnRadio = document.getElementById('rainOn');
const rainOffRadio = document.getElementById('rainOff');
const rainSpeedSelect = document.getElementById('rainSpeed');

const treeImageSrc = 'mango.jpg'; // Path to your tree image
const treeWidth = 40; // Desired width of the tree image
const treeHeight = 40; // Desired height of the tree image

const treeSpacing = 50; // Spacing between trees
const rowSpacing = 60;  // Vertical spacing between rows
const treesPerRow = Math.floor(canvas.width / treeSpacing); // Number of trees per row
const maxRows = Math.floor(canvas.height / rowSpacing); // Maximum number of rows
const maxTrees = treesPerRow * maxRows; // Maximum number of trees

let trees = [];
let treeCount = 0;
let cutTreeMode = false;
let rainEffect = false;
let raindrops = [];
let rainSpeed = 'medium';
let waterFlowSpeed = 10; // Base speed of water flow

// Load an image and return a promise that resolves when the image is loaded
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
    });
}

// Plant a tree at a specific position on the canvas
async function plantTree(x, y) {
    try {
        const image = await loadImage(treeImageSrc);
        // Resize the image
        const scaledImage = document.createElement('canvas');
        scaledImage.width = treeWidth;
        scaledImage.height = treeHeight;
        const scaledCtx = scaledImage.getContext('2d');
        scaledCtx.drawImage(image, 0, 0, treeWidth, treeHeight);

        trees.push({ x, y, image: scaledImage });
        treeCount++;
        treeCountElem.textContent = treeCount;
        updateWaterFlowSpeed();
        drawGarden();
    } catch (error) {
        console.error('Error planting tree:', error);
    }
}

// Fill the garden with trees in a grid pattern
async function deforest() {
    trees = [];
    treeCount = 0;
    messageElem.textContent = '';

    for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < treesPerRow; col++) {
            if (treeCount >= maxTrees) {
                messageElem.textContent = 'No more space to plant trees!';
                return;
            }

            const x = col * treeSpacing + treeSpacing / 2;
            const y = row * rowSpacing + rowSpacing / 2;

            await plantTree(x, y);
        }
    }

    treeCountElem.textContent = treeCount;
}

// Handle tree removal on click
function handleClick(event) {
    if (cutTreeMode) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find and remove the tree closest to the click position
        for (let i = trees.length - 1; i >= 0; i--) {
            const tree = trees[i];
            const dist = Math.hypot(tree.x - x, tree.y - y);

            if (dist <= Math.max(treeWidth, treeHeight) / 2) {
                trees.splice(i, 1);
                treeCount--;
                treeCountElem.textContent = treeCount;
                updateWaterFlowSpeed();
                drawGarden();
                break; // Stop after removing one tree
            }
        }
    }
}

// Create and animate raindrops
function createRaindrop() {
    return {
        x: Math.random() * canvas.width,
        y: 0,
        speed: getRaindropSpeed(),
    };
}

function getRaindropSpeed() {
    let baseSpeed;
    if (rainSpeed === 'slow') {
        baseSpeed = 2;
    } else if (rainSpeed === 'medium') {
        baseSpeed = 4;
    } else if (rainSpeed === 'fast') {
        baseSpeed = 6;
    }
    const treeDensityFactor = 1 - (treeCount / maxTrees); // More trees -> lower speed
    return baseSpeed * (1 + treeDensityFactor); // Adjust speed based on tree count
}

function drawRaindrop(raindrop) {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(raindrop.x, raindrop.y, 2, 0, Math.PI * 2);
    ctx.fill();
}

function updateRaindrops() {
    raindrops.forEach((raindrop, index) => {
        raindrop.y += raindrop.speed;
        if (raindrop.y > canvas.height) {
            raindrops[index] = createRaindrop();
        }
    });
}

function toggleRain() {
    rainEffect = rainOnRadio.checked;
    if (rainEffect) {
        raindrops = [];
        for (let i = 0; i < 100; i++) {
            raindrops.push(createRaindrop());
        }
    } else {
        raindrops = [];
    }
}

// Update the speed of water flow based on the number of trees
function updateWaterFlowSpeed() {
    const treeDensityFactor = 1 - (treeCount / maxTrees);
    waterFlowSpeed = 10 * treeDensityFactor; // Example: base speed of 10, slowed by tree density
    messageElem.textContent = `Water Flow Speed: ${waterFlowSpeed.toFixed(2)}`;
}

// Execute the selected action
async function executeAction() {
    const action = actionSelect.value;
    messageElem.textContent = '';

    if (action === 'plant') {
        if (treeCount < maxTrees) {
            for (let i = 0; i < 10 && treeCount < maxTrees; i++) {
                const row = Math.floor(treeCount / treesPerRow);
                const col = treeCount % treesPerRow;
                const x = col * treeSpacing + treeSpacing / 2;
                const y = row * rowSpacing + rowSpacing / 2;

                await plantTree(x, y);
            }
        } else {
            messageElem.textContent = 'No more space to plant trees!';
        }
    } else if (action === 'deforest') {
        await deforest();
        cutTreeMode = true;
        executeButton.textContent = 'Cut Tree';
    }
}

// Clear all trees from the canvas
function clearGarden() {
    trees = [];
    treeCount = 0;
    treeCountElem.textContent = treeCount;
    messageElem.textContent = '';
    cutTreeMode = false;
    executeButton.textContent = 'Execute Action';
    drawGarden();
}

// Draw all trees and raindrops on the canvas
function drawGarden() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trees.forEach(tree => {
        ctx.drawImage(tree.image, tree.x - treeWidth / 2, tree.y - treeHeight / 2, treeWidth, treeHeight);
    });
    if (rainEffect) {
        updateRaindrops();
        raindrops.forEach(drawRaindrop);
    }
}

// Update button text and functionality based on selected action
function updateButtonText() {
    const action = actionSelect.value;
    if (action === 'plant') {
        executeButton.textContent = 'Plant Tree';
        cutTreeMode = false;
    } else if (action === 'deforest') {
        executeButton.textContent = 'Cut Tree';
        cutTreeMode = true;
    }
}

actionSelect.addEventListener('change', updateButtonText);
executeButton.addEventListener('click', executeAction);
clearButton.addEventListener('click', clearGarden);
canvas.addEventListener('click', handleClick);

// Add event listeners for the rain radio buttons and speed dropdown
rainOnRadio.addEventListener('change', toggleRain);
rainOffRadio.addEventListener('change', toggleRain);
rainSpeedSelect.addEventListener('change', () => {
    rainSpeed = rainSpeedSelect.value;
    toggleRain(); // Reset raindrops to apply the new speed
});

// Initialize button text
updateButtonText();

// Continuously update the canvas to show the trees and raindrops
function updateGarden() {
    drawGarden();
    requestAnimationFrame(updateGarden);
}

updateGarden();
