const Transaction = require('../models/transaction.model');
const BankAccount = require('../models/bank_account.model');
const isPositiveInt = require('../utils/is_positive_int_function');
const isActiveBankAccount = require('../utils/is_active_bank_account');

const getAllTransactions = async (req, res) => {
    try {
        const result = await Transaction.find({});
        if (result === null) {
            return res.status(404).send('No transactions');
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
            return res.status(404).send('No transactions for this ID!');
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

    const isActiveSrc = await isActiveBankAccount(newTransaction.srcPassportID);

    const operation = newTransaction.operationType;

    if (!isActiveSrc || !isPositiveInt(newTransaction.amount)) {
        return res.status(404).send('Not an active source account OR invalid amount number!');
    }

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
                    return res.status(404).send('No bank account for this ID!');
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
                    return res.status(404).send('No bank account for this ID!');
                } else {
                    const transaction = new Transaction(newTransaction);
                    await transaction.save();
                    return res.status(201).send(transaction);
                }

            case 'withdraw':
                if (newTransaction.srcAccountNumber !== undefined) {
                    const oldUserBankAccount = await BankAccount.findOne({ passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber });
                    if (!oldUserBankAccount) {
                        return res.status(404).send('No bank account for this ID!');
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
                        return res.status(404).send('No bank account for this ID!');
                    }
                    else if (oldUserBankAccount.cash - newTransaction.amount < (-1) * oldUserBankAccount.credit) {
                        return res.status(200).send('You need to increase your credit!');
                    }
                    userBankAccount = await BankAccount.findOneAndUpdate(
                    { passportID: newTransaction.srcPassportID, accountNumber: 1 },
                    { $inc: {cash: -newTransaction.amount} }, {new: true, runValidators: true });
                }

                //maybe not relevant
                if (!userBankAccount) {
                    return res.status(404).send('No bank account for this ID!');
                } else {
                    const transaction = new Transaction(newTransaction);
                    await transaction.save();
                    return res.status(201).send(transaction);
                }

            case 'transferring':
                let dstBankAccount;
                const isActiveDst = isActiveBankAccount(newTransaction.dstPassportID);
                if (!isActiveDst) {
                    return res.status(404).send('Not an active destination account!');
                } else if (newTransaction.srcPassportID === newTransaction.dstPassportID && newTransaction.srcAccountNumber === newTransaction.dstAccountNumber) {
                    return res.status(404).send('Source and destination accounts are equals!');
                }
                else if (newTransaction.srcAccountNumber !== undefined && newTransaction.dstAccountNumber !== undefined) {
                    const oldSrcBankAccount = await BankAccount.findOne({ passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber });
                    const oldDstBankAccount = await BankAccount.findOne({ passportID: newTransaction.dstPassportID, accountNumber: newTransaction.dstAccountNumber });

                    if (!oldSrcBankAccount || !oldDstBankAccount) {
                        return res.status(404).send('No bank account for source OR destination ID!');
                    }
                    else if (oldSrcBankAccount.cash - newTransaction.amount < (-1) * oldSrcBankAccount.credit) {
                        return res.status(404).send('You need to increase your credit!');
                    }
                    srcBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber },
                        { $inc: {cash: -newTransaction.amount} }, {new: true, runValidators: true });
                    dstBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.dstPassportID, accountNumber: newTransaction.dstAccountNumber },
                        { $inc: {cash: newTransaction.amount} }, {new: true, runValidators: true });
                } 
                else if (newTransaction.srcAccountNumber === undefined && newTransaction.dstAccountNumber === undefined) {
                    const oldSrcBankAccount = await BankAccount.findOne({ passportID: newTransaction.srcPassportID, accountNumber: 1 });
                    const oldDstBankAccount = await BankAccount.findOne({ passportID: newTransaction.dstPassportID, accountNumber: 1 });

                    if (!oldSrcBankAccount || !oldDstBankAccount) {
                        return res.status(404).send('No bank account for source OR destination ID!');
                    }
                    else if (oldSrcBankAccount.cash - newTransaction.amount < (-1) * oldSrcBankAccount.credit) {
                        return res.status(404).send('You need to increase your credit!');
                    }
                    srcBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.srcPassportID, accountNumber: 1 },
                        { $inc: {cash: -newTransaction.amount} }, {new: true, runValidators: true });
                    dstBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.dstPassportID, accountNumber: 1 },
                        { $inc: {cash: newTransaction.amount} }, {new: true, runValidators: true });
                }
                else {
                    let oldSrcBankAccount, oldDstBankAccount;
                    if (newTransaction.srcAccountNumber === undefined && newTransaction.dstAccountNumber !== undefined) {
                        oldSrcBankAccount = await BankAccount.findOne({ passportID: newTransaction.srcPassportID, accountNumber: 1 });
                        oldDstBankAccount = await BankAccount.findOne({ passportID: newTransaction.dstPassportID, accountNumber: newTransaction.dstAccountNumber });
                    } else {
                        oldSrcBankAccount = await BankAccount.findOne({ passportID: newTransaction.srcPassportID, accountNumber: newTransaction.srcAccountNumber });
                        oldDstBankAccount = await BankAccount.findOne({ passportID: newTransaction.dstPassportID, accountNumber: 1 });
                    }
                    if (!oldSrcBankAccount || !oldDstBankAccount) {
                        return res.status(404).send('No bank account for source OR destination ID!');
                    }
                    else if (oldSrcBankAccount.cash - newTransaction.amount < (-1) * oldSrcBankAccount.credit) {
                        return res.status(404).send('You need to increase your credit!');
                    }
                    srcBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.srcPassportID, accountNumber: 1 },
                        { $inc: {cash: -newTransaction.amount} }, {new: true, runValidators: true });
                    dstBankAccount = await BankAccount.findOneAndUpdate(
                        { passportID: newTransaction.dstPassportID, accountNumber: 1 },
                        { $inc: {cash: newTransaction.amount} }, {new: true, runValidators: true });
                } 

                //maybe not relevant
                if (!srcBankAccount || !dstBankAccount) {
                    return res.status(404).send('No bank account for source OR destination ID!');
                } else {
                    const transaction = new Transaction(newTransaction);
                    await transaction.save();
                    return res.status(201).send(transaction);
                }

            default:
                return res.status(400).send('No operation!');
        }

    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports = {
    getAllTransactions,
    getTransactionsByPassportID,
    addTransaction
}