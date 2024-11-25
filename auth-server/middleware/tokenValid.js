const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

const tokenValidation = (req,res,next)=>{
    try {
        const token = req.headers['authorization'];
        
        if(token && token.startsWith('Bearer')){
            const actualToken = token.split(' ')[1]
            
            const decoded = jwt.verify(actualToken, JWT_SECRET);
                
                req.user = {id : decoded.userId};
                next()
            
        }else{
            return res.status(403).json({
                success: false,
                message: "Forbidden, no token provided"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({
            success: false,
            message: "Unauthorized access, invalid or expired token"
        })
    }
}
module.exports = {
    tokenValidation
}