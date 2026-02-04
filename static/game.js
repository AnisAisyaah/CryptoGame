let timeLeft = 60;

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

window.onload = startTimer;
