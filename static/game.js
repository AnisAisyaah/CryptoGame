let timeLeft = 60;
let hintUsed = false;   // Track hint usage

// ====== DIAMONDS SYSTEM ======
let diamonds = parseInt(localStorage.getItem("diamonds")) || 50;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('new_game') === '1') {
    diamonds = 50;
    localStorage.setItem("diamonds", diamonds);
}

function updateDiamondUI() {
    const diamondBox = document.getElementById("diamonds");
    if (diamondBox) diamondBox.innerText = `💎 ${diamonds}`;
}

function deductDiamonds(amount) {
    diamonds -= amount;
    if (diamonds < 0) diamonds = 0;
    localStorage.setItem("diamonds", diamonds);
    updateDiamondUI();

    if (diamonds <= 0) {
        alert("💀 GAME OVER! You ran out of diamonds.");
        localStorage.removeItem("diamonds");
        window.location.href = "/"; // redirect to homepage
    }
}

// ====== TIMER ======
function startTimer() {
    const timer = document.getElementById("timer");
    if (!timer) return;

    updateDiamondUI();

    const interval = setInterval(() => {
        timeLeft--;
        timer.innerText = "⏳ " + timeLeft + "s";

        if (timeLeft <= 10) {
            timer.style.color = "#ff4444";
        } else {
            timer.style.color = "";
        }

        if (timeLeft <= 0) {
            clearInterval(interval);
            alert(`⏱ Time expired! -10 diamonds`);
            deductDiamonds(10);
            if (diamonds > 0) {
                timeLeft = 60; // restart stage
                startTimer();
            }
        }
    }, 1000);
}

// ================= HINT FUNCTION =================
function getHint() {
    if (!hintUsed) {
        timeLeft -= 5;
        hintUsed = true;
        if (timeLeft < 0) timeLeft = 0;
        alert("⏱ Hint used! -5 seconds penalty.");
    }

    const box = document.getElementById("hintBox");
    const stepsDiv = document.getElementById("hintSteps");
    if(box) box.style.display = "block";

    const lower = Math.max(1, kCorrect - 2);
    const upper = kCorrect + 2;

    if(stepsDiv) stepsDiv.innerHTML = `<p>💡 Hint: The correct k is between <b>${lower}</b> and <b>${upper}</b>.</p>`;
}

// ================= TRY K FUNCTION =================
function tryK() {
    const kInput = document.getElementById("kInput");
    const k = parseInt(kInput.value);
    const stepsDiv = document.getElementById("hintSteps");

    if (isNaN(k)) {
        alert("Please enter a valid integer for k.");
        return;
    }

    const numerator = k * phi + 1;
    const d = numerator / e;

    let text = `k = ${k}: ( ${k} × ${phi} + 1 ) ÷ ${e} = ${d}`;

    if (Number.isInteger(d)) {
        text += " ✅ ← d found!";
        if(stepsDiv) stepsDiv.innerHTML = `<p style="color:green; font-weight:bold;">${text}</p>`;
        document.querySelector('input[name="d"]').value = d;
    } else {
        text += " ❌ Not an integer, try another k.";
        if(stepsDiv) stepsDiv.innerHTML = `<p>${text}</p>`;
    }
}

// ====== CONFIRM BACK TO HOMEPAGE ======
function confirmBackToHome(url = "/") {
    const confirmRestart = confirm("⚠️ Are you sure you want to restart?");
    if (confirmRestart) {
        localStorage.setItem("diamonds", 50);
        window.location.href = url;
    }
}

window.onload = startTimer;
