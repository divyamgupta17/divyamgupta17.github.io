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
                showCloudsAndSun(); // Show clouds and sun
                break;
            case 3:
                showGermination(); // Show seed germination
                break;
            case 4:
                // Add specific effects for this question if needed
                break;
            case 5:
                brightenSun(); // Brighten the sun
                growPlant(); // Grow plant
                break;
            case 6:
                addFences(); // Add fences
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
    const seedContainer = document.getElementById('seed');
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
function showCloudsAndSun() {
    cloudContainers.forEach(cloud => cloud.style.display = 'block');
    sunContainer.style.display = 'block';
}

function showGermination() {
    // Add your germination animation or effect here
}

function brightenSun() {
    sunContainer.style.opacity = '1'; // Brighten sun
}

function growPlant() {
    // Add your plant growing effect here
}

function addFences() {
    fenceContainer.style.display = 'block'; // Show fences
}

function showRain() {
    rainContainer.style.display = 'block'; // Show rain
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
