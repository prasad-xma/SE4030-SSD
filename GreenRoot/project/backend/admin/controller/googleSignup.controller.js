const crypto = require("crypto");
const User = require("../model/userModel.js");
const { hashPassword } = require("../utils/passwordUtils.js");
const { createJWToken, verifySignupToken } = require("../utils/tokenUtils.js");
const { authCookieOptions } = require("./auth.controller.js");
const { signupCookieOptions } = require("./googleAuth.controller.js");

const NAME_PATTERN = /^[A-Za-z\s'-]{1,50}$/;
const PHONE_PATTERN = /^\d{10}$/;

const getGoogleSignup = (req, res) => {
    const signup = verifySignupToken(req.cookies.google_signup);

    if (!signup) {
        return res.status(401).json({ err: "Google sign up session expired. Please try again." });
    }

    res.status(200).json({
        data: {
            email: signup.email,
            firstName: signup.firstName,
            lastName: signup.lastName,
        },
    });
};

const completeGoogleSignup = async (req, res) => {
    const signup = verifySignupToken(req.cookies.google_signup);

    if (!signup) {
        return res.status(401).json({ err: "Google sign up session expired. Please try again." });
    }

    const { firstName, lastName, phone, address } = req.body;

    if ([firstName, lastName, phone, address].some((value) => typeof value !== "string")) {
        return res.status(400).json({ err: "All fields are required!" });
    }

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanAddress = address.trim();

    if (!NAME_PATTERN.test(cleanFirstName) || !NAME_PATTERN.test(cleanLastName)) {
        return res.status(400).json({ err: "Names can only contain letters and must be 1 to 50 characters." });
    }

    if (!PHONE_PATTERN.test(phone)) {
        return res.status(400).json({ err: "Phone number must contain exactly 10 digits!" });
    }

    if (cleanAddress.length < 3 || cleanAddress.length > 200) {
        return res.status(400).json({ err: "Address must be 3 to 200 characters." });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email: signup.email }, { googleId: signup.sub }],
        });

        if (existingUser) {
            res.clearCookie("google_signup", signupCookieOptions);
            return res.status(409).json({ err: "An account already exists for this Google email. Please sign in." });
        }

        const unusablePassword = await hashPassword(crypto.randomBytes(32).toString("hex"));

        const user = await User.create({
            firstName: cleanFirstName,
            lastName: cleanLastName,
            address: cleanAddress,
            phone,
            email: signup.email,
            password: unusablePassword,
            role: "customer",
            googleId: signup.sub,
            authProvider: "google",
        });

        res.clearCookie("google_signup", signupCookieOptions);
        res.cookie("authToken", createJWToken(user._id, user.role), {
            ...authCookieOptions,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            msg: "Account created successfully",
            data: { id: user._id, role: user.role },
        });
    } catch (error) {
        console.error("Google sign up error:", error.message);
        res.status(500).json({ err: "Something went wrong, please try again..." });
    }
};

module.exports = { getGoogleSignup, completeGoogleSignup };
