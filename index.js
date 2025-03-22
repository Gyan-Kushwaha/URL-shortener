const express=require("express");
const path=require("path"); 
const connectMongoDB =require("./connection");
const cookieParser=require('cookie-parser');
const { restrictLoggedInUserOnly,checkAuth }=require('./middleware/auth');
const URL=require("./model/url");
const staticRoute=require('./routes/staticRouter');
const urlRoute=require('./routes/url');
const userRoute=require('./routes/user');

const session = require('express-session');
const dotenv=require('dotenv').config();


const app=express(); 
const port=process.env.PORT

connectMongoDB(process.env.MONGO_URI || "mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));


app.set("view engine","ejs");
app.set('views',path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/url", restrictLoggedInUserOnly,urlRoute);
app.use('/user',userRoute);
app.use('/',checkAuth,staticRoute);

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: true
}));
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); 
    });
});


app.get('/url/:shortId',async (req,res)=>{
   const shortId=req.params.shortId;
   const entry=await URL.findOneAndUpdate({
        shortId,
   },
   {
    $push:{
    visitHistory:{
        timestamp:Date.now(),
    }, 
   },
   }
);
res.redirect(entry.redirestUrl);
});

app.listen(port,()=>console.log(`server started at port no: ${port}`));