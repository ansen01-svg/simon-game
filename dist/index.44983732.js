// Get DOM elements
const startButton = document.getElementById("startGame");
const statusText = document.getElementById("status");
const scoreDisplay = document.getElementById("score");
const colorButtons = document.querySelectorAll(".color-button");
// Colors and Game Variables
const colors = [
    "red",
    "green",
    "blue",
    "yellow"
];
let gameSequence = [];
let userSequence = [];
let score = 0;
let gameStarted = false;
// Frequencies for Mario-style sounds
const marioFrequencies = {
    red: 330,
    green: 440,
    blue: 554,
    yellow: 659
};
// Play a Mario-style tone using Web Audio API
function playMarioSound(color) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    // Set frequency and waveform for retro sound
    oscillator.frequency.setValueAtTime(marioFrequencies[color], audioContext.currentTime);
    oscillator.type = "square"; // Retro 'Mario-like' sound
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); // Lower volume for pleasant sound
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    // Short duration for Mario-like effect
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15); // 150ms sound
}
// Play a "Game Over" sound effect
function playGameOverSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime); // Set appropriate volume
    // Create the first descending tone
    const oscillator1 = audioContext.createOscillator();
    oscillator1.frequency.setValueAtTime(440, audioContext.currentTime); // Start with A4
    oscillator1.frequency.linearRampToValueAtTime(220, audioContext.currentTime + 0.4); // Descend to A3
    oscillator1.type = "square";
    // Create the second descending tone
    const oscillator2 = audioContext.createOscillator();
    oscillator2.frequency.setValueAtTime(330, audioContext.currentTime + 0.4); // Start with E4
    oscillator2.frequency.linearRampToValueAtTime(165, audioContext.currentTime + 0.8); // Descend to E3
    oscillator2.type = "square";
    // Connect oscillators to gain node and destination
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    // Start and stop the oscillators
    oscillator1.start();
    oscillator1.stop(audioContext.currentTime + 0.4);
    oscillator2.start(audioContext.currentTime + 0.4);
    oscillator2.stop(audioContext.currentTime + 0.8);
}
// Start or reset the game
startButton.addEventListener("click", ()=>{
    if (!gameStarted) {
        playMarioSound("green"); // Play Mario-like sound when game starts
        startGame();
    }
});
// Button click event listeners
colorButtons.forEach((button)=>{
    button.addEventListener("click", (event)=>{
        if (!gameStarted) return;
        const color = event.target.id;
        userSequence.push(color);
        playMarioSound(color); // Play sound for the button
        animateButton(color);
        checkUserInput();
    });
});
// Start the game
function startGame() {
    if (gameStarted) return; // Prevent starting if already in progress
    gameStarted = true;
    gameSequence = [];
    userSequence = [];
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    statusText.textContent = "Get Ready!";
    setTimeout(()=>{
        nextSequence();
    }, 1000);
}
// Generate the next sequence
function nextSequence() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    animateSequence();
}
// Animate the sequence
function animateSequence() {
    let index = 0;
    const interval = setInterval(()=>{
        const color = gameSequence[index];
        animateButton(color);
        playMarioSound(color);
        index++;
        if (index === gameSequence.length) {
            clearInterval(interval);
            userSequence = [];
            statusText.textContent = "Your Turn!";
        }
    }, 800);
}
// Check user input
function checkUserInput() {
    const currentIndex = userSequence.length - 1;
    if (userSequence[currentIndex] !== gameSequence[currentIndex]) gameOver();
    else if (userSequence.length === gameSequence.length) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        statusText.textContent = "Correct! Next round...";
        setTimeout(()=>{
            userSequence = [];
            nextSequence();
        }, 1000);
    }
}
// Game Over
function gameOver() {
    statusText.textContent = `Game Over! Final Score: ${score}`;
    scoreDisplay.textContent = `Score: ${score}`;
    playGameOverSound(); // Play the Game Over sound effect
    gameStarted = false;
    gameSequence = [];
    userSequence = [];
}
// Animate the button on click or during sequence
function animateButton(color) {
    const button = document.getElementById(color);
    button.classList.add("active");
    setTimeout(()=>{
        button.classList.remove("active");
    }, 300);
}

//# sourceMappingURL=index.44983732.js.map
