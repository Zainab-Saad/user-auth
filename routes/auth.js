const authController = require ('../controller/auth');

const express = require('express');
const passport = require('passport');

const initializePassport = require('../passportConfig');

const router = express.Router();
initializePassport(passport);

router.use(passport.initialize());
router.use(passport.session());
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/dashboard', authController.getDashboard);
router.get('/', authController.getHome);
router.get('/logout', authController.getLogout);

module.exports = router;