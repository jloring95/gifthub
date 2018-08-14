const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { JWT_SECRET } = require('./config');
const User = require('./models/user')

// JSON WEB TOKENS STRAT
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        //find user specified in token 
        const user = await User.findById(payload.sub);

        if (!user) {
            return done(null, false);
        };
        
        // return user
        done(null, user)        
    } catch(error) {
        done(error, false)
    }

}));

// LOCAL STRAT  
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        //find user by email
        const user = await User.findOne({ email });
        
        if (!user){
            return done(null, false)
        };

        //check for pw
        const isMatch = await user.isValidPassword(password);

        if(!isMatch) {
            return done(null, false);
        }

        // no error, return user
        done(null, user);
    } catch(error) {
        // return error don't return user
        done(error, false)
    }
}));