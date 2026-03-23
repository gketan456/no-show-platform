import jwt from 'jsonwebtoken';

export const requireAuth = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                status:401,
                message: "No token provided"
            })
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } 
    catch(err){
        return res.status(401).json({
            status:401,
            message: "Invalid token"
        });
    }
};

export const requireRole = (role)=>{
    return(req,res,next)=>{
        if(req.user.role !== role){
            return res.status(403).json({
                status:403,
                message: "access denied"
            });
        }
        next();
    }
}