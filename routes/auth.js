'use strict';
const express=require('express');
const authControllet=require('../controllers/auth');
const router=express.Router();

router.post('/register', authControllet.register);
router.post('/login',authControllet.login);

module.exports = router;

