const User = require('../models/user.model');

const getUsers = async (req, res) => {
    try {
        const result = await User.find({});
        return res.status(200).send(result);
    } catch (err) {
        return res.status(400).send(err);
    }
}

const getUserByPassportID = async (req, res) => {
    const passportID = req.params.passportID;
    try {
        const result = await User.findOne({ passportID });
        if (!result) {
            return res.status(404).send();
        }

        return res.status(200).send(result);
    } catch (err) {
        return res.status(400).send(err);
    }
}

const addUser = async (req, res) => {
    const newUser = req.body;
    const user = new User(newUser);
    
    try {
        await user.save();

        return res.status(201).send(user);
    } catch (err) {

        return res.status(400).send(err);
    }
}

module.exports = {
    getUsers,
    getUserByPassportID,
    addUser,
}