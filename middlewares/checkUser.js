import jwt from 'jsonwebtoken';
import { createCustomError } from '../errors/customError.js';

const checkUser = async (req, res, next)=>{
    const token = req.cookies.token
    const userId_cookie = req.cookies.userid
    //console.log(token, userId_cookie);
    if(token==null || userId_cookie==null){
        res.redirect('/login')
    }
    else{
        try {
            const userId = jwt.verify(token, "project_mate").userid;
            //console.log(jwt.verify(token, "project_mate"));
            req.user = {userid: userId}
            //console.log(userId, adminId_cookie, adminId_cookie != userId)
            if(userId_cookie != userId) {
                res.redirect('/login')
            }
            next();
        } catch (error) {
            res.redirect('/login') 
        }
    }
}

export default checkUser;