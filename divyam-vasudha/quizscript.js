const questions = [
    { question: "1. What is climate change?", options: ["A. Long-term changes in temperature and weather patterns", "B. Temporary weather conditions", "C. Change in seasons", "D. None of the above"], answer: "A" },
    { question: "2. Which of the following is a major cause of climate change?", options: ["A. Volcanic eruptions", "B. Solar activity", "C. Human activities", "D. Ocean currents"], answer: "C" },
    { question: "3. What gas is most responsible for climate change?", options: ["A. Oxygen", "B. Hydrogen", "C. Carbon dioxide", "D. Nitrogen"], answer: "C" },
    { question: "4. Which sector contributes the most to greenhouse gas emissions?", options: ["A. Agriculture", "B. Transportation", "C. Industry", "D. Energy production"], answer: "D" },
    { question: "5. What can individuals do to help mitigate climate change?", options: ["A. Use public transport", "B. Recycle waste", "C. Conserve water", "D. All of the above"], answer: "D" },
    { question: "6. What is the greenhouse effect?", options: ["A. Natural warming of Earth", "B. The effect of greenhouses on plants", "C. The trapping of heat by greenhouse gases", "D. None of the above"], answer: "C" },
    { question: "7. Which organization is known for its climate research?", options: ["A. NASA", "B. WHO", "C. UN", "D. NOAA"], answer: "D" },
    { question: "8. What is carbon footprint?", options: ["A. The amount of carbon in the soil", "B. The total amount of greenhouse gases emitted", "C. A type of environmental impact assessment", "D. None of the above"], answer: "B" },
    { question: "9. What is renewable energy?", options: ["A. Energy that cannot be replaced", "B. Energy from sources that are not depleted", "C. Energy from fossil fuels", "D. None of the above"], answer: "B" },
    { question: "10. How can reforestation help combat climate change?", options: ["A. By increasing carbon dioxide emissions", "B. By providing habitat for wildlife", "C. By absorbing carbon dioxide and producing oxygen", "D. None of the above"], answer: "C" }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let countdown;
let timeLeft = 30;

const questionContainer = document.getElementById('question-container');
const timerDiv = document.getElementById('timer');
const garden = document.getElementById('garden');
const soilContainer = document.getElementById('soil');
const seedContainer = document.getElementById('seed');
const cloudContainers = [document.getElementById('cloud1'), document.getElementById('cloud2'), document.getElementById('cloud3')];
const sunContainer = document.getElementById('sun');
const fenceContainer = document.getElementById('fence');
const rainContainer = document.getElementById('rain');
const flowersContainer = document.getElementById('flowers');

function displayQuestion() {
    timeLeft = 30;
    questionContainer.innerHTML = `<p>${questions[currentQuestionIndex].question}</p>`;
    questions[currentQuestionIndex].options.forEach((option, index) => {
        questionContainer.innerHTML += `
        <input type="radio" name="q${currentQuestionIndex}" value="${option.charAt(0)}" id="q${currentQuestionIndex}a${index}">
        <label for="q${currentQuestionIndex}a${index}">${option}</label><br>`;
    });
    timer = setTimeout(submitAnswer, 30000); // Automatically submit answer after 30 seconds
    countdown = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Time left: ${timeLeft} seconds`;
        if (timeLeft === 0) {
            clearInterval(countdown);
        }
    }, 1000);
}

function submitAnswer() {
    clearTimeout(timer);
    clearInterval(countdown);

    const selectedOption = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
    
    if (selectedOption && selectedOption.value === questions[currentQuestionIndex].answer) {
        score++;
        
        // Check which question was answered correctly and show corresponding garden elements
        switch (currentQuestionIndex) {
            case 0:
                soilContainer.style.display = 'block'; // Show soil
                break;
            case 1:
                sprinkleSeeds(); // Sprinkle seeds
                break;
            case 2:
                showRain(); // Show rain effect
                break;
            case 3:
                 brightenSun(); // Show seed germination
                break;
            case 4:
 growPlantOnSoil();
                // Add specific effects for this question if needed
                break;
            case 5:
                // Brighten the sun
                addFences(); // Grow plant
                break;
            case 6:
                 // Add fences
                break;
            case 7:
                showRain(); // Show rain
                growMore(); // Grow more
                break;
            case 8:
                sprinkleMedicine(); // Sprinkle medicine
                break;
            case 9:
                growFlowers(); // Grow flowers
                break;
        }
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        questionContainer.innerHTML = `<p>Your score is ${score} out of ${questions.length}</p>`;
        timerDiv.innerHTML = ''; // Clear the timer
    }
}

function sprinkleSeeds() {
    seedContainer.style.display = 'block'; // Show seeds container
    
    const soil = seedContainer.getBoundingClientRect();
    const numberOfDots = 50; // Number of golden dots to sprinkle

    // Remove any existing dots
    seedContainer.innerHTML = '';

    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        
        // Random position within the top half of the soil container
        const maxLeft = soil.width - 10; // 10px is the size of the dot
        const maxTop = soil.height / 2 - 10; // Limit dots to the top half of the soil
        
        dot.style.left = `${Math.random() * maxLeft}px`;
        dot.style.bottom = `${Math.random() * maxTop}px`;

        // Add the dot to the container
        seedContainer.appendChild(dot);
    }

    // Remove dots and hide container after animation
    setTimeout(() => {
        seedContainer.style.display = 'none'; // Hide seeds container
    }, 2000); // Duration of the animation (same as CSS animation duration)
}

function showRain() {
    rainContainer.innerHTML = ''; // Clear any existing rain drops

    for (let i = 0; i < 20; i++) { // Fewer drops
        const rainDrop = document.createElement('div');
        rainDrop.classList.add('rain-drop');
        rainDrop.style.left = `${Math.random() * 100}%`;
        rainDrop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`; // Randomize fall speed
        rainContainer.appendChild(rainDrop);
    }

    rainContainer.style.display = 'block';

    setTimeout(() => {
        rainContainer.style.display = 'none'; // Hide rain effect after a few seconds
        // Show the small plant
    }, 3000); // Duration of the rain
}

function growPlantOnSoil() {
    const soilContainer = document.getElementById('soil'); // Ensure this matches your HTML ID
    const plantsPerRow = 4; // Number of plants per row
    const rows = 3; // Number of rows
    const numberOfPlants = plantsPerRow * rows; // Total number of plants

    // Remove existing plants if any
    soilContainer.innerHTML = '';

    const soilWidth = soilContainer.offsetWidth;
    const soilHeight = soilContainer.offsetHeight;
    const plantWidth = 60; // Width of the plant image
    const plantHeight = 60; // Height of the plant image
    const spacing = 10; // Spacing between plants

    // Calculate the available space for positioning
    const totalWidth = plantWidth * plantsPerRow + spacing * (plantsPerRow - 1);
    const totalHeight = plantHeight * rows + spacing * (rows - 1);

    const startX = (soilWidth - totalWidth) / 2; // Center horizontally
    const startY = (soilHeight - totalHeight) / 2; // Center vertically

    for (let i = 0; i < numberOfPlants; i++) {
        const plantImage = document.createElement('img');
        plantImage.src = 'plant.png'; // Replace with your plant image path
        plantImage.className = 'small-plant'; // Apply CSS class for styling
        plantImage.style.position = 'absolute'; // Ensure absolute positioning for correct placement
        plantImage.style.opacity = '0'; // Start with the plant invisible

        // Calculate row and column for positioning
        const row = Math.floor(i / plantsPerRow);
        const col = i % plantsPerRow;

        const left = startX + col * (plantWidth + spacing);
        const top = startY + row * (plantHeight + spacing);

        plantImage.style.left = `${left}px`;
        plantImage.style.top = `${top}px`;

        // Append the plant image to the soil container
        soilContainer.appendChild(plantImage);

        // Optionally, add an animation or delay to make the plant "grow"
        setTimeout(() => {
            plantImage.style.opacity = '1'; // Make the plant visible
            plantImage.style.transition = 'opacity 1s'; // Smooth fade-in effect
        }, 500); // Delay before showing the plant
    }
}


function createPlantGrid() {
    const plantContainer = document.getElementById('plant-container');
    const numberOfPlants = 15; // 3 rows x 5 plants per row

    for (let i = 0; i < numberOfPlants; i++) {
        const plant = document.createElement('img');
        plant.src = 'images/plant-image.png'; // Path to your plant image
        plant.className = 'plant'; // Apply CSS class for styling
        plantContainer.appendChild(plant);
    }
}

function showGermination() {
    // Add your germination animation or effect here
}

function brightenSun() {
    const sun = document.getElementById('sun');
    sun.style.opacity = '1'; // Make the sun visible and bright
}

function growPlant() {
    // Add your plant growing effect here
}

function addFences() {
            alert("---");
            const fenceContainer = document.getElementById('fence-container');
            if (fenceContainer) {
                // Set fence images
                document.querySelector('.fence-top').style.backgroundImage = 'url("fence.jpg")';
                document.querySelector('.fence-bottom').style.backgroundImage = 'url("fence.jpg")';
                document.querySelector('.fence-left').style.backgroundImage = 'url("fence.jpg")';
                document.querySelector('.fence-right').style.backgroundImage = 'url("fence.jpg")';

                // Show fences
                fenceContainer.style.display = 'block'; 
            } else {
                console.error('Fence container not found!');
            }
        }
function growMore() {
    // Add your effect for growing more plants
}

function sprinkleMedicine() {
    // Add your effect for sprinkling medicine
}

function growFlowers() {
    flowersContainer.style.display = 'block'; // Show flowers
}

function showNewTree() {
    // Logic to show a new tree in the garden
    const newTree = document.createElement('div');
    newTree.classList.add('tree'); // Add appropriate styles for the tree
    garden.appendChild(newTree);
}

window.onload = displayQuestion;

function toggleNav() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.toggle('active');
}

function playSound() {
    const audio = new Audio('click.mp3'); // Replace with the path to your sound file
    audio.play();
}
