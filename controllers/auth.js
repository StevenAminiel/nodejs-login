//'use strict';
const { json } = require("body-parser");
const mysql=require('mysql');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, //Enter host here
    user: process.env.DATABASE_USER, //Enter the user here
    password: process.env.DATABASE_PASS, //Enter the password here
    database: process.env.DATABASE    //Enter the database name here
});

exports.login= async (req,res)=>{
    try {
         const {email , password} = req.body;

         if(!email || !password) {
             return res.status(400).render('login',{
                 message :'please provide an email and password'
             })
         }

         db.query('SELECT * FROM users WHERE email=?',[email], async(error,result)=>{
            console.log(result);
             
            if(!result || !(await bcrypt.compare(password,result[0].password)))
             res.status(401).render('login',{
                 message:'Email or Password is incorrect',
             }) 
            else{
                const id=result[0].id;
                const token =jwt.sign({id:id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                });

                console.log("The token is"+ token);

                const cookieOptions = {
                    expires : new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt',token,cookieOptions);
                res.status(200).redirect('/loginconf');
            }
         })

    } catch (error){
        console.log(error);
        
    }
}


exports.register=(req,res)=>{
    const {name,email,password,passwordconfirm} = req.body;
    db.query('SELECT email FROM users WHERE email = ?',[email],async(error,result)=>{
        if(error){
            return error;
        }
        if(result.length > 0){
            return res.render('register',{
                message : "Email is already registered."
            });
        } 
        else if(password !== passwordconfirm){
            return res.render('register',{
                message : "Please enter the correct password."
            });
        }

        let hashedPassword = await bcrypt.hash(password,8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?',{name:name,email:email,password:hashedPassword},(error,result)=>{
            if(error){
                console.log(error);
            } else {
                return res.render('register',{
                    message:"User Registered."
                });
            }
        });

    });
    
}