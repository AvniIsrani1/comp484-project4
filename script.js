const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
let originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

// Text Options
const options = [
    "The pink flower is beautiful and blooming.",
    "The pizza has olives, chicken, and jalapenos.",
    "The cat leapt onto the couch and took a nap.",
    "The dog wanted to go on a walk and play.",
    "She wanted the dress, but it was too expensive."
]

// Return random text option from options array
function getRandomTextOption() {
    return options[Math.floor(Math.random() * options.length)];
}


// Add leading zero to numbers 9 or below (purely for aesthetics):
function addLeadingZero(num) {
    if (num <= 9) {
        return '0' + num;
    }
    return num;
}


// date formatter
function formatDate(minutes, seconds, hundredths) {
    return addLeadingZero(minutes) + ":" + addLeadingZero(seconds) + ":" + addLeadingZero(hundredths);
}

// Run a standard minute/second/hundredths timer:
let hundredths = 0;
let seconds = 0;
let minutes = 0;

function runTimer() {
    // increment hundreths
    hundredths++;

    // 1 second = 100 hundredths
    if (hundredths >= 100) {
        // reset hundredths and increment seconds
        hundredths = 0;
        seconds++;
    }

    // 1 minute = 60 seconsd
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }

    // update timer text
    theTimer.innerHTML = formatDate(minutes, seconds, hundredths);
}

let errors = 0;
let previous = 0;
let done = false;

// Match the text entered with the provided text on the page:
function matchText() {
    if (testArea.value === originText) {
        // done with test
        clearInterval(timerId);
        started = false;
        done = true;
        testWrapper.style.borderColor = "green";

        // wpm counter
        const total = (minutes * 60) + seconds + (hundredths / 100);
        const wpm = Math.round((originText.length / 5) / (total / 60));
        document.querySelector("#wpm").innerHTML = "WPM: " + wpm;
        saveScore();
    } else if (originText.startsWith(testArea.value)) {
        // check if every character type so far is correct
        testWrapper.style.borderColor = "blue";
    } else {
        if (testArea.value.length > previous) {
            errors++;
            document.querySelector("#typing-errors").innerHTML = "Errors: " + errors;
        }
        testWrapper.style.borderColor = "red";
    }
    previous = testArea.value.length;
}


// Start the timer:
let started = false;
let timerId = null;

function startTimer() {
    if (!started) {
        // update every 10 ms
        timerId = setInterval(runTimer, 10);
        started = true;
    }
}


// Reset everything:
function resetEverything() {
    clearInterval(timerId);
    started = false;
    done = false;
    hundredths = 0;
    seconds = 0;
    minutes = 0;
    errors = 0;
    previous = 0;
    theTimer.innerHTML = "00:00:00";
    testArea.value = "";
    testWrapper.style.borderColor = "grey";
    document.querySelector("#origin-text p").innerHTML = getRandomTextOption();
    originText = document.querySelector("#origin-text p").innerHTML;
    document.querySelector("#wpm").innerHTML = "WPM: ";
    document.querySelector("#typing-errors").innerHTML = "Errors: 0";
}

// Show scores
function showScores() {
    const scores = JSON.parse(localStorage.getItem("scores") || "[]");
    const list = document.querySelector("#top-scores-list");
    list.innerHTML = ""; // clear old list content
    scores.forEach((score) => {
        const _minutes = Math.floor(score / 60);
        const _seconds = Math.floor(score % 60);
        const _hundredths = Math.floor((score % 1) * 100);
        const listItem = document.createElement("li");
        listItem.innerHTML = formatDate(_minutes, _seconds, _hundredths);
        list.appendChild(listItem);
    })
}
// Save scores to localStorage
function saveScore() {
    const total = (minutes * 60) + seconds + (hundredths / 100);
    let scores = JSON.parse(localStorage.getItem("scores") || "[]");
    scores.push(total);
    scores.sort(function (a, b) { return a - b; });
    scores = scores.slice(0, 3);
    localStorage.setItem("scores", JSON.stringify(scores));
    showScores();
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keyup", function () {
    if (!done) {
        startTimer();
        matchText();
    }
})

resetButton.addEventListener("click", resetEverything);

showScores();