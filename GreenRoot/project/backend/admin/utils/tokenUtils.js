const jwt = require('jsonwebtoken');

const createJWToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
}

// verify the token
const verifyJWT = (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        return payload;

    } catch (error) {
        return null;
    }
}

const signupSecret = () => `${process.env.JWT_SECRET}.google-signup`;

const createSignupToken = (data) => {
    return jwt.sign(data, signupSecret(), { expiresIn: "15m" });
}

const verifySignupToken = (token) => {
    try {
        return jwt.verify(token, signupSecret(), { algorithms: ["HS256"] });
    } catch (error) {
        return null;
    }
}

module.exports = { createJWToken, verifyJWT, createSignupToken, verifySignupToken };