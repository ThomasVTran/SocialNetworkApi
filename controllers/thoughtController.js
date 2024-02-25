const { Thought, User } = require('../models');

module.exports = {
    // Function to get all of the thoughts by invoking the find() method with no arguments.
    // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
    // Gets a single thought using the findOneAndUpdate method. We pass in the ID of the thought and then respond with it, or an error if not found
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Creates a new thought. Accepts a request body with the entire thought object.
    // Because thoughts are associated with Users, we then update the User who created the app and add the ID of the thought to the thoughts array
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but found no user with that ID',
                })
            }

            res.json('Created the thought');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // Updates and thought using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // Deletes an thought from the database. Looks for an app by ID.
    // Then if the app exists, we look for any users associated with the app based on he app ID and update the thoughts array for the User.
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created but no user with this id!',
                });
            }

            res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
    // Adds a reaction to a thought. This method is unique in that we add the entire body of the reaction rather than the ID with the mongodb $addToSet operator.
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Remove thought reaction. This method finds the thought based on ID. It then updates the reactions array associated with the app in question by removing it's reactionId from the reactions array.
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(Thought);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
};
