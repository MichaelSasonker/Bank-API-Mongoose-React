const mongoose = require('mongoose');
const validator = require('validator');
const isPositiveInt = require('../utils/is_positive_int_function');

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
    srcAccountNumber: {
        type: Number,
        default: 1,
        required: false,
        validate(value) {
            if (isPositiveInt(value) === false) {
                throw new Error('Invalid account number!');
            }
        }
    },
    dstPassportID: {
        type: String,
        required: false,
        default: '111111111',
        trim: true,
        validate(value) {
            if (value.length !== 9 || !validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid passport ID!');
            }
        }
    },
    dstAccountNumber: {
        type: Number,
        default: 1,
        required: false,
        validate(value) {
            if (isPositiveInt(value) === false) {
                throw new Error('Invalid account number!');
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
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (!isPositiveInt(value)) {
                throw new Error('Invalid money amount!');
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