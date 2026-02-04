import math

# Check if a number n is prime
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

# Compute the greatest common divisor of a and b
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# Find the modular multiplicative inverse of e modulo phi
def mod_inverse(e, phi):
    for d in range(1, phi):
        if (d * e) % phi == 1:
            return d
    return None

# Encrypt a message string msg using public key (e, n)
def encrypt_message(msg, e, n):
    return [pow(ord(c), e, n) for c in msg]

# Decrypt a list of numbers cipher using private key (d, n)
def decrypt_message(cipher, d, n):
    return ''.join(chr(pow(c, d, n)) for c in cipher)
