const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const malePlayerImage = new Image();
malePlayerImage.src = 'boy.png'; // Male player image

const garbageImages = [
    'trash1.png', 
    'trash2.png', 
    'trash3.jpg'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const treeImage = new Image();
treeImage.src = 'tree.jpg'; // Ensure this path is correct

const rainDropImage = new Image();
rainDropImage.src = 'raindrop.jpg'; // Ensure this path is correct

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 70,
    speed: 5,
    score: 0,
    trashCollected: 0,
    name: 'Player',
    image: malePlayerImage // Default to male player image
};

const trashItems = [];
const trees = [];
const rainDrops = []; // Initialize the rainDrops array

let gameInterval;
let trashInterval;
let rainDropInterval;
let gameStarted = false;
let trashFallSpeed = 2; // Initial speed at which trash falls
let rainActive = false; // To check if rain is active

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawItem(item, image) {
    ctx.drawImage(image, item.x, item.y, item.width, item.height);
}

function createTrash() {
    const randomIndex = Math.floor(Math.random() * garbageImages.length);
    const trash = {
        x: Math.random() * (canvas.width - 40),
        y: 0,
        width: 40,
        height: 40,
        image: garbageImages[randomIndex] // Randomly select a garbage image
    };
    trashItems.push(trash);
}

function createTree(count = 1) {
    for (let i = 0; i < count; i++) {
        const tree = {
            x: Math.random() * (canvas.width - 50),
            y: Math.random() * (canvas.height - 50),
            width: 50,
            height: 50
        };
        trees.push(tree);
    }
}

function createRainDrop() {
    const drop = {
        x: Math.random() * canvas.width,
        y: 0,
        width: 10,
        height: 30,
        speed: 3,
        image: rainDropImage // Use the raindrop image
    };
    rainDrops.push(drop);
}

function updateItems() {
    // Update rain drops
    for (let i = rainDrops.length - 1; i >= 0; i--) {
        let drop = rainDrops[i];
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
            rainDrops.splice(i, 1); // Remove drop if it goes off screen
        }
    }

    // Update trash items
    for (let i = trashItems.length - 1; i >= 0; i--) {
        trashItems[i].y += trashFallSpeed;
        if (trashItems[i].y > canvas.height) {
            trashItems.splice(i, 1);
        }

        if (
            trashItems[i].x < player.x + player.width &&
            trashItems[i].x + trashItems[i].width > player.x &&
            trashItems[i].y < player.y + player.height &&
            trashItems[i].y + trashItems[i].height > player.y
        ) {
            player.trashCollected += 1;
            player.score += 10;
            trashItems.splice(i, 1);

            // Add trees for every 5 pieces of garbage collected
            if (player.trashCollected % 5 === 0) {
                createTree(3); // Add 3 trees
            }

            // Start rain and increase tree size if 20 pieces of trash collected
            if (player.trashCollected % 20 === 0) {
                rainActive = true;
                createRainDrop(); // Create raindrops initially
            }

            // Increase speed every multiple of 15 pieces of trash collected
            if (player.trashCollected % 15 === 0) {
                trashFallSpeed += 1; // Increase trash fall speed
                player.speed += 1; // Optionally increase player speed
            }
        }
    }

    // Increase tree size after rain stops
    if (rainActive) {
        for (let tree of trees) {
            tree.width += 10; // Increase tree size
            tree.height += 10;
        }
        rainActive = false; // Reset rain status
        setTimeout(() => {
            alert('You have unlocked a new tree!');
        }, 1000); // Show message after 1 second
    }
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + player.score, 10, 30);
    ctx.fillText('Trash Collected: ' + player.trashCollected, 10, 60);
    ctx.fillText('Name: ' + player.name, 10, 90);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
    ctx.fillStyle = 'white'; // Initial background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If it started raining, change background color
    if (rainActive) {
        ctx.fillStyle = 'lightbrown';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawPlayer();
    updateItems();
    rainDrops.forEach(drop => drawItem(drop, drop.image));
    trashItems.forEach(item => drawItem(item, item.image));
    trees.forEach(tree => drawItem(tree, treeImage));
    drawScore();
}

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (e.key === 'ArrowUp' && player.y > 0) {
        player.y -= player.speed;
    } else if (e.key === 'ArrowDown' && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
});

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById('start-button').style.display = 'none'; // Hide start button
        document.getElementById('stop-button').style.display = 'block'; // Show stop button
        document.getElementById('restart-button').style.display = 'none'; // Hide restart button
        
        // Add space at the top of the canvas
        canvas.style.marginTop = '50px'; // Adjust the value as needed
        
        gameInterval = setInterval(gameLoop, 20);
        trashInterval = setInterval(createTrash, 1000);
        rainDropInterval = setInterval(createRainDrop, 1000); // Create raindrops periodically
    }
}

function stopGame() {
    if (gameStarted) {
        gameStarted = false;
        clearInterval(gameInterval);
        clearInterval(trashInterval);
        clearInterval(rainDropInterval);
        document.getElementById('start-button').style.display = 'block'; // Show start button
        document.getElementById('stop-button').style.display = 'none'; // Hide stop button
        document.getElementById('restart-button').style.display = 'block'; // Show restart button
    }
}

function restartGame() {
    if (!gameStarted) {
        player.x = canvas.width / 2 - 25;
        player.y = canvas.height - 70;
        player.score = 0;
        player.trashCollected = 0;
        trashItems.length = 0;
        trees.length = 0;
        rainDrops.length = 0; // Clear rain drops
        trashFallSpeed = 2; // Reset trash fall speed
        player.speed = 5; // Reset player speed

        startGame(); // Start the game
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const restartButton = document.getElementById('restart-button');
    const submitNameButton = document.getElementById('submit-name-button');
    const selectGenderButton = document.getElementById('select-gender-button');

    if (startButton) {
        startButton.addEventListener('click', startGame);
    }

    if (stopButton) {
        stopButton.addEventListener('click', stopGame);
    }

    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }

    if (submitNameButton) {
        submitNameButton.addEventListener('click', submitName);
    }

    if (selectGenderButton) {
        selectGenderButton.addEventListener('click', selectGender);
    }
});
