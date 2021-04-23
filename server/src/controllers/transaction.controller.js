const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const BankAccount = require('../models/bank_account.model');
const isValidUserPassportID = require('../utils/is_valid_passport_id');

const getAllTransactions = async (req, res) => {
    try {
        const result = await Transaction.find({});
        if (result === null) {
            res.status(404).send();
        }
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
}

const getTransactionsByPassportID = async (req, res) => {
    const passportID = req.params.passportID;

    try {
        const srcResult = await Transaction.find({ srcPassportID: passportID });
        const dstResult = await Transaction.find({ dstPassportID: passportID });

        if (srcResult === null && dstResult === null) {
            res.status(404).send();
        }
        else if (srcResult === null) {
            res.status(200).send(dstResult);
        }
        else if (dstResult === null) {
            res.status(200).send(srcResult);
        }

        res.status(200).send(srcResult + dstResult);
    } catch (err) {

        res.status(400).send(err);
    }
}
// TODO: create addTransactions!!!
const addTransaction = async (req, res) => {
    const newTransaction = req.body;

    const isValidSrc = await isValidUserPassportID(newTransaction.srcPassportID);
    // const isValidDst = await isValidUserPassportID(newTransaction.dstPassportID);
    const operation = newTransaction.operationType;
    const transaction = new Transaction(newTransaction);
    if (!isValidSrc) {
        res.status(404).send(err);
    }

    try {
        switch (operation) {
            case 'depositing':
                const bankAccount = BankAccount.findOneAndUpdate({})

        }
        if ((isValidSrc && isValidDst) && (newTransaction.srcPassportID !== newTransaction.dstPassportID)) {
            await transaction.save();
            res.status(201).send(transaction);
        }
        else {
            res.status(404).send(err);
        }

    } catch (err) {

        res.status(400).send(err);
    }
}

module.exports = {
    getAllTransactions,
    getTransactionsByPassportID,
    addTransaction
}