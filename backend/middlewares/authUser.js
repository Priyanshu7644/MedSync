import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ensure req.body exists (e.g. for GET requests with no body)
        if (!req.body) {
            req.body = {};
        }
        
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("AuthUser error:", error.message);
        res.json({ success: false, isAuthError: true, message: 'Invalid or expired session. Please login again.' });
    }
}

export default authUser;
