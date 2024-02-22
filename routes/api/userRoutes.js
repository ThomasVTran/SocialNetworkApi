const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);

    // /api/Thoughts/:thoughtId/friends
router.route('/:thoughtId/friends').post(addFriend);

// /api/Thoughts/:thoughtId/friends/:friendId
router.route('/:thoughtId/friends/:friendId').delete(removeFriend);

module.exports = router;
