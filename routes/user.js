const express=require("express");
const {handleUserSignup,handleUserlogin}=require('../controllers/user')
const router=express.Router();

router.post('/', (req, res) => {
    handleUserSignup(req, res);
});

router.post('/login',handleUserlogin);

module.exports =router;