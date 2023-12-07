// script.js

document.addEventListener("DOMContentLoaded", function () {
    const puzzleContainer = document.getElementById("puzzle-container");
    const timerElement = document.getElementById("timer");
    const pauseButton = document.getElementById("pauseButton");
    const resumeButton = document.getElementById("resumeButton");
    const settingsIcon = document.getElementById("settingsIcon");
    const messageElement = document.getElementById("message");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const swipeSwooshSound = document.getElementById("swipeSwooshSound");

    let startTime;
    let timerInterval;
    let isPaused = false;
    let elapsedTime = 0;

    const numbers = [...Array(16).keys()].slice(1);
    numbers.push(null);

    const shuffledNumbers = shuffle(numbers);

    shuffledNumbers.forEach((number) => {
        const piece = document.createElement("div");
        piece.className = number === null ? "puzzle-piece empty-piece" : "puzzle-piece";
        piece.textContent = number;
        piece.addEventListener("click", () => movePiece(number));
        puzzleContainer.appendChild(piece);
    });

    function startTimer() {
        startTime = new Date().getTime() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (!isPaused) {
            const currentTime = new Date().getTime();
            elapsedTime = currentTime - startTime;
            const seconds = Math.floor(elapsedTime / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            timerElement.textContent = `Time: ${formatTime(minutes)}:${formatTime(remainingSeconds)}`;
        }
    }

    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    function movePiece(number) {
        if (!isPaused) {
            const emptyPiece = document.querySelector(".empty-piece");
            const currentPiece = Array.from(emptyPiece.parentNode.children).indexOf(emptyPiece);
            const targetPiece = Array.from(puzzleContainer.children).indexOf(event.target);

            if (isAdjacent(currentPiece, targetPiece)) {
                // Play swipe swoosh sound effect
                swipeSwooshSound.currentTime = 0;
                swipeSwooshSound.play();

                [emptyPiece.textContent, event.target.textContent] = [event.target.textContent, emptyPiece.textContent];
                emptyPiece.classList.remove("empty-piece");
                event.target.classList.add("empty-piece");

                if (isPuzzleSolved()) {
                    clearInterval(timerInterval);
                    displayMessage("Congratulations! You win!\nTime: " + timerElement.textContent);
                }
            }

            if (!timerInterval) {
                startTimer();
            }
        }
    }

    function isAdjacent(index1, index2) {
        return (
            (Math.abs(index1 - index2) === 1 && Math.floor(index1 / 4) === Math.floor(index2 / 4)) ||
            Math.abs(index1 - index2) === 4
        );
    }

    function isPuzzleSolved() {
        const pieces = Array.from(puzzleContainer.children);
        return pieces.every((piece, index) => piece.textContent == index + 1 || piece.textContent === "");
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    pauseButton.addEventListener("click", function () {
        clearInterval(timerInterval);
        isPaused = true;
        pauseBackgroundMusic();

        puzzleContainer.querySelectorAll(".puzzle-piece").forEach(piece => {
            piece.style.pointerEvents = "none";
        });
    });

    resumeButton.addEventListener("click", function () {
        if (!isPuzzleSolved()) {
            startTimer();
            isPaused = false;
            playBackgroundMusic();

            puzzleContainer.querySelectorAll(".puzzle-piece").forEach(piece => {
                piece.style.pointerEvents = "auto";
            });
        }
    });

    settingsIcon.addEventListener("click", function () {
        showSettingsModal();
    });

    function showSettingsModal() {
        const modal = document.createElement("div");
        modal.classList.add("settings-modal");

        modal.innerHTML = `
            <h2>Settings</h2>
            <label for="volume">Volume:</label>
            <input type="range" id="volume" min="0" max="1" step="0.1" value="${backgroundMusic.volume}">
            <br>
            <label for="mute">Mute:</label>
            <input type="checkbox" id="mute" ${backgroundMusic.muted ? "checked" : ""}>
            <br>
            <button id="closeSettings">&#10006;</button>
        `;

        document.body.appendChild(modal);

        const volumeInput = document.getElementById("volume");
        const muteCheckbox = document.getElementById("mute");
        const closeSettingsButton = document.getElementById("closeSettings");

        volumeInput.addEventListener("input", function () {
            backgroundMusic.volume = parseFloat(volumeInput.value);
        });

        muteCheckbox.addEventListener("change", function () {
            backgroundMusic.muted = muteCheckbox.checked;
        });

        closeSettingsButton.addEventListener("click", function () {
            document.body.removeChild(modal);
        });
    }

    function displayMessage(message) {
        messageElement.textContent = message;
        messageElement.style.backgroundColor = "#424242";
        messageElement.style.color = "#f6a42c";
    }

    // Load the background music and wait for user interaction to play
    document.addEventListener("click", function startBackgroundMusic() {
        playBackgroundMusic();
        document.removeEventListener("click", startBackgroundMusic); // Remove the event listener after interaction
    });
});

function playBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.load(); // Load the audio
    backgroundMusic.play().then(_ => {
        // Autoplay successful
    }).catch(error => {
        // Autoplay was prevented
        console.error("Autoplay prevented. Please interact with the page to allow autoplay.");
    });
}

function pauseBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    if (!backgroundMusic.paused) {
        backgroundMusic.pause();
    }
}
// script.js

// ... (remaining code)
