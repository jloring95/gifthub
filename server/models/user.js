const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

//runs before save
userSchema.pre('save', async function(next){
    try {
        // gen salt
        const salt = await bcrypt.genSalt(10);
        // gen salt + hash
        const passwordHash = await bcrypt.hash(this.password, salt);
        // console.log('salt', salt);
        // console.log('normal password', this.password);
        // console.log('hashed password', passwordHash);
        this.password = passwordHash;
        next();
    } catch(error) {
        next(error)
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        // comparing the password that is typed in and the stored hashed password, boolean
        return await bcrypt.compare(newPassword, this.password)
    } catch(error) {
        throw new Error(error)
    }
}

const User = mongoose.model('user', userSchema);

module.exports = User;