const User = require('../models/user.model');
const BankAccount = require('../models/bank_account.model');
const isValidUserPassportID = require('../utils/is_valid_passport_id');

// const isValidUserPassportID = async (passportID) => {

//     try {
//         const result = await User.findOne({ passportID });
//         if (result === null) {
//             return false;
//         }
//         return true;
//     } catch (err) {
//         throw new Error('Something wents wrong!');
//     }
// }

const getAllAcounts = async (req, res) => {
    try {
        const result = await BankAccount.find({});

        res.status(200).send(result);
    } catch (err) {

        res.status(400).send(err);
    }
}

const getAccountBypassportID = async (req, res) => {
    const passportID = req.params.passportID;

    try {
        const result = await BankAccount.find({ passportID });

        res.status(200).send(result);
    } catch (err) {

        res.status(400).send(err);
    }
}

const addUserAccount = async (req, res) => {
    const newAccount = req.body;

    const isValid = await isValidUserPassportID(newAccount.passportID);
    const bankAccount = new BankAccount(newAccount);
    
    try {
        if (isValid) {
            await bankAccount.save();
            res.status(201).send(bankAccount);
        }
        else {
            res.status(404).send(err)
        }

    } catch (err) {

        res.status(400).send(err);
    }
}

module.exports = {
    getAllAcounts,
    getAccountBypassportID,
    addUserAccount
}