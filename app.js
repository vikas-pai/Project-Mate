import express from 'express'
import path from 'path';
import cookieparser from 'cookie-parser'
const __dirname = path.resolve();
const app = express();


import cors from 'cors'
app.use(cors());


import connection from './database.js';
import errorHandlerMiddleware from './middlewares/errorHandler.js';
import notFoundMiddleware from './middlewares/not-found.js';
import authRouter from './routes/authRoutes.js'
import otherRouter from './routes/otherRoutes.js'
import checkUser from './middlewares/checkUser.js';


const port = 5000;
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieparser())
app.set('view engine', 'ejs');
app.use('/api/v1/auth',authRouter );
app.get('/login', (req,res)=>{
    res.render('login',{});
})

app.get('/signup', (req,res)=>{
    res.render('signup',{});
})
app.get('*',checkUser)
app.post('*',checkUser)
app.delete('*',checkUser)
app.patch('*',checkUser)

app.get('/',(req,res)=>{
    req.cookies.token
    res.render('main',{})

})
app.get('/issue/:id',(req,res)=>{
    res.render('issue',{})

})
app.get('/projects/',(req,res)=>{
    res.render('projects',{})

})
app.get('/project/:id',(req,res)=>{
    res.render('projectEdit',{})

})
app.use('/api/v1/', otherRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.listen(port,function(){
    console.log(`App is listening on port ${port} `);
    connection.connect(function(err){
        if(err) throw err;
        console.log("Connected");
    })
});