const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [Reaction],
    },
    {
        toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
}
);

thoughtSchema
    .virtual('getReactions')
    // Getter
    .get(function () {
        return this.reactions.length;
    });


const Thought = model('thought', thoughtSchema);

module.exports = Thought;
