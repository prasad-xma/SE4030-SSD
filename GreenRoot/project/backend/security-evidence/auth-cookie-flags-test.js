const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const [email, password] = process.argv.slice(2);

if (!email || !password) {
    console.log("Usage: node auth-cookie-flags-test.js <email> <password>");
    process.exit(1);
}

async function run() {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const cookie = res.headers.get("set-cookie") || "";
    console.log(`Login: HTTP ${res.status}`);
    console.log("Set-Cookie:", cookie);
    console.log("HttpOnly:", /HttpOnly/i.test(cookie));
    console.log("SameSite:", (cookie.match(/SameSite=(\w+)/i) || [])[1] || "not set");
    console.log("Secure:", /;\s*Secure/i.test(cookie));
}

run();
