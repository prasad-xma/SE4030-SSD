const User = require("../model/userModel.js");
const { hashPassword, comparePassword } = require("../utils/passwordUtils.js");
const { createJWToken } = require("../utils/tokenUtils.js");

// Auth cookie flags: HttpOnly keeps the JWT out of reach of JavaScript (XSS),
// Secure sends it over HTTPS only in production, SameSite=Strict blocks CSRF.
const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
};

// nodemailer
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    try {
        const { email, password, confirmPassword, role } = req.body;

        // check if the password is match
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: `Password is not match...` });
        }

        // check if the user already exists
        const isUserexists = await User.findOne({ email });
        if (isUserexists) {
            return res.status(400).json({ err: `User already exists...` });
        }

        // Check if the user is the first user in the database and if it is, update the role to admin
        const isFirstAccount = (await User.countDocuments()) == 0;
        req.body.role = isFirstAccount ? "admin" : role;

        // Hash the password
        const hashedPassword = await hashPassword(password);
        req.body.password = hashedPassword; // Set the password as hashed password

        // Create new user
        const user = await User.create(req.body);

        // send a welcome email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to GreenRoots',
            html: `
            <h1>Welcome to GreenRoots!</h1>
            <p>Hello ${user.firstName} ${user.lastName},</p>
            <p>We're excited to have you on board. Thank you for joining us!</p>
            <p>Best regards,</p>
            <p><strong>The GreenRoots Team</strong></p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json({
            msg: `User registered successfully`,
            data: user,
        });
    } catch (error) {
        res.status(400).json({ err: "Server error during Registration..." });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ err: `Email and password are required!` });
        }

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ err: `User not found!` });
        }

        // match the password
        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ err: `Invalid password!` });
        }

        // create a token with id and role
        const token = createJWToken(user._id, user.role);

        if (!token) {
            return res.status(500).json({ err: `Failed to generate token!` });
        }

        // set the token into a  cookie
        res.cookie("authToken", token, {
            ...authCookieOptions,
            maxAge: 24 * 60 * 60 * 1000,
        });

        // success message with the user data
        res.status(200).json({
            msg: "login successful!",
            data: { id: user._id, role: user.role },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ err: "Something went wrong, please try again..." });
    }
};

const logout = (req, res) => {
    try {
        // clear the cookie
        res.clearCookie("authToken", authCookieOptions);

        res.status(200).json({ msg: `Logout successful!` });
    } catch (error) {
        res.status(500).json({ err: `Something went wrong. Please try again` });
    }
};

// return the logged in user's id and role (the token itself is HttpOnly and cannot be read by the frontend)
const getCurrentUser = (req, res) => {
    res.status(200).json({ data: { id: req.user.userId, role: req.user.role } });
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
};
