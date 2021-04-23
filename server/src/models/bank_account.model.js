const mongoose = require('mongoose');
const validator = require('validator');
const isPositiveInt = require('../utils/is_positive_int_function');

const BankAccount = mongoose.model('BankAccount', {
    passportID: {
        type: String,
        required: true,
        trim: true,
        //TODO: more than one account!
        // unique: true,
        validate(value) {
            if (value.length !== 9 || !validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid passport ID!');
            }
        }
    },
    accountNumber: {
        type: Number,
        required: false,
        default: 1,
        validate(value) {
            if (isPositiveInt(value) === false) {
                throw new Error('Invalid account number!');
            }
        }
    },
    credit: {
        type: String,
        required: false,
        default: 0,
        trim: true,
        validate(value) {
            if (!validator.isInt(value, { allow_leading_zeroes: false }) && parseInt(value) >= 0) {
                throw new Error('Invalid credit number!');
            }
        }
    },
    cash: {
        type: String,
        required: false,
        default: 0,
        trim: true,
        validate(value) {
            if (!validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid credit number!');
            }
        }
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true,
    }
})



module.exports = BankAccount;