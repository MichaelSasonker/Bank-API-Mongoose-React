const BankAccount = require('../models/bank_account.model');

const isActiveBankAccount = async (passportID) => {

    try {
        const result = await BankAccount.findOne({ passportID });
        if (result === null || !result.isActive) {
            return false;
        }
        return true;
    } catch (err) {
        throw new Error('Something wents wrong!');
    }
}

module.exports = isActiveBankAccount;
