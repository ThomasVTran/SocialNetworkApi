const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: string,
            required: true,
        },
        reactions: [Reaction],
    },
);

thoughtSchema
    .virtual('getResponses')
    // Getter
    .get(function () {
        return this.Reactions.length;
    });


const Thought = model('thought', thoughtSchema);

module.exports = Thought;
