import jwt from "jsonwebtoken"

export const Authverifyuser = async (req, res,next) => {
    try {
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token. Please login again."
            })
        }
        const verifytoken = await jwt.verify(token, process.env.jwtkey)

        console.log(verifytoken)
        const id = verifytoken.id;
        req.id = id;
        next();

    } catch (err) {
        return res.status(401).json({
            status: "fail",
            message: "Invalid or expired token"
        })
    }
}