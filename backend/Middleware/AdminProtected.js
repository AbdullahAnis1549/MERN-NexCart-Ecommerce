import jwt from "jsonwebtoken";
import User from "../Models/UserSchema.js";

export const AdminAuthverifyuser = async (req, res, next) => {
    try {
        // Support both custom "token" header and standard Authorization header
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "Please login again."
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.jwtkey);

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "User not found. Please login again."
            });
        }

        // Check admin role
        if (user.role !== "admin") {
            return res.status(403).json({
                status: "fail",
                message: "Access denied. Admin only."
            });
        }

        req.id = user._id;
        req.user = user;

        next();
    } catch (err) {
        console.error(err);

        if (
            err.name === "JsonWebTokenError" ||
            err.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid or expired token."
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};