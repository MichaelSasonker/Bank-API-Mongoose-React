const mongoose = require('mongoose');
const validator = require('validator');

const BankAccount = mongoose.model('BankAccount', {
    passportID: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length !== 9 || !validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid passport ID!');
            }
        }
    },
    credit: {
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