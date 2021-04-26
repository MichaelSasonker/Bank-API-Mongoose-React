const User = require('../models/user.model');

const isValidUserPassportID = async (passportID) => {

    try {
        const result = await User.findOne({ passportID });
        if (result === null) {
            return false;
        }
        return true;
    } catch (err) {
        throw new Error('Something wents wrong!');
    }
}

module.exports = isValidUserPassportID;
