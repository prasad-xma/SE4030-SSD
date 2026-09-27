const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ATTEMPTS = 8;

async function run() {
    for (let i = 1; i <= ATTEMPTS; i++) {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "victim@example.com", password: `wrong-password-${i}` }),
        });
        const body = await res.json().catch(() => ({}));
        console.log(`Attempt ${i}: HTTP ${res.status} ->`, body);
    }
}

run();
