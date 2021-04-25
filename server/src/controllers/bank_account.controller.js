const BankAccount = require('../models/bank_account.model');
const isValidUserPassportID = require('../utils/is_valid_passport_id');


const getAllAcounts = async (req, res) => {
    try {
        const result = await BankAccount.find({});

        return res.status(200).send(result);
    } catch (err) {

        return res.status(400).send(err);
    }
}

const getAccountBypassportID = async (req, res) => {
    const passportID = req.params.passportID;

    try {
        const result = await BankAccount.find({ passportID });

        return res.status(200).send(result);
    } catch (err) {

        return res.status(400).send(err);
    }
}

const addUserAccount = async (req, res) => {
    const newAccount = req.body;

    const isValid = await isValidUserPassportID(newAccount.passportID);
    const bankAccount = new BankAccount(newAccount);
    
    try {
        if (isValid) {
            const isValidAccountNumber = await BankAccount.find({ passportID: newAccount.passportID, accountNumber: newAccount.accountNumber });
            if (isValidAccountNumber.length != 0) {
                return res.status(400).send('Account number already exist!');
            }
            await bankAccount.save();
            return res.status(201).send(bankAccount);
        }
        else {
            return res.status(404).send('Invalid user passport ID!')
        }

    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports = {
    getAllAcounts,
    getAccountBypassportID,
    addUserAccount
}