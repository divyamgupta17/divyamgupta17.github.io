const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const malePlayerImage = new Image();
malePlayerImage.src = 'boy.png'; // Male player image

const femalePlayerImage = new Image();
femalePlayerImage.src = 'girl.jpg'; // Female player image

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

let gameInterval;
let trashInterval;
let treeInterval;
let gameStarted = false;
let trashFallSpeed = 2; // Initial speed at which trash falls

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawItem(item, image) {
    ctx.drawImage(image, item.x, item.y, item.width, item.height);
}

function createTrash() {
    const randomIndex = Math.floor(Math.random() * garbageImages.length);
    const trash = {
        x: Math.random() * (canvas.width - 40), // Adjusted for larger size
        y: 0,
        width: 40, // Increased size
        height: 40, // Increased size
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

function updateItems() {
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
                createTree(2); // Add 2 trees
            }

            // Increase speed every multiple of 25 pieces of trash collected
            if (player.trashCollected % 25 === 0) {
                trashFallSpeed += 1; // Increase trash fall speed
                player.speed += 1; // Optionally increase player speed
            }
        }
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
    drawPlayer();
    updateItems();
    trashItems.forEach((item) => drawItem(item, item.image));
    trees.forEach((tree) => drawItem(tree, treeImage));
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
    }
}

function stopGame() {
    if (gameStarted) {
        gameStarted = false;
        clearInterval(gameInterval);
        clearInterval(trashInterval);
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
        trashFallSpeed = 2; // Reset trash fall speed
        player.speed = 5; // Reset player speed

        startGame(); // Start the game
    }
}

function submitName() {
    const nameInput = document.getElementById('player-name');
    const playerName = nameInput.value.trim();
    if (playerName) {
        player.name = playerName;
        document.getElementById('player-name-container').style.display = 'none'; // Hide the name input
        document.getElementById('gender-selection-container').style.display = 'block'; // Show gender selection
    } else {
        alert('Please enter a name!');
    }
}

function selectGender() {
    const genderSelect = document.getElementById('gender-select');
    const selectedGender = genderSelect.value;
    if (selectedGender) {
        if (selectedGender === 'male') {
            player.image = malePlayerImage; // Set male player image
        } else if (selectedGender === 'female') {
            player.image = femalePlayerImage; // Set female player image
        }
        document.getElementById('gender-selection-container').style.display = 'none'; // Hide gender selection
        document.getElementById('start-button').style.display = 'block'; // Show start button
    } else {
        alert('Please select a gender!');
    }
}

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('stop-button').addEventListener('click', stopGame);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('submit-name').addEventListener('click', submitName);
document.getElementById('select-gender').addEventListener('click', selectGender);

// Show the name input container when the page loads
document.getElementById('player-name-container').style.display = 'block';
