const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config')

signToken = (user) => {
    return JWT.sign({
        iss: 'GiftHub',
        sub: user.id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day
    }, JWT_SECRET);
}

module.exports = {
    signUp: async (req, res, next) => {
        //console.log('contents of req.value.body', req.value.body);
        const { email, password } = req.value.body;

        const foundUser = await User.findOne({ email });
        if (foundUser) { 
            return res.status(403).json({error: 'Email is already in use'})
        }


        const newUser = new User({ email, password });
        await newUser.save();
        
        //res.json({user: 'created'})

        // new token
        const token = signToken(newUser);

        res.status(200).json({ token });
    },

    signIn: async (req, res, next) => {
        // access user
        //console.log('req.user', req.user);
        // gerenate token
        
        const token = signToken(req.user);
        res.status(200).json({ token })

        console.log('Successful login!');
        //res.json({ login : "true" })
    },

    dashboard: async (req, res, next) => {
        console.log('I managed to get here!');
        res.json({ secret : "resource" })
    }
}