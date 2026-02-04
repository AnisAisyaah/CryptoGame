# 🛡️ RSA Game

A web-based educational game that teaches the **RSA cryptosystem** through interactive stages: selecting primes, generating keys, encrypting, and decrypting messages. Players can compete for the fastest completion time on a leaderboard.  


## **Installation**

1. Clone the repository:

```bash
git clone https://github.com/yourusername/rsa-game.git
cd rsa-game


python -m venv venv
venv\Scripts\activate    
pip install flask
python app.py

```

## Run > Open:
👉 http://127.0.0.1:5000


# Example Game Flow

## **Stage 1 – Select Primes**
    -List Prime Num:  [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
    -Cards displayed 10, 4 of 10 are prime : [4, 7, 10, 13, 15, 17, 20, 19, 22, 23]
    -Player selects 7 and 13.

## **Stage 2 – Key Generation**

    p = 7, q = 13

    n = 91

    φ(n) = 72

    Player chooses e = 5 → Backend computes d = 29.

## **Stage 3 – Encrypt Message**

    Message: "HELLO"

    Encrypted: [57, 43, 29, 29, 53]

## **Stage 4 – Decrypt Message**

    Player enters d = 29 → Decrypted: "HELLO"

    Time taken is recorded.

    Leaderboard

    Save player name and time.

    Top 10 fastest times are displayed.
