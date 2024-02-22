const { Schema, model } = require('mongoose');

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema(
    {
        username: {
            type: String,
            Unique: true,
            required: true,
            trimmed: true,
        },
        email: {
            type: String,
            required: true,
            Unique: true,
            validate: [validateEmail, 'Please fill a valid email address'],
            match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        thoughts: [Thoughts],
        firends: [User],
    },
);

userSchema
    .virtual('getResponses')
    .get(function () {
        return this.Reactions.length;
    });


const User = model('user', userSchema);

module.exports = User;
