const mongoose = require('mongoose');
const validator = require('validator');

const OPERATIONS_TYPE = ['depositing', 'update_credit', 'withdraw', 'transferring'];

const Transaction = mongoose.model('Transaction', {
    srcPassportID: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length !== 9 || !validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid passport ID!');
            }
        }
    },
    dstPassportID: {
        type: String,
        required: false,
        default: '',
        // default: this.srcPassportID,
        trim: true,
        validate(value) {
            if (value.length !== 9 || !validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid passport ID!');
            }
        }
    },
    operationType: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!OPERATIONS_TYPE.includes(value.toLowerCase())) {
                throw new Error('Invalid operation type!');
            }
        }
    },
    amount: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isInt(value, { allow_leading_zeroes: false } && parseInt(value))) {
                throw new Error('Invalid passport ID!');
            }
        }
    },
    operationDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
})

module.exports = Transaction;