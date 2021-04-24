const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const BankAccount = require('../models/bank_account.model');
const isValidUserPassportID = require('../utils/is_valid_passport_id');
const isPositiveInt = require('../utils/is_positive_int_function');
const isActiveBankAccount = require('../utils/is_active_bank_account');

const getAllTransactions = async (req, res) => {
    try {
        const result = await Transaction.find({});
        if (result === null) {
            return res.status(404).send();
        }
        return res.status(200).send(result);
    } catch (err) {
        return res.status(400).send(err);
    }
}

const getTransactionsByPassportID = async (req, res) => {
    const passportID = req.params.passportID;

    try {
        const srcResult = await Transaction.find({ srcPassportID: passportID });
        const dstResult = await Transaction.find({ dstPassportID: passportID });

        if (srcResult === null && dstResult === null) {
            return res.status(404).send();
        }
        else if (srcResult === null) {
            return res.status(200).send(dstResult);
        }
        else if (dstResult === null) {
            return res.status(200).send(srcResult);
        }

        return res.status(200).send(srcResult + dstResult);
    } catch (err) {

        return res.status(400).send(err);
    }
}

const addTransaction = async (req, res) => {
    const newTransaction = req.body;
    // console.log(newTransaction);

    const isActive = await isActiveBankAccount(newTransaction.srcPassportID);
    // console.log(isValidSrc);
    // const isValidDst = await isValidUserPassportID(newTransaction.dstPassportID);
    const operation = newTransaction.operationType;
    // console.log(operation)
    // const transaction = new Transaction(newTransaction);
    if (!isActive || !isPositiveInt(newTransaction.amount)) {
        return res.status(404).send();
    }
    // else if (!isPositiveInt(newTransaction.amount)) {
    //     // console.log('hher');
    //     res.status(404).send();
    // }

    try {
        let userBankAccount;
        switch (operation) {
            case 'depositing':
                if (newTransaction.srcAccountNumber !== undefined) {
                    userBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber },
                        { $inc: {cash: +newTransaction.amount} }, {new: true, runValidators: true });
                } else {
                    userBankAccount = await BankAccount.findOneAndUpdate(
                    { passportID: newTransaction.srcPassportID, accountNumber: 1 },
                    { $inc: {cash: newTransaction.amount} }, {new: true, runValidators: true });
                }

                if (!userBankAccount) {
                    return res.status(404).send();
                } else {
                    const transaction = new Transaction(newTransaction);
                    await transaction.save();
                    return res.status(201).send(transaction);
                }

            case 'update_credit':
                if (newTransaction.srcAccountNumber !== undefined) {
                    userBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber },
                        { $set: {credit: newTransaction.amount} }, {new: true, runValidators: true });
                } else {
                    userBankAccount = await BankAccount.findOneAndUpdate(
                    { passportID: newTransaction.srcPassportID, accountNumber: 1 },
                    { $set: {credit: newTransaction.amount} }, {new: true, runValidators: true });
                }

                if (!userBankAccount) {
                    return res.status(404).send();
                } else {
                    const transaction = new Transaction(newTransaction);
                    await transaction.save();
                    return res.status(201).send(transaction);
                }

            case 'withdraw':
                if (newTransaction.srcAccountNumber !== undefined) {
                    const oldUserBankAccount = await BankAccount.findOne({ passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber });
                    if (!oldUserBankAccount) {
                        return res.status(404).send();
                    }
                    else if (oldUserBankAccount.cash - newTransaction.amount < (-1) * oldUserBankAccount.credit) {
                        return res.status(200).send('You need to increase your credit!');
                    }
                    userBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber },
                        { $inc: {cash: -newTransaction.amount} }, {new: true, runValidators: true });
                } else {
                    const oldUserBankAccount = await BankAccount.findOne({ passportID: newTransaction.srcPassportID, accountNumber: 1 });
                    if (!oldUserBankAccount) {
                        return res.status(404).send();
                    }
                    else if (oldUserBankAccount.cash - newTransaction.amount < (-1) * oldUserBankAccount.credit) {
                        return res.status(200).send('You need to increase your credit!');
                    }
                    userBankAccount = await BankAccount.findOneAndUpdate(
                    { passportID: newTransaction.srcPassportID, accountNumber: 1 },
                    { $inc: {cash: -newTransaction.amount} }, {new: true, runValidators: true });
                }

                if (!userBankAccount) {
                    return res.status(404).send();
                } else {
                    const transaction = new Transaction(newTransaction);
                    await transaction.save();
                    return res.status(201).send(transaction);
                }

            default:
                return res.status(404).send();

        }
        // if ((isValidSrc && isValidDst) && (newTransaction.srcPassportID !== newTransaction.dstPassportID)) {
        //     await transaction.save();
        //     res.status(201).send(transaction);
        // }
        // else {
        //     res.status(404).send(err);
        // }

    } catch (err) {

        return res.status(400).send(err);
    }
}

module.exports = {
    getAllTransactions,
    getTransactionsByPassportID,
    addTransaction
}