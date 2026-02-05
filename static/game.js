let timeLeft = 60;
let hintUsed = false;   // Track hint usage



function startTimer() {
    const timer = document.getElementById("timer");

    if (!timer) return;

    const interval = setInterval(() => {
        timeLeft--;
        timer.innerText = "⏳ " + timeLeft + "s";

        if (timeLeft <= 10) {
            timer.style.color = "#ff4444";
        }

        if (timeLeft <= 0) {
            clearInterval(interval);
            alert("💥 SYSTEM LOCKED! Time expired.");
            window.location.href = "/";
        }
    }, 1000);
}

// ================= HINT FUNCTION =================
// Changed: now user inputs k, JS calculates d and shows result
function getHint() {
    // Penalty only once
    if (!hintUsed) {
        timeLeft -= 5;   // -5 seconds
        hintUsed = true;

        if (timeLeft < 0) timeLeft = 0;

        alert("⏱ Hint used! -5 seconds penalty.");
    }

    const box = document.getElementById("hintBox");
    const stepsDiv = document.getElementById("hintSteps");
    box.style.display = "block";

    // Show range around the correct k:
    const lower = Math.max(1, kCorrect - 2);
    const upper = kCorrect + 2;

    stepsDiv.innerHTML = `<p>💡 Hint: The correct k is between <b>${lower}</b> and <b>${upper}</b>.</p>`;
}

// k try function remains the same, using phi and e global constants

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
        stepsDiv.innerHTML = `<p style="color:green; font-weight:bold;">${text}</p>`;
        // Auto-fill the d input box with found d
        document.querySelector('input[name="d"]').value = d;
    } else {
        text += " ❌ Not an integer, try another k.";
        stepsDiv.innerHTML = `<p>${text}</p>`;
    }
}


window.onload = startTimer;
