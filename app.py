from flask import Flask, render_template, request, redirect, session, jsonify
from rsa_utils import *  # Import RSA helper functions
import json, time

app = Flask(__name__)
app.secret_key = "rsa_game_secret"  # Needed for sessions

# Load the leaderboard from JSON file
def load_leaderboard():
    with open("leaderboard.json", "r") as f:
        return json.load(f)

# Save the leaderboard to JSON file
def save_leaderboard(data):
    with open("leaderboard.json", "w") as f:
        json.dump(data, f, indent=4)

# Render the main index page
@app.route("/")
def index():
    return render_template("index.html")

# Stage 1: User selects two prime numbers
@app.route("/stage1", methods=["GET", "POST"])
def stage1():
    if request.method == "POST":
        p = int(request.form["p"])
        q = int(request.form["q"])
        if is_prime(p) and is_prime(q) and p != q:
            session["p"], session["q"], session["start_time"] = p, q, time.time()
            return redirect("/stage2")
        else:
            return render_template("stage1.html", error="Both numbers must be DIFFERENT primes!")
    return render_template("stage1.html")

# Stage 2: Compute n, φ(n) and ask player to choose e
@app.route("/stage2", methods=["GET", "POST"])
def stage2():
    p, q = session["p"], session["q"]
    n, phi = p*q, (p-1)*(q-1)
    valid_e = [e for e in range(3, phi, 2) if gcd(e, phi) == 1]
    if request.method == "POST":
        e = int(request.form["e"])
        d = mod_inverse(e, phi)
        session["n"], session["e"], session["d"] = n, e, d
        return redirect("/stage3")
    return render_template("stage2.html", n=n, phi=phi, valid_e=valid_e)

# Stage 3: User enters a plain text
@app.route("/stage3", methods=["GET", "POST"])
def stage3():
    if request.method == "POST":
        msg = request.form["message"]
        encrypted = encrypt_message(msg, session["e"], session["n"])
        session["encrypted"] = encrypted
        return redirect("/stage4")
    return render_template("stage3.html")

# Stage 4: User guess number d to break the code
@app.route("/stage4", methods=["GET", "POST"])
def stage4():
    encrypted = session["encrypted"]
    p = session["p"]
    q = session["q"]
    phi = (p - 1) * (q - 1)
    e = session["e"]
    d = session["d"]

    # Calculate the correct k for hint range
    k_correct = (d * e - 1) // phi

    if request.method == "POST":
        try:
            d_input = int(request.form["d"])
        except (ValueError, TypeError):
            return render_template(
                "stage4.html",
                encrypted=encrypted,
                error="Invalid private key input!",
                phi=phi,
                e=e,
                k_correct=k_correct
            )

        if d_input == d:
            decrypted = decrypt_message(encrypted, d, session["n"])
            total_time = round(time.time() - session["start_time"], 2)
            session["final_time"] = total_time
            return render_template(
                "stage4.html",
                encrypted=encrypted,
                success=True,
                decrypted=decrypted,
                time_taken=total_time,
                phi=phi,
                e=e,
                k_correct=k_correct
            )
        else:
            return render_template(
                "stage4.html",
                encrypted=encrypted,
                error="Wrong private key!",
                phi=phi,
                e=e,
                k_correct=k_correct
            )

    return render_template(
        "stage4.html",
        encrypted=encrypted,
        phi=phi,
        e=e,
        k_correct=k_correct
    )


# Save the player's score to the leaderboard
@app.route("/save_score", methods=["POST"])
def save_score():
    name = request.form["name"]
    time_taken = session["final_time"]
    leaderboard = load_leaderboard()
    leaderboard.append({"name": name, "time": time_taken})
    leaderboard = sorted(leaderboard, key=lambda x: x["time"])[:10]  # Keep top 10
    save_leaderboard(leaderboard)
    return redirect("/leaderboard")

# Render the leaderboard page
@app.route("/leaderboard")
def leaderboard():
    data = load_leaderboard()
    return render_template("leaderboard.html", leaderboard=data)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
