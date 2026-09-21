import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers;
        if (!dtoken) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        
        // Ensure req.body exists
        if (!req.body) {
            req.body = {};
        }
        
        req.body.docId = token_decode.id;
        next();
    } catch (error) {
        console.log("AuthDoctor error:", error.message);
        res.json({ success: false, isAuthError: true, message: 'Invalid or expired session. Please login again.' });
    }
}

export default authDoctor;
