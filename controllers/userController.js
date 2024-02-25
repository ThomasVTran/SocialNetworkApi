const { User, Thought } = require('../models');

module.exports = {
    // Function to get all of the users by invoking the find() method with no arguments.
    // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
    async getUsers(req, res) {
        try {
            const user = await User.find();
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Gets a single user using the findOneAndUpdate method. We pass in the ID of the user and then respond with it, or an error if not found
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // Updates and user using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // Deletes an user from the database. Looks for an app by ID.
    // Then if the app exists, we look for any users associated with the app based on he app ID and update the users array for the User.
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'user successfully deleted!' });
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
    // Adds a friend to a user. This method is unique in that we add the entire body of the friend rather than the ID with the mongodb $addToSet operator.
    async addFriend(req, res) {
        try {
            const newFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!newFriend) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(newFriend);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
    // Remove user friend. This method finds the user based on ID. It then updates the friends array associated with the app in question by removing it's friendId from the friends array.
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },
};
