const crypto = require("crypto");
const { OAuth2Client, CodeChallengeMethod } = require("google-auth-library");
const User = require("../model/userModel.js");
const { createJWToken } = require("../utils/tokenUtils.js");
const { authCookieOptions } = require("./auth.controller.js");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const oauthCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google",
};

const getClient = () =>
    new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

const redirectWithError = (res, reason) => {
    res.redirect(`${FRONTEND_URL}/auth/login?error=${reason}`);
};

const isSameState = (a, b) => {
    if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
        return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const googleLogin = async (req, res) => {
    try {
        const client = getClient();
        const state = crypto.randomBytes(32).toString("hex");
        const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();

        res.cookie("oauth_state", state, { ...oauthCookieOptions, maxAge: 10 * 60 * 1000 });
        res.cookie("oauth_verifier", codeVerifier, { ...oauthCookieOptions, maxAge: 10 * 60 * 1000 });

        const url = client.generateAuthUrl({
            scope: ["openid", "email", "profile"],
            state,
            code_challenge_method: CodeChallengeMethod.S256,
            code_challenge: codeChallenge,
            prompt: "select_account",
        });

        res.redirect(url);
    } catch (error) {
        console.error("Google login error:", error.message);
        redirectWithError(res, "google_failed");
    }
};

const googleCallback = async (req, res) => {
    const { code, state, error } = req.query;
    const savedState = req.cookies.oauth_state;
    const codeVerifier = req.cookies.oauth_verifier;

    res.clearCookie("oauth_state", oauthCookieOptions);
    res.clearCookie("oauth_verifier", oauthCookieOptions);

    if (error || typeof code !== "string") {
        return redirectWithError(res, "google_cancelled");
    }

    if (!isSameState(state, savedState) || !codeVerifier) {
        return redirectWithError(res, "google_state");
    }

    try {
        const client = getClient();
        const { tokens } = await client.getToken({ code, codeVerifier });

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload.email || !payload.email_verified) {
            return redirectWithError(res, "google_email");
        }

        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return redirectWithError(res, "google_no_account");
        }

        if (user.status && user.status !== "active") {
            return redirectWithError(res, "google_inactive");
        }

        const token = createJWToken(user._id, user.role);
        res.cookie("authToken", token, {
            ...authCookieOptions,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.redirect(`${FRONTEND_URL}/auth/google/success`);
    } catch (err) {
        console.error("Google callback error:", err.message);
        redirectWithError(res, "google_failed");
    }
};

module.exports = { googleLogin, googleCallback };
