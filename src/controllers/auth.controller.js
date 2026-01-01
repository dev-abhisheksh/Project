import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};


const registerUser = async (req, res) => {
    try {
        let { fullName, email, password, confirmPass } = req.body;

        if (!fullName || !email || !password || !confirmPass) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPass) {
            return res.status(400).json({ message: "Passwords must match" });
        }

        email = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName: fullName.trim(),
            email,
            password: hashedPassword,
            role: "user",
        });

        return res.status(201).json({
            message: "User registered successfully. Please login.",
        });
    } catch (error) {
        console.error("Registration failed:", error);
        return res.status(500).json({ message: "Registration failed" });
    }
};

const loginWithPassword = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" })

        email = email.trim().toLowerCase()

        const existingUser = await User.findOne({ email }).select("+password")
        if (!existingUser) return res.status(404).json({ message: "User not found. Please Sign up" })

        const isPasswordValid = await bcrypt.compare(password, existingUser?.password)
        if (!isPasswordValid) return res.status(400).json({ message: "Incorrect Email or Password" })

        const accessToken = generateAccessToken(existingUser)
        const refreshToken = generateRefreshToken(existingUser)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: "Login successful",
            accessToken,
        });
    } catch (error) {
        console.error("Failed to login user", error)
        return res.status(500).json({ message: "Failed to login user" })
    }
}

export {
    registerUser,
    loginWithPassword
}